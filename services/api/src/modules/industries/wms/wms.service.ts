import { Injectable } from "@nestjs/common";

@Injectable()
export class WmsService {
  health() {
    return { module: "wms", status: "ok" };
  }
}
