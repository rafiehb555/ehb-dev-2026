import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AutomotiveService } from "./automotive.service";

@ApiTags("AutoMart")
@Controller("industries/automotive")
export class AutomotiveController {
  constructor(private readonly svc: AutomotiveService) {}

  @Get("health")
  @ApiOperation({ summary: "AutoMart module health" })
  health() {
    return this.svc.health();
  }
}
