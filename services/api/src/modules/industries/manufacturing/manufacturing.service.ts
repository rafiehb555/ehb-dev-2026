import { Injectable } from "@nestjs/common";

@Injectable()
export class ManufacturingService {
  health() {
    return { module: "manufacturing", status: "ok" };
  }
}
