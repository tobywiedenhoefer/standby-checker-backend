import { Router } from "express";

import * as TicketService from "@/services/db/tickets";
import ApiResponse from "@/types/response/ApiResponse";
import TicketsById from "@/types/response/TicketsById";

const router = Router();

router.post("/search", async (req, res) => {
  /**
   * Get a list of travel tickets.
   * Request Body: {
   *   fromDestinationId: string,
   *   toDestinationId: string,
   *   cachedSearchId?: string,
   *   fromAirportId?: string,
   *   toAirportId?: string,
   *   airlineIds?: string,
   *   allianceIds?: string,
   * }
   */
  let resp: ApiResponse<TicketsById>;
  if (!req.body.fromDestinationId || !req.body.toDestinationId) {
    resp = {
      success: false,
      errorMessage: "Invalid request format",
      errorCode: -1,
    };
    res.status(500).json(resp);
    return;
  }
  const dbResp = await TicketService.get({
    ...req.body,
  });
  const ticketsById: TicketsById = {};
  dbResp.forEach((row) => {
    if (!ticketsById[row.ticketId]) {
      ticketsById[row.ticketId] = {};
    }
    ticketsById[row.ticketId][row.order] = row;
  });
  resp = {
    success: true,
    payload: ticketsById,
  };
  res.status(200).json(resp);
});

export { router as ticketRoutes };
