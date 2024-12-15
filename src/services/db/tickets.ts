import { getCachedTrips } from "@/db/queries";
import { SelectFlight } from "@/db/schema";

import SearchFilters from "@/types/db/SearchFilter";
import Ticket from "@/types/response/Ticket";
import Flight from "@/types/response/Flight";

import * as SearchService from "@/services/db/searches";
import * as FlightService from "@/services/db/flights";

const isArrivingFlight = (filters: SearchFilters, flight: Flight): boolean => {
  return (
    flight.toAirport.id === filters.toAirportId ||
    flight.to.id === filters.toDestinationId
  );
};

const isStartingFlight = (filters: SearchFilters, flight: Flight): boolean => {
  return (
    flight.fromAirport.id === filters.fromAirportId ||
    flight.from.id === filters.fromDestinationId
  );
};

export const get = async (filters: SearchFilters): Promise<Ticket[]> => {
  const cachedId = await SearchService.get(filters);
  if (cachedId) {
    const query = await getCachedTrips(cachedId);
    const cachedTrips = await query.execute({
      fromDestinationId: filters.fromDestinationId,
      toDestinationId: filters.toDestinationId,
      fromAirportId: filters.fromAirportId ?? "",
      toAiportId: filters.toAirportId ?? "",
    });
    return cachedTrips;
  }
  const flights = await FlightService.get(filters);
  const startingFlights: Flight[] = [];
  const flightsByArrivingAirportId: {
    [airportId: Flight["toAirport"]["id"]]: Flight[];
  } = {};
  flights.forEach((flight) => {
    if (isStartingFlight(filters, flight)) {
      startingFlights.push(flight);
    }
    if (flightsByArrivingAirportId[flight.toAirport.id]) {
      flightsByArrivingAirportId[flight.toAirport.id].push(flight);
    } else {
      flightsByArrivingAirportId[flight.toAirport.id] = [flight];
    }
  });
  if (startingFlights.length === 0) {
    throw new Error("Invalid search -- could not find starting airport(s)");
  }
  const results: Flight[][] = [];
  startingFlights.forEach((startingFlight) => {
    const visitedAirports: Flight["fromAirport"]["id"][] = [];
    const paths: Flight[][] = [[startingFlight]];
    while (paths.length > 0) {
      const currPath = paths.shift()!;
      const currFlight = currPath[currPath.length - 1];
      if (isArrivingFlight(filters, currFlight)) {
        results.push(currPath);
      } else if (currPath.length > 5) {
        continue;
      }
      const flightsOut = flightsByArrivingAirportId[currFlight.toAirport.id];
      flightsOut.forEach((departingFlight) => {
        if (visitedAirports.includes(departingFlight.toAirport.id)) {
          return;
        }
        paths.push([...currPath, departingFlight]);
      });
      visitedAirports.push(currFlight.toAirport.id);
    }
  });
  const tickets: Ticket[] = [];
  results.forEach((path) => {
    path.forEach((flight, ind) => {
      tickets.push({
        id: "",
        ticketId: "",
        order: ind,
        flightId: flight.id,
        searchId: "",
        flight: flight,
      });
    });
  });
  return tickets;
};
