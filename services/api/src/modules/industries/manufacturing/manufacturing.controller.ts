import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ManufacturingService } from "./manufacturing.service";

@ApiTags("MakerHub")
@Controller("industries/manufacturing")
export class ManufacturingController {
  constructor(private readonly svc: ManufacturingService) {}

  @Get("health")
  @ApiOperation({ summary: "MakerHub module health" })
  health() {
    return this.svc.health();
  }
}
