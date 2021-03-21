import { Component, OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { DialogsComponent } from "src/app/components/dialogs/dialogs.component"
import { AppService } from "src/app/services/app.service"
import { Constants } from "src/app/services/constants"
import { LoginService } from "src/app/services/login.service"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public logo: string = ''
  public isLogged: boolean = false
  public background: string = this._constants.get('file_images') + 'background-home-6'
  public iconName: string = ''
  public currentOS: string = ''

  public downloadList: any = {
    current_os: '',
    linux: [
      {
        label: 'Linux - Ubuntu 20.04 LTS',
        name: 'organizese-1-1-0.deb',
        version: '1.1.0',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-linux' : this._constants.get('file_images') + 'logo-linux-white'
      },
      {
        label: 'Linux - Ubuntu 20.04 LTS',
        name: 'organizese-1-1-1.deb',
        version: '1.1.1',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-linux' : this._constants.get('file_images') + 'logo-linux-white'
      },
      {
        label: 'Linux - Ubuntu 20.04 LTS',
        name: 'organizese-1-1-2.deb',
        version: '1.1.2',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-linux' : this._constants.get('file_images') + 'logo-linux-white'
      }
    ],
    windows: [
      {
        label: 'Windows 10',
        name: 'organizese-1-1-1.msi',
        version: '1.1.0',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-windows-black' : this._constants.get('file_images') + 'logo-windows-white'
      },
      {
        label: 'Windows 10',
        name: 'organizese-1-1-1.msi',
        version: '1.1.0',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-windows-black' : this._constants.get('file_images') + 'logo-windows-white'
      }
    ],
    mac: [
      {
        label: "Mac OS",
        name: 'organizese-1-1-0.tar.gz',
        version: '1.1.0',
        icon: this.isDark() ? this._constants.get('file_images') + 'logo-mac-black' : this._constants.get('file_images') + 'logo-mac-white'
      }
    ]
  }

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _appService: AppService,
    private _constants: Constants,
  ) {
    this.logo = this._constants.get('file_images') + this.getLogo()
    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) this.currentOS = "Windows 10"
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) this.currentOS = "Windows 8"
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) this.currentOS = "Windows 7"
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) this.currentOS = "Windows Vista"
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) this.currentOS = "Windows XP"
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) this.currentOS = "Windows 2000"
    if (window.navigator.userAgent.indexOf("Mac") != -1) this.currentOS = "Mac/iOS"
    if (window.navigator.userAgent.indexOf("X11") != -1) this.currentOS = "UNIX"
    if (window.navigator.userAgent.indexOf("Linux") != -1) this.currentOS = "Linux"
  }

  public ngOnInit(): void {
    this.downloadList.current_os = this.currentOS
    this._appService.downloadList().subscribe((res) => console.log(res))
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
    this._dialog.open(DialogsComponent, { data: { type: 'download', data: this.downloadList }, panelClass: 'dialog-default' })
      .afterClosed().subscribe(res => {
        console.log(res)
      })
  }

  public isDark(): boolean {
    return localStorage.getItem('user-theme') === 'light-mode'
  }
}