import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsService {
  health() {
    return { module: "events", status: "ok" };
  }
}
