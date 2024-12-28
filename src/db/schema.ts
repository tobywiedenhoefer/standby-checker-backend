import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

/**
 * User and auth info
 */

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar().notNull().unique(),
  password_hash: varchar().notNull(),
  created_at: timestamp({ mode: "date" }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));

export const tokens = pgTable("tokens", {
  id: uuid().primaryKey().defaultRandom(),
  token: uuid("token").notNull().unique().defaultRandom(),
  created_at: timestamp().notNull().defaultNow(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  users: one(users, {
    fields: [tokens.user_id],
    references: [users.id],
  }),
}));

/**
 * Standby Checker Flight Datas
 */

export const alliances = pgTable("alliances", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
});

export const allianceRelations = relations(alliances, ({ many }) => ({
  airlines: many(airlines),
}));

export const airlines = pgTable("airlines", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 200 }).notNull(),
  allianceId: varchar(),
});

export const airlinesRelations = relations(airlines, ({ one }) => ({
  alliance: one(alliances, {
    fields: [airlines.allianceId],
    references: [alliances.id],
  }),
}));

export const destinations = pgTable("destinations", {
  id: uuid().primaryKey().defaultRandom(),
  city: varchar({ length: 100 }).notNull(),
  state: varchar({ length: 100 }).default(""),
  country: varchar({ length: 100 }).notNull(),
});

export const destinationsRelations = relations(destinations, ({ many }) => ({
  airports: many(airports),
}));

/**
 * Many airports to one destination.
 * ex: Tokyo HND & Tokyo NRT.
 * Many airports for different cities, too.
 * ex: Kyoto KIX & Osaka KIX.
 */
export const airports = pgTable("airports", {
  id: uuid().primaryKey().defaultRandom(),
  code: varchar({ length: 5 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  destinationId: varchar(),
});

export const airportsRelations = relations(airports, ({ one }) => ({
  destination: one(destinations, {
    fields: [airports.destinationId],
    references: [destinations.id],
  }),
}));

export const flights = pgTable("flights", {
  id: uuid().primaryKey().defaultRandom(),
  airlineId: varchar().notNull(),
  fromAirportId: varchar().notNull(),
  toAirportId: varchar().notNull(),
  fromDestinationId: varchar().notNull(),
  toDestinationId: varchar().notNull(),
});

export const flightsRelations = relations(flights, ({ one }) => ({
  from: one(destinations, {
    fields: [flights.fromDestinationId],
    references: [destinations.id],
  }),
  to: one(destinations, {
    fields: [flights.toDestinationId],
    references: [destinations.id],
  }),
  airline: one(airlines, {
    fields: [flights.airlineId],
    references: [airlines.id],
  }),
  fromAirport: one(airports, {
    fields: [flights.fromAirportId],
    references: [airports.id],
  }),
  toAirport: one(airports, {
    fields: [flights.toAirportId],
    references: [airports.id],
  }),
}));

/**
 * Each search parameter will be hashed into a UUID for quick lookup.
 */
export const searches = pgTable("searches", {
  id: uuid().primaryKey().defaultRandom(),
  createdTimestamp: timestamp({ mode: "date" }).defaultNow(),
  fromDestinationSearchUUID: varchar().default(""),
  toDestinationSearchUUID: varchar().default(""),
  fromAirportSearchUUID: varchar().default(""),
  toAirportSearchUUID: varchar().default(""),
  airlinesSearchUUID: varchar().default(""),
  allianceSearchUUID: varchar().default(""),
});

export const searchesRelations = relations(searches, ({ many }) => ({
  trips: many(trips),
}));

export const trips = pgTable("trips", {
  id: uuid().primaryKey().defaultRandom(),
  ticketId: uuid().defaultRandom().notNull(),
  order: integer().notNull(),
  flightId: varchar().notNull(),
  searchId: varchar().notNull(),
});

export const tripsRelations = relations(trips, ({ one }) => ({
  flight: one(flights, { fields: [trips.flightId], references: [flights.id] }),
  search: one(searches, {
    fields: [trips.searchId],
    references: [searches.id],
  }),
}));

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectToken = typeof tokens.$inferSelect;
export type InsertToken = typeof tokens.$inferInsert;

export type SelectFlight = typeof flights.$inferSelect;
export type InsertFlight = typeof flights.$inferInsert;

export type SelectAirport = typeof airports.$inferSelect;
export type InsertAirport = typeof airports.$inferInsert;

export type SelectDestination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

export type SelectAirline = typeof destinations.$inferSelect;
export type InsertAirline = typeof destinations.$inferInsert;

export type SelectAlliance = typeof alliances.$inferSelect;
export type InsertAlliance = typeof alliances.$inferInsert;

export type SelectSearch = typeof searches.$inferSelect;
export type InsertSearch = typeof searches.$inferInsert;

export type SelectTrip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;
