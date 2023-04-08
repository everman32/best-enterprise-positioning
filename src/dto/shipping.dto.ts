import { Customer } from "../type/customer.type";

export class ShippingDto {
  authorizedCapital: number;
  productVolume: number;
  iterationNumber: number;
  customers: Customer[];
}
