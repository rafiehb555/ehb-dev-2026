import { Injectable } from "@nestjs/common";

@Injectable()
export class AutomotiveService {
  health() {
    return { module: "automotive", status: "ok" };
  }
}
