import db from "@/db/db";
import SearchFilters from "@/types/db/SearchFilter";

export const get = async (filters: SearchFilters) => {
  const prepared = await db.query.flights
    .findMany({
      where: (flights, { eq, or, sql }) =>
        or(
          eq(flights.airlineId, sql.placeholder("airlineId")),
          eq(sql.placeholder("airlineId"), "")
        ),
      with: {
        from: true,
        to: true,
        airline: {
          with: {
            alliance: true,
          },
        },
      },
    })
    .prepare("flights_query");
  const flights = await prepared.execute({
    airlineId: filters.airlineIds ?? "",
  });
  return !filters.allianceId
    ? flights
    : flights.filter((row) => row.airline.allianceId === filters.allianceId);
};
