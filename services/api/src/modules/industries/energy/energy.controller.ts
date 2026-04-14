import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EnergyService } from "./energy.service";

@ApiTags("EnergyGrid")
@Controller("industries/energy")
export class EnergyController {
  constructor(private readonly svc: EnergyService) {}

  @Get("health")
  @ApiOperation({ summary: "EnergyGrid module health" })
  health() {
    return this.svc.health();
  }
}
