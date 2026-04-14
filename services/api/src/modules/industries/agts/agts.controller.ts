import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AgtsService } from "./agts.service";

@ApiTags("AGTS")
@Controller("industries/agts")
export class AgtsController {
  constructor(private readonly svc: AgtsService) {}

  @Get("health")
  @ApiOperation({ summary: "AGTS module health" })
  health() {
    return this.svc.health();
  }
}
