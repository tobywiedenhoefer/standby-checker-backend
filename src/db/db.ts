import Bun from "bun"

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';


const client = new Client({
    host: Bun.env.DB_HOST,
    port: Number.parseInt(Bun.env.DB_PORT ?? "5432"),
    user: Bun.env.DB_USER,
    password: Bun.env.DB_PASS,
    database: Bun.env.DB_NAME
})

client.connect().then(() => console.log("successfully connected")).catch((e) => console.log("failure: ", e))

export default drizzle(client)
