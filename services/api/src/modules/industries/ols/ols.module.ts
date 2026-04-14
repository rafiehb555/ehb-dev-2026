import { Module } from "@nestjs/common";
import { OlsController } from "./ols.controller";
import { OlsService } from "./ols.service";

@Module({
  controllers: [OlsController],
  providers: [OlsService],
  exports: [OlsService],
})
export class OlsModule {}
