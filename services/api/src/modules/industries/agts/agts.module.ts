import { Module } from "@nestjs/common";
import { AgtsController } from "./agts.controller";
import { AgtsService } from "./agts.service";

@Module({
  controllers: [AgtsController],
  providers: [AgtsService],
  exports: [AgtsService],
})
export class AgtsModule {}
