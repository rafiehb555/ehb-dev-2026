import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WeddingsService } from "./weddings.service";

@ApiTags("WeddingGlow")
@Controller("industries/weddings")
export class WeddingsController {
  constructor(private readonly svc: WeddingsService) {}

  @Get("health")
  @ApiOperation({ summary: "WeddingGlow module health" })
  health() {
    return this.svc.health();
  }
}
