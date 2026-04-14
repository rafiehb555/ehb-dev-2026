import { Injectable } from "@nestjs/common";

@Injectable()
export class MusicService {
  health() {
    return { module: "music", status: "ok" };
  }
}
