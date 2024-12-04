CREATE TABLE IF NOT EXISTS "airlines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"alliances_alliance_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "airports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(5) NOT NULL,
	"name" varchar(100) NOT NULL,
	"destinations_destination_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alliances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) DEFAULT '',
	"country" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"airlines_airline_id" uuid,
	"destinations_destination_id_from" uuid,
	"destinations_destination_id_to" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdTimestamp" timestamp DEFAULT now(),
	"destinations_destination_id_from" uuid NOT NULL,
	"destinations_destination_id_to" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "airlines" ADD CONSTRAINT "airlines_alliances_alliance_id_alliances_id_fk" FOREIGN KEY ("alliances_alliance_id") REFERENCES "public"."alliances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "airports" ADD CONSTRAINT "destination_fk" FOREIGN KEY ("destinations_destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "searches" ADD CONSTRAINT "searches_destinations_destination_id_from_destinations_id_fk" FOREIGN KEY ("destinations_destination_id_from") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "searches" ADD CONSTRAINT "searches_destinations_destination_id_to_destinations_id_fk" FOREIGN KEY ("destinations_destination_id_to") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
