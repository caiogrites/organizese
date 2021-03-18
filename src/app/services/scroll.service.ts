import { Injectable } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";

type Target = Document | Element;

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor() { }

  public getScroll(node: Target = document): number {
    var currentScroll = this.getCurrentScroll(node)
    var maxScroll = this.getMaxScroll(node)

    var percent = (currentScroll / Math.max(maxScroll, 1))
    percent = Math.max(percent, 0)
    percent = Math.min(percent, 1)

    return (percent * 100)
  }

  public getCurrentScroll(node: Target): number {
    return (node instanceof Document) ? window.pageYOffset : node.scrollTop
    // if (node instanceof Document) {
    //   return window.pageYOffset
    // } else {
    //   return node.scrollTop
    // }
  }

  public getMaxScroll(node: Target): number {
    if (node instanceof Document) {
      var scrollHeight = Math.max(
        node.body.scrollHeight,
        node.body.offsetHeight,
        node.body.clientHeight,
        node.documentElement.scrollHeight,
        node.documentElement.offsetHeight,
        node.documentElement.clientHeight
      )
      var clientHeight = node.documentElement.clientHeight
      return scrollHeight - clientHeight
    } else {
      return node.scrollHeight - node.clientHeight
    }
  }

  public getScrollAsStream(node: Target = document): Observable<number> {
    if (node instanceof Document) {
      var stream = fromEvent(window, 'scroll').pipe(
        map((_: any): number => this.getScroll(node))
      )
    } else {
      var stream = fromEvent(node, 'scroll').pipe(
        map((_: any): number => this.getScroll(node))
      )
    }
    return stream
  }
}