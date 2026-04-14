import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { FashionService } from "./fashion.service";

@ApiTags("FashionFlow")
@Controller("industries/fashion")
export class FashionController {
  constructor(private readonly svc: FashionService) {}

  @Get("health")
  @ApiOperation({ summary: "FashionFlow module health" })
  health() {
    return this.svc.health();
  }
}
