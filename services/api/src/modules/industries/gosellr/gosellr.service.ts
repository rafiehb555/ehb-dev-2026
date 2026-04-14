import { Injectable } from "@nestjs/common";

@Injectable()
export class GosellrService {
  health() {
    return { module: "gosellr", status: "ok" };
  }
}
