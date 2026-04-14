import { Module } from "@nestjs/common";
import { HpsController } from "./hps.controller";
import { HpsService } from "./hps.service";

@Module({
  controllers: [HpsController],
  providers: [HpsService],
  exports: [HpsService],
})
export class HpsModule {}
