import { Injectable } from "@nestjs/common";

@Injectable()
export class HpsService {
  health() {
    return { module: "hps", status: "ok" };
  }
}
