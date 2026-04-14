import { Injectable } from "@nestjs/common";

@Injectable()
export class FitnessService {
  health() {
    return { module: "fitness", status: "ok" };
  }
}
