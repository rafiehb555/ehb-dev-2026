import { Injectable } from "@nestjs/common";

@Injectable()
export class FashionService {
  health() {
    return { module: "fashion", status: "ok" };
  }
}
