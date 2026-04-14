import { Injectable } from "@nestjs/common";

@Injectable()
export class EnergyService {
  health() {
    return { module: "energy", status: "ok" };
  }
}
