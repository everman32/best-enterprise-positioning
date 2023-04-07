import { Customer } from "../types/customer.types";

export class ShippingDto {
  authorizedCapital: number;
  productVolume: number;
  iterationNumber: number;
  customers: Customer[];
}
