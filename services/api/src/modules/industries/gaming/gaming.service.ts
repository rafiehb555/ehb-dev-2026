import { Injectable } from "@nestjs/common";

@Injectable()
export class GamingService {
  health() {
    return { module: "gaming", status: "ok" };
  }
}
