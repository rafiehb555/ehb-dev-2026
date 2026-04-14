import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EventsService } from "./events.service";

@ApiTags("EventPulse")
@Controller("industries/events")
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Get("health")
  @ApiOperation({ summary: "EventPulse module health" })
  health() {
    return this.svc.health();
  }
}
