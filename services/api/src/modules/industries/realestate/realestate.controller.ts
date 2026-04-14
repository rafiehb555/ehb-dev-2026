import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { RealestateService } from "./realestate.service";

@ApiTags("EstatePro")
@Controller("industries/realestate")
export class RealestateController {
  constructor(private readonly svc: RealestateService) {}

  @Get("health")
  @ApiOperation({ summary: "EstatePro module health" })
  health() {
    return this.svc.health();
  }
}
