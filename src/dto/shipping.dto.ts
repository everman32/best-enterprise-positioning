import { CustomerDto } from "./customer.dto";

export class ShippingDto {
  authorizedCapital: number;
  productVolume: number;
  iterationNumber: number;
  customers: CustomerDto[];
}
