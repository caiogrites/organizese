import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DialogsComponent } from "src/app/components/dialogs/dialogs.component";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public logo: string = './assets/icon-default-white-512x512.svg'

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _loginService: LoginService,
    private _snackbar: MatSnackBar
  ) {
    this.logo = './assets/' + this.getLogo()
  }

  public ngOnInit(): void {
  }

  public login(): void {
    this._dialog.open(DialogsComponent, { data: { type: 'login', data: {} }, panelClass: 'dialog-default' })
      .afterClosed().subscribe(res => {
        if (res === 'login') {
          this._router.navigateByUrl('/dashboard')
        }
      })
  }

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      if (localStorage.getItem('user-theme') === 'dark-mode') {
        return 'icon-default-dark-512x512.svg'
      } else {
        return 'icon-default-stroke-512x512.svg'
      }
    } else {
      return 'icon-default-transparent-512x512.svg'
    }
  }

  public goToDashboard(): void {
    this._loginService.isAuthenticated().subscribe(isLogged => {
      if (isLogged) {
        this._router.navigateByUrl('/dashboard')
      } else {
        this._snackbar.open('Você não fez seu login ainda!', 'ok', { duration: 5000 })
      }
    })
  }

}