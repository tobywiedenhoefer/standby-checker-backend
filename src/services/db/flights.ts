import db from "@/db/db";
import SearchFilters from "@/types/db/SearchFilter";

export const get = async (filters: SearchFilters) => {
  try {
    const prepared = await db.query.flights
      .findMany({
        where: (flights, { eq, or, sql }) =>
          or(
            eq(flights.airlineId, sql.placeholder("airlineId")),
            eq(sql.placeholder("airlineId"), "")
          ),
        with: {
          from: {
            with: {
              airports: true,
            },
          },
          to: {
            with: {
              airports: true,
            },
          },
          airline: {
            with: {
              alliance: true,
            },
          },
          fromAirport: true,
          toAirport: true,
        },
      })
      .prepare("flights_query");
    const flights = await prepared.execute({
      airlineId: filters.airlineIds ?? "",
    });
    return !filters.allianceId
      ? flights
      : flights.filter((row) => row.airline.allianceId === filters.allianceId);
  } catch (e) {
    throw new Error(`Error thrown while querying flights: ${e}`);
  }
};
