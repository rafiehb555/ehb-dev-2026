import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HospitalityService } from "./hospitality.service";

@ApiTags("StayEase")
@Controller("industries/hospitality")
export class HospitalityController {
  constructor(private readonly svc: HospitalityService) {}

  @Get("health")
  @ApiOperation({ summary: "StayEase module health" })
  health() {
    return this.svc.health();
  }
}
