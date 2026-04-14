import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ConstructionService } from "./construction.service";

@ApiTags("Build+")
@Controller("industries/construction")
export class ConstructionController {
  constructor(private readonly svc: ConstructionService) {}

  @Get("health")
  @ApiOperation({ summary: "Build+ module health" })
  health() {
    return this.svc.health();
  }
}
