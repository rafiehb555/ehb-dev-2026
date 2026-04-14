import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GamingService } from "./gaming.service";

@ApiTags("GameVerse")
@Controller("industries/gaming")
export class GamingController {
  constructor(private readonly svc: GamingService) {}

  @Get("health")
  @ApiOperation({ summary: "GameVerse module health" })
  health() {
    return this.svc.health();
  }
}
