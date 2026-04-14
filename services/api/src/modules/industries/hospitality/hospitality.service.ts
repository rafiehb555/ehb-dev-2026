import { Injectable } from "@nestjs/common";

@Injectable()
export class HospitalityService {
  health() {
    return { module: "hospitality", status: "ok" };
  }
}
