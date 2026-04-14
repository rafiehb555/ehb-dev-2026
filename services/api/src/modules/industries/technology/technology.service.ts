import { Injectable } from "@nestjs/common";

@Injectable()
export class TechnologyService {
  health() {
    return { module: "technology", status: "ok" };
  }
}
