import db from "@/db/db";

export const getCachedTrips = async (cachedId: string) =>
  await db.query.trips
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
            fromAirport: true,
            toAirport: true,
          },
        },
      },
    })
    .prepare("cached_trips_query");
