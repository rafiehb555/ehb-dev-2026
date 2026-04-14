import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { OlsService } from "./ols.service";

@ApiTags("OLS")
@Controller("industries/ols")
export class OlsController {
  constructor(private readonly svc: OlsService) {}

  @Get("health")
  @ApiOperation({ summary: "OLS module health" })
  health() {
    return this.svc.health();
  }
}
