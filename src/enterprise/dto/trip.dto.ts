import { Customer } from "../enterprise.constants";

export class TripDto {
  threshold: number;
  customers: Customer[];
}
