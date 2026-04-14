import { Injectable } from "@nestjs/common";

@Injectable()
export class TelecomService {
  health() {
    return { module: "telecom", status: "ok" };
  }
}
