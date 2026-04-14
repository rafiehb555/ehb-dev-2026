import { Injectable } from "@nestjs/common";

@Injectable()
export class ConsultingService {
  health() {
    return { module: "consulting", status: "ok" };
  }
}
