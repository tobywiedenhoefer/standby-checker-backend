import { pgTable, varchar, uuid, foreignKey } from "drizzle-orm/pg-core";

export const alliancesTable = pgTable("alliances", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
});

export const airlinesTable = pgTable(
  "airlines",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull(),
    allianceId: uuid("alliances_alliance_id"),
  },
  (table) => {
    return {
      allianceReference: foreignKey({
        columns: [table.allianceId],
        foreignColumns: [alliancesTable.id],
      }),
    };
  }
);

export const destinationsTable = pgTable("destinations", {
  id: uuid().primaryKey().defaultRandom(),
  city: varchar({ length: 100 }).notNull(),
  state: varchar({ length: 100 }).default(""),
  country: varchar({ length: 100 }).notNull(),
});

export const airportsTable = pgTable(
  "airports",
  {
    id: uuid().primaryKey().defaultRandom(),
    code: varchar({ length: 5 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    destinationId: uuid("destinations_destination_id"),
  },
  (table) => {
    return {
      destinationReference: foreignKey({
        columns: [table.destinationId],
        foreignColumns: [destinationsTable.id],
        name: "destination_fk",
      }),
    };
  }
);

export const flightsTable = pgTable(
  "flights",
  {
    id: uuid().primaryKey().defaultRandom(),
    airlineId: uuid("airlines_airline_id"),
    fromDestination: uuid("destinations_destination_id_from"),
    toDestination: uuid("destinations_destination_id_to"),
  },
  (table) => {
    return {
      airlineReference: foreignKey({
        columns: [table.airlineId],
        foreignColumns: [table.airlineId],
        name: "airline_fk",
      }),
      fromDestinationReference: foreignKey({
        columns: [table.fromDestination],
        foreignColumns: [destinationsTable.id],
      }),
      toDestinationReference: foreignKey({
        columns: [table.toDestination],
        foreignColumns: [destinationsTable.id],
      }),
    };
  }
);


export type SelectFlight = typeof flightsTable.$inferSelect
export type InsertFlight = typeof flightsTable.$inferInsert

export type SelectAirport = typeof airportsTable.$inferSelect
export type InsertAirport = typeof airportsTable.$inferInsert

export type SelectDestination = typeof destinationsTable.$inferSelect
export type InsertDestination = typeof destinationsTable.$inferInsert

export type SelectAirline = typeof airlinesTable.$inferSelect
export type InsertAirline = typeof airlinesTable.$inferInsert

export type SelectAlliance = typeof alliancesTable.$inferSelect
export type InsertAlliance = typeof alliancesTable.$inferInsert
