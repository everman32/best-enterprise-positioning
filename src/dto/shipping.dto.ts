import { Customer } from "../type/customer.type";

export class ShippingDto {
  authorizedCapital: number;
  threshold: number;
  customers: Customer[];
}
