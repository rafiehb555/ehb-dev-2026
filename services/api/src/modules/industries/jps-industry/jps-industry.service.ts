import { Injectable } from "@nestjs/common";

@Injectable()
export class JpsIndustryService {
  health() {
    return { module: "jps-industry", status: "ok" };
  }
}
