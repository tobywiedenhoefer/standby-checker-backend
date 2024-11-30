import type Airport from "@/types/response/Airport";

type Destination = {
  id: string;
  city: string;
  state: string | null;
  country: string;
  airports: Airport[];
};
export default Destination;
