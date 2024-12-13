import express from "express";

import publicRoutes from "@/constants/publicRoutes";

import isBearerTokenValid from "@/services/auth/isBearerTokenValid";

import { destinationRoutes } from "@/routes/destinationRoutes";
import { ticketRoutes } from "@/routes/ticketRoutes";

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (!publicRoutes.includes(req.path)) {
    const bearerTokenVerified = await isBearerTokenValid(
      req.headers.authorization
    );
    if (!bearerTokenVerified.success) {
      res.json(bearerTokenVerified);
      return;
    }
    req.body.userId = bearerTokenVerified.payload;
  }
  next();
});

app.use("/api/destinations", destinationRoutes);
app.use("/api/tickets", ticketRoutes);
