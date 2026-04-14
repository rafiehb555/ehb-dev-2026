import { Injectable } from "@nestjs/common";

@Injectable()
export class FinanceService {
  health() {
    return { module: "finance", status: "ok" };
  }
}
