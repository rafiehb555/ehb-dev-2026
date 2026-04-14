import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EntertainmentService } from "./entertainment.service";

@ApiTags("EntertainX")
@Controller("industries/entertainment")
export class EntertainmentController {
  constructor(private readonly svc: EntertainmentService) {}

  @Get("health")
  @ApiOperation({ summary: "EntertainX module health" })
  health() {
    return this.svc.health();
  }
}
