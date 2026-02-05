import { Injectable } from "@angular/core";
import { Point } from "./types";


@Injectable({
  providedIn: 'root'
})

export class SingletonService {

  isPointInsideDOMRect(r:DOMRect, p:Point) {
    return p!.x >= r.x &&
           p!.y >= r.y &&
           p!.x <= r.x + r.width &&
           p!.y <= r.y + r.height;
  }

}