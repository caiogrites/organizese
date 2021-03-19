import { AfterViewInit, Component, Renderer2, RendererFactory2 } from '@angular/core'
import { Store } from '@ngrx/store'
import * as actionsDashboard from './actions/dashboard.actions'
import * as actionsApp from './actions/app.actions'
import * as actionsErrors from './actions/errors.actions'
import { LoadService } from './services/load.service'
import { IpcService } from './services/ipc.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  private renderer: Renderer2
  private colorTheme: string = ''
  // public isOnline: boolean = false
  // public isLoading: boolean = true
  // public isError: boolean = false
  public isDark: boolean
  public logo: string = './assets/icon-default-white-512x512.svg'

  constructor(
    private _rendereFactory: RendererFactory2,
    private _store: Store,
    private _loadService: LoadService,
    private _ipcService: IpcService
  ) {
    this.logo = './assets/' + this.getLogo()
    this._store.dispatch(actionsApp.ONLINE())
    this.renderer = this._rendereFactory.createRenderer(null, null)
    this.initTheme()
    this.isDark = this.isDarkMode()
    this._store.dispatch(actionsDashboard.DARK_MODE({ payload: this.colorTheme }))

    this._store.select(({ http_error, app }: any) => ({ errors: http_error.errors, online: app.online }))
      .subscribe(state => {
        if (state.errors.length > 0) {
          console.error(state.errors[0])
        }
        // if (state.errors.length == 0 && state.online) {
        //   this.isOnline = true
        //   this.isLoading = false
        //   this.isError = false
        // }
      })

    this._ipcService?.send('reload', 'from angular to electron')
    this._ipcService?.on('reloaded', (_: Electron.IpcMessageEvent, message: any) => {
      console.log(message)
    })
  }


  public ngAfterViewInit() {
  }

  public initTheme(): void {
    if (localStorage.getItem('user-theme')) {
      this.colorTheme = localStorage.getItem('user-theme') || ''
    } else {
      this.colorTheme = 'light-mode'
    }
    this.renderer.addClass(document.body, this.colorTheme)
  }

  public isDarkMode(): boolean {
    return this.colorTheme === 'dark-mode'
  }

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      if (localStorage.getItem('user-theme') === 'dark-mode') {
        return 'icon-default-dark-512x512.svg'
      } else {
        return 'icon-default-stroke-512x512.svg'
      }
    } else {
      return 'icon-deffault-transparent-512x512.svg'
    }
  }
}
