import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpHeaders, HttpInterceptor, HttpResponse } from '@angular/common/http'
import { HttpRequest } from '@angular/common/http'
import { HttpHandler } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'
import { LoginService } from 'src/app/services/login.service'
import { catchError, delay, map } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import * as actionsLogin from '../actions/login.actions'

@Injectable()
export class DashboardInterceptor implements HttpInterceptor {

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _store: Store
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._loginService.fetchToken()
    if (token) {
      request = request.clone({ headers: request.headers.set('Token', 'Bearer ' + token) })
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') })
    }
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') })
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event
        }
        return event
      }),
      catchError((e: HttpErrorResponse) => {
        switch (e.status) {
          case 401:
            this._store.dispatch(actionsLogin.LOGOUT())
            this._router.navigateByUrl('/')
            break
        }
        return throwError(e)
      })
    )
  }
}