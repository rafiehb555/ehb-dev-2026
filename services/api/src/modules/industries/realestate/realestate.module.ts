import { Module } from "@nestjs/common";
import { RealestateController } from "./realestate.controller";
import { RealestateService } from "./realestate.service";

@Module({
  controllers: [RealestateController],
  providers: [RealestateService],
  exports: [RealestateService],
})
export class RealestateModule {}
