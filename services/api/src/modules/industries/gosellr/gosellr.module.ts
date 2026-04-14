import { Module } from "@nestjs/common";
import { GosellrController } from "./gosellr.controller";
import { GosellrService } from "./gosellr.service";

@Module({
  controllers: [GosellrController],
  providers: [GosellrService],
  exports: [GosellrService],
})
export class GosellrModule {}
