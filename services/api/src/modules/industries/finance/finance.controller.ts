import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { FinanceService } from "./finance.service";

@ApiTags("EHB Finance")
@Controller("industries/finance")
export class FinanceController {
  constructor(private readonly svc: FinanceService) {}

  @Get("health")
  @ApiOperation({ summary: "EHB Finance module health" })
  health() {
    return this.svc.health();
  }
}
