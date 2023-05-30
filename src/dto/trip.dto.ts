import { Customer } from "../type/customer.type";

export class TripDto {
  authorizedCapital: number;
  threshold: number;
  customers: Customer[];
}
