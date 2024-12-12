import { Router } from "express";

import * as Destinations from "@/services/db/destinations";

import Destination from "@/types/response/Destination";
import ApiResponse from "@/types/response/ApiResponse";

const router = Router();

router.get("/search?searchText=:searchText", async (req, res) => {
  /**
   * Get a list of destinations.
   * Request: {
   *   searchText: string
   * }
   * Response: {
   *   success: true,
   *   payload: Destination[],
   * } | {
   *   errorCode: number,
   *   errorMessage: string,
   * }
   */
  const searchText = req.params.searchText ?? "";
  let resp: ApiResponse<Destination[]>;
  try {
    const query = await Destinations.get(searchText);
    resp = {
      success: true,
      payload: query.map((row) => ({
        ...row,
      })),
    };
    res.status(200).json(resp);
  } catch (e) {
    resp = {
      success: false,
      errorCode: 1,
      errorMessage: `Error while getting destinations: ${e}`,
    };
    res.status(500).json(resp);
  }
});

export { router as destinationRoutes };
