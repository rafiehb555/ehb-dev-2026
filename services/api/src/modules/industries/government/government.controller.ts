import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GovernmentService } from "./government.service";

@ApiTags("GovConnect")
@Controller("industries/government")
export class GovernmentController {
  constructor(private readonly svc: GovernmentService) {}

  @Get("health")
  @ApiOperation({ summary: "GovConnect module health" })
  health() {
    return this.svc.health();
  }
}
