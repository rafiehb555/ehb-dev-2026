import { Injectable } from "@nestjs/common";

@Injectable()
export class OlsService {
  health() {
    return { module: "ols", status: "ok" };
  }
}
