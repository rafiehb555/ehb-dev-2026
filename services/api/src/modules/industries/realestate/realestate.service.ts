import { Injectable } from "@nestjs/common";

@Injectable()
export class RealestateService {
  health() {
    return { module: "realestate", status: "ok" };
  }
}
