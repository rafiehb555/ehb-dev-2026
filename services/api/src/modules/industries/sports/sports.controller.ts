import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SportsService } from "./sports.service";

@ApiTags("SportsArena")
@Controller("industries/sports")
export class SportsController {
  constructor(private readonly svc: SportsService) {}

  @Get("health")
  @ApiOperation({ summary: "SportsArena module health" })
  health() {
    return this.svc.health();
  }
}
