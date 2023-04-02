import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getCosts(authorizedCapital: number, productVolume: number): number {
    return authorizedCapital / productVolume;
  }
}
