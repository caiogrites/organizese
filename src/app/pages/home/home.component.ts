import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DialogsComponent } from "src/app/components/dialogs/dialogs.component";
import { AppService } from "src/app/services/app.service";
import { Constants } from "src/app/services/constants";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public logo: string = ''
  public isLogged: boolean = false
  public background: string = this._constants.get('file_images') + 'background-home-6'

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _appService: AppService,
    private _constants: Constants
  ) {
    // background: url("../../../assets/background-home-5.svg");
    this.logo = this._constants.get('file_images') + this.getLogo()
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
        return 'icon-default-dark-512x512'
      } else {
        return 'icon-default-stroke-512x512'
      }
    } else {
      return 'icon-default-transparent-512x512'
    }
  }
}