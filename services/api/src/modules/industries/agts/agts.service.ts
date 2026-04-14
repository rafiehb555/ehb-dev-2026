import { Injectable } from "@nestjs/common";

@Injectable()
export class AgtsService {
  health() {
    return { module: "agts", status: "ok" };
  }
}
