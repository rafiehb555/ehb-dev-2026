import { Module } from "@nestjs/common";
import { ConsultingController } from "./consulting.controller";
import { ConsultingService } from "./consulting.service";

@Module({
  controllers: [ConsultingController],
  providers: [ConsultingService],
  exports: [ConsultingService],
})
export class ConsultingModule {}
