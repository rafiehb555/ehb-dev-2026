import { Injectable } from "@nestjs/common";

@Injectable()
export class GovernmentService {
  health() {
    return { module: "government", status: "ok" };
  }
}
