import db from "@/db/db";

export const get = async (searchText?: string) => {
  /**
   * Using an optional `searchText` string, get a list of flight destinations.
   * Response: {
   *   destinations: DestinationRows;
   *   airports: AirportRows | null;
   * }
   */
  searchText = searchText ?? "";
  const query = await db.query.destinations.findMany({
    with: {
      airports: true,
    },
    where: (destinations, { like, or }) => {
      return or(
        like(destinations.city, searchText),
        like(destinations.country, searchText),
        like(destinations.state, searchText)
      );
    },
    limit: 50,
  });
  return query;
};
