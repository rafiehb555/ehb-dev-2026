import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ConsultingService } from "./consulting.service";

@ApiTags("Consulting Hub")
@Controller("industries/consulting")
export class ConsultingController {
  constructor(private readonly svc: ConsultingService) {}

  @Get("health")
  @ApiOperation({ summary: "Consulting Hub module health" })
  health() {
    return this.svc.health();
  }
}
