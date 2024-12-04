import Bun from "bun";

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

// on-prem db
/* const client = new Client({
    host: Bun.env.DB_HOST,
    port: Number.parseInt(Bun.env.DB_PORT ?? "5432"),
    user: Bun.env.DB_USER,
    password: Bun.env.DB_PASS,
    database: Bun.env.DB_NAME
}) */

const client = new Client(Bun.env.DB_URI ?? "");

client
  .connect()
  .then(() => console.log("successfully connected to db"))
  .catch(() => {
    console.log("could not connect to db");
  });

export default drizzle(client);
