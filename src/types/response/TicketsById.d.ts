import Ticket from "@/types/response/Ticket";

type TicketsById = {
  [ticketId: string]: {
    [orderNumber: number]: Ticket;
  };
};

export default TicketsById;
