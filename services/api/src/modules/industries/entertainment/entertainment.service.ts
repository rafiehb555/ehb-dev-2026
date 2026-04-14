import { Injectable } from "@nestjs/common";

@Injectable()
export class EntertainmentService {
  health() {
    return { module: "entertainment", status: "ok" };
  }
}
