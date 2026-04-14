import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { TelecomService } from "./telecom.service";

@ApiTags("TelecomLink")
@Controller("industries/telecom")
export class TelecomController {
  constructor(private readonly svc: TelecomService) {}

  @Get("health")
  @ApiOperation({ summary: "TelecomLink module health" })
  health() {
    return this.svc.health();
  }
}
