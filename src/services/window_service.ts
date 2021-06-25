import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {animationFrameScheduler, EMPTY, fromEvent, Observable} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  throttleTime,
} from 'rxjs/operators';

/**
 * A service that provides methods of interacting with the browser window
 * object.
 */
@Injectable({providedIn: 'root'})
export class WindowService {
  readonly windowResizeEvent$ = this.getWindowResizeEvent();
  readonly windowInnerWidth$ = this.createInnerWidthObservable();
  readonly windowInnerHeight$ = this.createInnerHeightObservable();
  readonly documentInnerHeight$ = this.createDocumentInnerHeightObservable();

  constructor(
    @Inject('Window') private readonly window: Window,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  private getWindowResizeEvent(): Observable<Event | null> {
    if (this.window) {
      return fromEvent(window, 'resize').pipe(
        throttleTime(0, animationFrameScheduler),
        shareReplay({bufferSize: 1, refCount: true})
      );
    } else {
      return EMPTY;
    }
  }

  isTouchScreen(): boolean {
    // Check JS API for CSS @media queries.
    // https://stackoverflow.com/questions/56324813/how-to-detect-touch-device-in-2019.
    return this.window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  private createInnerWidthObservable(): Observable<number> {
    if (this.window) {
      return this.windowResizeEvent$.pipe(
        startWith(this.getCurrentInnerWidth()),
        map(() => this.getCurrentInnerWidth()),
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true})
      );
    } else {
      return EMPTY;
    }
  }

  private getCurrentInnerWidth(): number {
    return this.window.innerWidth;
  }

  private createInnerHeightObservable(): Observable<number> {
    if (this.window) {
      return this.windowResizeEvent$.pipe(
        startWith(this.getCurrentInnerHeight()),
        map(() => this.getCurrentInnerHeight()),
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true})
      );
    } else {
      return EMPTY;
    }
  }

  private createDocumentInnerHeightObservable(): Observable<number> {
    if (this.document) {
      return this.windowResizeEvent$.pipe(
        throttleTime(0, animationFrameScheduler),
        startWith(this.getDocumentInnerHeight()),
        map(() => this.getDocumentInnerHeight()),
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true})
      );
    } else {
      return EMPTY;
    }
  }

  private getCurrentInnerHeight(): number {
    return this.window.innerHeight;
  }

  private getDocumentInnerHeight(): number {
    return this.document.body.clientHeight;
  }
}
