import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MusicService } from "./music.service";

@ApiTags("MusicWave")
@Controller("industries/music")
export class MusicController {
  constructor(private readonly svc: MusicService) {}

  @Get("health")
  @ApiOperation({ summary: "MusicWave module health" })
  health() {
    return this.svc.health();
  }
}
