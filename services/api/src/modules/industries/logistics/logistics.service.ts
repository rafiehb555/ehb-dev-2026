import { Injectable } from "@nestjs/common";

@Injectable()
export class LogisticsService {
  health() {
    return { module: "logistics", status: "ok" };
  }
}
