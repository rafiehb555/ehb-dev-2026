import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { FoodService } from "./food.service";

@ApiTags("FoodTrust")
@Controller("industries/food")
export class FoodController {
  constructor(private readonly svc: FoodService) {}

  @Get("health")
  @ApiOperation({ summary: "FoodTrust module health" })
  health() {
    return this.svc.health();
  }
}
