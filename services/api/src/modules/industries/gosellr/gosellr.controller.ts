import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GosellrService } from "./gosellr.service";

@ApiTags("GoSellr")
@Controller("industries/gosellr")
export class GosellrController {
  constructor(private readonly svc: GosellrService) {}

  @Get("health")
  @ApiOperation({ summary: "GoSellr module health" })
  health() {
    return this.svc.health();
  }
}
