import Airline from "@/types/response/Airline";
import Destination from "@/types/response/Destination";

type Flight = {
  id: string;
  airlineId: string;
  from: Destination;
  to: Destination;
};

export default Flight;
