import { Test, TestingModule } from "@nestjs/testing";
import { EnterpriseController } from "./enterprise.controller";
import { EnterpriseService } from "./enterprise.service";

describe("AppController", () => {
  let enterpriseController: EnterpriseController;

  const AUTHORIZED_CAPITAL = 5.5;
  const PRODUCT_VOLUME = 2.1;
  const COSTS = 2.6194;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EnterpriseController],
      providers: [EnterpriseService],
    }).compile();

    enterpriseController = app.get<EnterpriseController>(EnterpriseController);
  });

  describe("root", () => {
    it(`should return ${COSTS}`, () => {
      expect(
        enterpriseController.getPresentCosts(AUTHORIZED_CAPITAL, PRODUCT_VOLUME)
      ).toBeCloseTo(COSTS, 3);
    });
  });
});
