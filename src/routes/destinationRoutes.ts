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
    const destinations: { [destId: string]: Destination } = {};
    query.forEach((row) => {
      if (!destinations[row.destinations.id]) {
        destinations[row.destinations.id] = {
          ...row.destinations,
          airports: row.airports ? [{ ...row.airports }] : [],
        };
      } else if (
        row.airports &&
        !destinations[row.destinations.id].airports
          .map((a) => a.id)
          .includes(row.airports.id)
      ) {
        destinations[row.destinations.id].airports.push({ ...row.airports });
      }
      resp = {
        success: true,
        payload: Object.values(destinations),
      };
      res.status(200).json(resp)
    });
  } catch (e) {
    resp = {
      success: false,
      errorCode: 1,
      errorMessage: `Error while getting destinations: ${e}`,
    };
    res.status(500).json(resp)
  }
});

export { router as destinationRoutes }
