import { Injectable } from "@nestjs/common";

@Injectable()
export class BeautyService {
  health() {
    return { module: "beauty", status: "ok" };
  }
}
