import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TechnologyService } from "./technology.service";

@ApiTags("TechSphere")
@Controller("industries/technology")
export class TechnologyController {
  constructor(private readonly svc: TechnologyService) {}

  @Get("health")
  @ApiOperation({ summary: "TechSphere module health" })
  health() {
    return this.svc.health();
  }
}
