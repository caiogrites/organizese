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
    var OSNome = "";
    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSNome = "Windows 10";
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSNome = "Windows 8";
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSNome = "Windows 7";
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSNome = "Windows Vista";
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSNome = "Windows XP";
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSNome = "Windows 2000";
    if (window.navigator.userAgent.indexOf("Mac") != -1) OSNome = "Mac/iOS";
    if (window.navigator.userAgent.indexOf("X11") != -1) OSNome = "UNIX";
    if (window.navigator.userAgent.indexOf("Linux") != -1) OSNome = "Linux";
    console.log('Seu Sistema Operacional: ' + OSNome);
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

  public download(): void {
    this._dialog.open(DialogsComponent, { data: { type: 'download', data: {} }, panelClass: 'dialog-default' })
    .afterClosed().subscribe(res => {
      console.log(res)
    })    
  }
}