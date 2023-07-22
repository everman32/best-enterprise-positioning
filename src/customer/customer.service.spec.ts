import { Test, TestingModule } from "@nestjs/testing";
import { GeolocationService } from "../geolocation/geolocation.service";
import { CustomerService } from "./customer.service";

describe("CustomerService", () => {
  let customerService: CustomerService;

  const AUTHORIZED_CAPITAL = 5.5;
  const PRODUCT_VOLUME = 2.1;
  const COSTS = 2.6194;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, GeolocationService],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
  });

  it("should be defined", () => {
    expect(customerService).toBeDefined();
  });

  it(`should return ${COSTS}`, () => {
    expect(
      customerService.getPresentCosts(AUTHORIZED_CAPITAL, PRODUCT_VOLUME)
    ).toBeCloseTo(COSTS, 3);
  });
});
