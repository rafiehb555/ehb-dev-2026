import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MediaService } from "./media.service";

@ApiTags("MediaHub")
@Controller("industries/media")
export class MediaController {
  constructor(private readonly svc: MediaService) {}

  @Get("health")
  @ApiOperation({ summary: "MediaHub module health" })
  health() {
    return this.svc.health();
  }
}
