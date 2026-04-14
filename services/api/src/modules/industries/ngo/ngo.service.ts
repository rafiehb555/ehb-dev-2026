import { Injectable } from "@nestjs/common";

@Injectable()
export class NgoService {
  health() {
    return { module: "ngo", status: "ok" };
  }
}
