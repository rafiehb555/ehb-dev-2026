import { Module } from "@nestjs/common";
import { TelecomController } from "./telecom.controller";
import { TelecomService } from "./telecom.service";

@Module({
  controllers: [TelecomController],
  providers: [TelecomService],
  exports: [TelecomService],
})
export class TelecomModule {}
