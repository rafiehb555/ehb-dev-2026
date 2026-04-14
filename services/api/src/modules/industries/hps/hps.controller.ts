import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HpsService } from "./hps.service";

@ApiTags("HPS / OBS")
@Controller("industries/hps")
export class HpsController {
  constructor(private readonly svc: HpsService) {}

  @Get("health")
  @ApiOperation({ summary: "HPS / OBS module health" })
  health() {
    return this.svc.health();
  }
}
