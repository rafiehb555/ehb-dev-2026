import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PetsService } from "./pets.service";

@ApiTags("PetCare+")
@Controller("industries/pets")
export class PetsController {
  constructor(private readonly svc: PetsService) {}

  @Get("health")
  @ApiOperation({ summary: "PetCare+ module health" })
  health() {
    return this.svc.health();
  }
}
