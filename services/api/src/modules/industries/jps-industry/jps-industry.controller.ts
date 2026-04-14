import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { JpsIndustryService } from "./jps-industry.service";

@ApiTags("JPS Marketplace")
@Controller("industries/jps-industry")
export class JpsIndustryController {
  constructor(private readonly svc: JpsIndustryService) {}

  @Get("health")
  @ApiOperation({ summary: "JPS Marketplace module health" })
  health() {
    return this.svc.health();
  }
}
