import { eq, like, or } from "drizzle-orm";

import db from "@/db/db";
import { destinationsTable, airportsTable } from "@/db/schema";

export const get = async (searchText?: string) => {
  /**
   * Using an optional `searchText` string, get a list of flight destinations.
   * Response: {
   *
   * }
   */
  searchText = searchText ?? "";
  const query = await db
    .select()
    .from(destinationsTable)
    .leftJoin(
      airportsTable,
      eq(destinationsTable.id, airportsTable.destinationId)
    )
    .where(
      or(
        like(destinationsTable.city, searchText),
        like(destinationsTable.country, searchText),
        like(destinationsTable.state, searchText),
        like(airportsTable.code, searchText),
        like(airportsTable.name, searchText)
      )
    )
    .limit(50);
  return query;
};
