import db from "@/db/db";
import SearchFilters from "@/types/db/SearchFilter";
import * as UUIDService from "@/services/utilities/uuid";
import * as DateService from "@/services/utilities/dates";

export const get = async (
  filters: SearchFilters
): Promise<string | undefined> => {
  /**
   * Using the search parameters in the `searchFilters` object, get a list of flights.
   * Each filter should be a comma-delimited string.
   *  */
  const prepared = await db.query.searches
    .findFirst({
      where: (searches, { eq, and, sql, or, lte }) =>
        or(
          and(
            eq(
              searches.fromDestinationSearchUUID,
              sql.placeholder("fromDestinationSearchUUID")
            ),
            eq(
              searches.toDestinationSearchUUID,
              sql.placeholder("toDestinationSearchUUID")
            ),
            eq(
              searches.fromAirportSearchUUID,
              sql.placeholder("fromAirportSearchUUID")
            ),
            eq(
              searches.toAirportSearchUUID,
              sql.placeholder("toAirportSearchUUID")
            ),
            eq(
              searches.airlinesSearchUUID,
              sql.placeholder("airlinesSearchUUID")
            ),
            eq(
              searches.allianceSearchUUID,
              sql.placeholder("allianceSearchUUID")
            ),
            lte(searches.createdTimestamp, sql.placeholder("createdTimestamp"))
          ),
          and(
            eq(searches.id, sql.placeholder("cachedSearchId")),
            lte(searches.createdTimestamp, sql.placeholder("createdTimestamp"))
          )
        ),
      columns: {
        id: true,
      },
    })
    .prepare("search_for_search_id");
  const queryParams = {
    cachedSearchId: filters.cachedSearchId ?? "",
    createdTimestamp: DateService.get({ expiry: true }),
    fromDestinationSearchUUID: UUIDService.get(filters.fromDestinationId),
    toDestinationSearchUUID: UUIDService.get(filters.toDestinationId),
    fromAirportSearchUUID: UUIDService.get(filters.fromAirportId ?? ""),
    toAirportSearchUUID: UUIDService.get(filters.toAirportId ?? ""),
    airlinesSearchUUID: UUIDService.get(filters.airlineIds ?? ""),
    allianceSearchUUID: UUIDService.get(filters.allianceId ?? ""),
  };
  const searchRow = await prepared.execute({ ...queryParams });
  return searchRow?.id;
};
