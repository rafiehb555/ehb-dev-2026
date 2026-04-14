import { Injectable } from "@nestjs/common";

@Injectable()
export class SportsService {
  health() {
    return { module: "sports", status: "ok" };
  }
}
