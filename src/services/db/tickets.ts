import db from "@/db/db";
import SearchFilters from "@/types/db/SearchFilter";
import Ticket from "@/types/response/Ticket";
import * as SearchService from "@/services/db/searches";

export const get = async (filters: SearchFilters): Promise<Ticket[]> => {
  const cachedId = await SearchService.get(filters);
  if (cachedId) {
    const prepared = await db.query.trips
      .findMany({
        where: (trips, { eq }) => eq(trips.searchId, cachedId),
        with: {
          flight: {
            with: {
              from: {
                with: {
                  airports: {
                    where: (airports, { eq, or, and, sql }) =>
                      and(
                        eq(
                          airports.destinationId,
                          sql.placeholder("fromDestinationId")
                        ),
                        or(
                          eq(airports.id, sql.placeholder("fromAirportId")),
                          eq(sql.placeholder("fromAirportId"), "")
                        )
                      ),
                  },
                },
              },
              to: {
                with: {
                  airports: {
                    where: (airports, { eq, or, and, sql }) =>
                      and(
                        eq(
                          airports.destinationId,
                          sql.placeholder("toDestinationId")
                        ),
                        or(
                          eq(airports.id, sql.placeholder("toAirportId")),
                          eq(sql.placeholder("toAirportId"), "")
                        )
                      ),
                  },
                },
              },
            },
          },
        },
      })
      .prepare("cached_trips_query");
    const cachedTrips = await prepared.execute({
      fromDestinationId: filters.fromDestinationId,
      toDestinationId: filters.toDestinationId,
      fromAirportId: filters.fromAirportId ?? "",
      toAiportId: filters.toAirportId ?? "",
    });
    return cachedTrips;
  } else {
    throw Error("BFS/DFS not yet implemented");
  }
  return [];
};
