type SearchFilters = {
  fromDestinationId: string;
  toDestinationId: string;
  cachedSearchId?: string;
  fromAirportId?: string;
  toAirportId?: string;
  airlineIds?: Uint8Array;
  allianceIds?: Uint8Array;
};

export default SearchFilters;
