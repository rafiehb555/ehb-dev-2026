import { Module } from "@nestjs/common";
import { JpsIndustryController } from "./jps-industry.controller";
import { JpsIndustryService } from "./jps-industry.service";

@Module({
  controllers: [JpsIndustryController],
  providers: [JpsIndustryService],
  exports: [JpsIndustryService],
})
export class JpsIndustryModule {}
