import { TestingModule, Test } from "@nestjs/testing";
import { CustomerService } from "../customer/customer.service";
import { GeolocationService } from "../geolocation/geolocation.service";
import { EnterpriseService } from "./enterprise.service";

describe("EnterpriseModule", () => {
  let enterpriseService: EnterpriseService;

  const AUTHORIZED_CAPITAL = 5721;
  const THRESHOLD = 5;

  const CUSTOMERS = [
    {
      coordinates: {
        longitude: 0.55123,
        latitude: 0.72616,
      },
      transportTariff: 3.1,
      productVolume: 0.521,
    },
    {
      coordinates: {
        longitude: 0.81361,
        latitude: 0.92154,
      },
      transportTariff: 3.4,
      productVolume: 2.3,
    },
    {
      coordinates: {
        longitude: 0.72159,
        latitude: 0.91028,
      },
      transportTariff: 2.4,
      productVolume: 1.2,
    },
  ];

  const OPTIMAL_POSITIONING = {
    latitude: 0.91693,
    longitude: 0.79731,
  };

  const INITIAL_POSITIONING = {
    latitude: 0.8932830603080771,
    longitude: 0.7576796756014974,
  };

  const ITERATIVE_POSITIONING = {
    latitude: 0.9116865413694935,
    longitude: 0.7730386858530418,
  };

  const TRANSPORT_COSTS = 114.955;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseService, CustomerService, GeolocationService],
    }).compile();

    enterpriseService = module.get<EnterpriseService>(EnterpriseService);
  });

  it("should be defined", () => {
    expect(enterpriseService).toBeDefined();
  });

  it(`getOptimalPositioning should return ${OPTIMAL_POSITIONING}`, () => {
    expect(
      enterpriseService.getOptimalPositioning({
        authorizedCapital: AUTHORIZED_CAPITAL,
        threshold: THRESHOLD,
        customers: CUSTOMERS,
      })
    ).toEqual(OPTIMAL_POSITIONING);
  });

  it(`getInitialPositioning should return ${INITIAL_POSITIONING}`, () => {
    expect(
      enterpriseService.getInitialPositioning(AUTHORIZED_CAPITAL, CUSTOMERS)
    ).toEqual(INITIAL_POSITIONING);
  });

  it(`getIterativePositioning should return ${ITERATIVE_POSITIONING}`, () => {
    expect(
      enterpriseService.getIterativePositioning(
        AUTHORIZED_CAPITAL,
        CUSTOMERS,
        INITIAL_POSITIONING
      )
    ).toEqual(ITERATIVE_POSITIONING);
  });

  it(`getTransportCosts should return ${TRANSPORT_COSTS}`, () => {
    expect(
      enterpriseService.getTransportCosts(CUSTOMERS, INITIAL_POSITIONING)
    ).toBeCloseTo(TRANSPORT_COSTS);
  });
});
