import { Module } from "@nestjs/common";
import { FashionController } from "./fashion.controller";
import { FashionService } from "./fashion.service";

@Module({
  controllers: [FashionController],
  providers: [FashionService],
  exports: [FashionService],
})
export class FashionModule {}
