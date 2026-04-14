import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AgricultureService } from "./agriculture.service";

@ApiTags("AgriLink")
@Controller("industries/agriculture")
export class AgricultureController {
  constructor(private readonly svc: AgricultureService) {}

  @Get("health")
  @ApiOperation({ summary: "AgriLink module health" })
  health() {
    return this.svc.health();
  }
}
