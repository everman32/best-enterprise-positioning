import { Test, TestingModule } from "@nestjs/testing";
import { GeolocationService } from "../geolocation/geolocation.service";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";

describe("CustomerModule", () => {
  let customerController: CustomerController;

  const AUTHORIZED_CAPITAL = 5.5;
  const PRODUCT_VOLUME = 2.1;
  const COSTS = 2.6194;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, GeolocationService],
    }).compile();

    customerController = app.get<CustomerController>(CustomerController);
  });

  describe("getPresentCosts", () => {
    it(`should return ${COSTS}`, () => {
      expect(
        customerController.getPresentCosts(AUTHORIZED_CAPITAL, PRODUCT_VOLUME)
      ).toBeCloseTo(COSTS, 3);
    });
  });
});
