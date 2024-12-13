import Destination from "@/types/response/Destination";
import Flight from "@/types/response/Flight";

type Ticket = {
  id: string;
  ticketId: string;
  order: number;
  flightId: string;
  searchId: string;
  flight: Flight;
};

export default Ticket;
