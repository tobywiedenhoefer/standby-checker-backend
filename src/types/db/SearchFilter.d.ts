type SearchFilters = {
  fromDestinationId: string;
  toDestinationId: string;
  cachedSearchId?: string;
  fromAirportId?: string;
  toAirportId?: string;
  airlineIds?: Uint8Array;
  allianceId?: string;
};

export default SearchFilters;
