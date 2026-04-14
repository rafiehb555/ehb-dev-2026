import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { NgoService } from "./ngo.service";

@ApiTags("NGO Connect")
@Controller("industries/ngo")
export class NgoController {
  constructor(private readonly svc: NgoService) {}

  @Get("health")
  @ApiOperation({ summary: "NGO Connect module health" })
  health() {
    return this.svc.health();
  }
}
