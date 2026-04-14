import { Injectable } from "@nestjs/common";

@Injectable()
export class ConstructionService {
  health() {
    return { module: "construction", status: "ok" };
  }
}
