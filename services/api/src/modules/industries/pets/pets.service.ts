import { Injectable } from "@nestjs/common";

@Injectable()
export class PetsService {
  health() {
    return { module: "pets", status: "ok" };
  }
}
