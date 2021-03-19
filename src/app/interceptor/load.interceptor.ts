import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpInterceptor, HttpResponse } from '@angular/common/http'
import { HttpRequest } from '@angular/common/http'
import { HttpHandler } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'
import { catchError, delay, finalize, map } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'
import { LoadService } from '../services/load.service'

@Injectable()
export class LoadInterceptor implements HttpInterceptor {
  private count: number = 0
  constructor(
    private _loadService: LoadService
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.count === 0) {
      this._loadService.setHttpProgressStatus(true)
    }
    this.count++

    return next.handle(request).pipe(
      finalize(() => {
        this.count--
        if (this.count === 0) {
          this._loadService.setHttpProgressStatus(false)
        }
      })
    )
  }
}