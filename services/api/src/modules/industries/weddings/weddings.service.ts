import { Injectable } from "@nestjs/common";

@Injectable()
export class WeddingsService {
  health() {
    return { module: "weddings", status: "ok" };
  }
}
