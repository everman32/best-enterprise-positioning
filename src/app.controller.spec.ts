import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  const AUTHORIZED_CAPITAL = 5.5;
  const PRODUCT_VOLUME = 2.1;
  const COSTS = 2.6194;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it(`should return ${COSTS}`, () => {
      expect(
        appController.getPresentCosts(AUTHORIZED_CAPITAL, PRODUCT_VOLUME)
      ).toBeCloseTo(COSTS, 3);
    });
  });
});
