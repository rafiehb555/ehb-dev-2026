import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { FitnessService } from "./fitness.service";

@ApiTags("FitZone")
@Controller("industries/fitness")
export class FitnessController {
  constructor(private readonly svc: FitnessService) {}

  @Get("health")
  @ApiOperation({ summary: "FitZone module health" })
  health() {
    return this.svc.health();
  }
}
