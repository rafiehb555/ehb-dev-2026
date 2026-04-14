import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BeautyService } from "./beauty.service";

@ApiTags("BeautyBloom")
@Controller("industries/beauty")
export class BeautyController {
  constructor(private readonly svc: BeautyService) {}

  @Get("health")
  @ApiOperation({ summary: "BeautyBloom module health" })
  health() {
    return this.svc.health();
  }
}
