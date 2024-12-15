import Airline from "@/types/response/Airline";
import Airport from "@/types/response/Airport";
import Destination from "@/types/response/Destination";

type Flight = {
  id: string;
  airlineId: string;
  from: Destination;
  to: Destination;
  fromAirport: Airport;
  toAirport: Airport;
};

export default Flight;
