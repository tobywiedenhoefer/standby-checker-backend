import Airline from "@/types/response/Airline";
import Destination from "@/types/response/Destination";

type Flight = {
  id: string;
  airline: Airline;
  destination: {
    from: Destination;
    to: Destination;
  };
};

export default Flight
