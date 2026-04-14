import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LogisticsService } from "./logistics.service";

@ApiTags("LogiTrack")
@Controller("industries/logistics")
export class LogisticsController {
  constructor(private readonly svc: LogisticsService) {}

  @Get("health")
  @ApiOperation({ summary: "LogiTrack module health" })
  health() {
    return this.svc.health();
  }
}
