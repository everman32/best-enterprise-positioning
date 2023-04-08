import { Customer } from "../type/customer.type";

export class ShippingDto {
  authorizedCapital: number;
  iterationNumber: number;
  customers: Customer[];
}
