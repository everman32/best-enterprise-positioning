import { Test, TestingModule } from "@nestjs/testing";
import { GeolocationService } from "../geolocation/geolocation.service";
import { CustomerService } from "./customer.service";

describe("CustomerService", () => {
  let customerService: CustomerService;

  const AUTHORIZED_CAPITAL = 5.5;
  const PRODUCT_VOLUME = 2.1;
  const COSTS = 2.619;

  const TRANSPORT_TARIFF = 3.2;
  const MULTIPLIER = 1.221;

  const FIRST_POINT = { longitude: 0.55123, latitude: 0.72616 };
  const SECOND_POINT = { longitude: 0.99847, latitude: 0.92154 };
  const TRANSPORT_COSTS = 364.656;

  const PRECISION = 2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, GeolocationService],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
  });

  it("should be defined", () => {
    expect(customerService).toBeDefined();
  });

  it(`getPresentCosts should return ${COSTS}`, () => {
    expect(
      customerService.getPresentCosts(AUTHORIZED_CAPITAL, PRODUCT_VOLUME)
    ).toBeCloseTo(COSTS, PRECISION);
  });

  it(`getMultiplier should return ${MULTIPLIER}`, () => {
    expect(
      customerService.getMultiplier(
        AUTHORIZED_CAPITAL,
        TRANSPORT_TARIFF,
        PRODUCT_VOLUME
      )
    ).toBeCloseTo(MULTIPLIER, PRECISION);
  });

  it(`getTransportCosts should return ${TRANSPORT_COSTS}`, () => {
    expect(
      customerService.getTransportCosts(
        PRODUCT_VOLUME,
        TRANSPORT_TARIFF,
        FIRST_POINT,
        SECOND_POINT
      )
    ).toBeCloseTo(TRANSPORT_COSTS, PRECISION);
  });
});
