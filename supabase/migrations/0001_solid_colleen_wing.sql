CREATE TABLE IF NOT EXISTS "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticketId" uuid DEFAULT gen_random_uuid(),
	"order" integer NOT NULL,
	"flightId" varchar NOT NULL,
	"searchId" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "airlines" RENAME COLUMN "alliances_alliance_id" TO "allianceId";--> statement-breakpoint
ALTER TABLE "airports" RENAME COLUMN "destinations_destination_id" TO "destinationId";--> statement-breakpoint
ALTER TABLE "flights" RENAME COLUMN "airlines_airline_id" TO "airlineId";--> statement-breakpoint
ALTER TABLE "flights" RENAME COLUMN "destinations_destination_id_from" TO "fromDestinationId";--> statement-breakpoint
ALTER TABLE "flights" RENAME COLUMN "destinations_destination_id_to" TO "toDestinationId";--> statement-breakpoint
ALTER TABLE "searches" RENAME COLUMN "destinations_destination_id_from" TO "fromDestinationSearchUUID";--> statement-breakpoint
ALTER TABLE "searches" RENAME COLUMN "destinations_destination_id_to" TO "toDestinationSearchUUID";--> statement-breakpoint
ALTER TABLE "airlines" DROP CONSTRAINT "airlines_alliances_alliance_id_alliances_id_fk";
--> statement-breakpoint
ALTER TABLE "airports" DROP CONSTRAINT "destination_fk";
--> statement-breakpoint
ALTER TABLE "searches" DROP CONSTRAINT "searches_destinations_destination_id_from_destinations_id_fk";
--> statement-breakpoint
ALTER TABLE "searches" DROP CONSTRAINT "searches_destinations_destination_id_to_destinations_id_fk";
--> statement-breakpoint
ALTER TABLE "airlines" ALTER COLUMN "name" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "searches" ADD COLUMN "fromAirportSearchUUID" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "searches" ADD COLUMN "toAirportSearchUUID" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "searches" ADD COLUMN "airlinesSearchUUID" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "searches" ADD COLUMN "allianceSearchUUID" varchar DEFAULT '';