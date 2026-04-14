import { Injectable } from "@nestjs/common";

@Injectable()
export class FoodService {
  health() {
    return { module: "food", status: "ok" };
  }
}
