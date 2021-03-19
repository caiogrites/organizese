import { Injectable } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { LoginService } from "src/app/services/login.service"

@Injectable({
  providedIn: 'root'
})
export class LoginGuards implements CanActivate {
  constructor(
    private _router: Router,
    private _loginService: LoginService,
    private _snackbar: MatSnackBar
  ) {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._loginService.isAuthenticated().pipe(
      tap((auth) => {
        if (!auth) {
          this._router.navigateByUrl('/')
          this._snackbar.open('Você não fez seu login ainda!', 'ok', { duration: 5000 })
        }
      })
    )
  }
}