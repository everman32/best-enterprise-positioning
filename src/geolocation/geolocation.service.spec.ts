import { Test, TestingModule } from "@nestjs/testing";
import { GeolocationService } from "../geolocation/geolocation.service";

describe("GeolocationService", () => {
  let geolocationService: GeolocationService;

  const FIRST_POINT = { longitude: 0.55123, latitude: 0.72616 };
  const SECOND_POINT = { longitude: 0.99847, latitude: 0.92154 };
  const DISTANCE = 54.26;

  const DEGRESS = 90;
  const RADIANS = 1.57;

  const DECIMAL = 0.55123286716967;
  const COORDINATES = 0.55123;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    }).compile();

    geolocationService = module.get<GeolocationService>(GeolocationService);
  });

  it("should be defined", () => {
    expect(geolocationService).toBeDefined();
  });

  it(`getDistanceBetweenPoints should return ${DISTANCE}`, () => {
    expect(
      geolocationService.getDistanceBetweenPoints(
        FIRST_POINT.latitude,
        FIRST_POINT.longitude,
        SECOND_POINT.latitude,
        SECOND_POINT.longitude
      )
    ).toBeCloseTo(DISTANCE);
  });

  it(`degreesToRadians should return ${RADIANS}`, () => {
    expect(geolocationService.degreesToRadians(DEGRESS)).toBeCloseTo(RADIANS);
  });

  it(`roundDecimalToCoordinates should return ${COORDINATES}`, () => {
    expect(geolocationService.roundDecimalToCoordinates(DECIMAL)).toBeCloseTo(
      COORDINATES
    );
  });
});
