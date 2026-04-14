import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WmsService } from "./wms.service";

@ApiTags("WMS")
@Controller("industries/wms")
export class WmsController {
  constructor(private readonly svc: WmsService) {}

  @Get("health")
  @ApiOperation({ summary: "WMS module health" })
  health() {
    return this.svc.health();
  }
}
