import { Component, DoCheck, OnInit, Renderer2, RendererFactory2 } from '@angular/core'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { Store } from '@ngrx/store'
import { DashboardComponent } from '../dashboard.component'
import * as actionsDashboard from '../../../actions/dashboard.actions'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DashboardService } from 'src/app/services/dashboard.service'
import { User } from '../../../models/models'
import { version, author, description } from '../../../../../package.json'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends DashboardComponent implements OnInit, DoCheck {
  public isDark: boolean
  public isDev: boolean
  public formProfile: FormGroup
  public formAccount: FormGroup
  private renderer: Renderer2
  private colorTheme: string = ''
  private devMode: string = ''
  public isPasswordSame: boolean = false
  public hide: boolean = false
  public isLoading: boolean = false
  public user: User
  public package: any
  public version: any
  public author: any
  public description: any


  constructor(
    protected _renderedFactory: RendererFactory2,
    protected _store: Store,
    protected _snackbar: MatSnackBar,
    protected _fb: FormBuilder,
    protected _dashboardService: DashboardService,
  ) {
    super()
    this.renderer = this._renderedFactory.createRenderer(null, null)
    this.init()
    this.isDark = this.isDarkMode()
    this.isDev = this.isDarkMode()
  }

  public ngOnInit(): void {
    this._store.select(({ login }: any) => ({ user: login.user })).subscribe(state => {
      this.user = state.user
    })

    this.formProfile = this._fb.group({
      name: [this.user.name],
      email: [this.user.email, [Validators.required, Validators.email]],
      cpf: [this.user.cpf, Validators.required],
      tel: [this.user.phone, Validators.required]
    })

    this.formAccount = this._fb.group({
      old_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]]
    }, { validator: this.checkPassword('new_password', 'confirm_password') })
  }

  public ngDoCheck() { }

  public init(): void {
    this.getColorTheme()
    this.getMode()
    this.renderer.addClass(document.body, this.colorTheme)
    this.version = version
    this.author = author
    this.description = description
  }

  public updateColorTheme(theme: 'dark-mode' | 'light-mode'): void {
    this.defineColorTheme(theme)
    const previousColorTheme = (theme === 'dark-mode' ? 'light-mode' : 'dark-mode')
    this.renderer.removeClass(document.body, previousColorTheme)
    this.renderer.addClass(document.body, theme)
  }

  private defineColorTheme(theme: string): void {
    this.colorTheme = theme
    localStorage.setItem('user-theme', theme)
  }

  private getColorTheme(): void {
    localStorage.getItem('user-theme')
      ? this.colorTheme = localStorage.getItem('user-theme') || ''
      : this.colorTheme = 'light-mode'
  }

  private getMode(): void {
    localStorage.getItem('dev-mode') ? this.devMode = localStorage.getItem('dev-mode') || '' : this.devMode = 'dev-mode'
  }

  public isDarkMode(): boolean {
    return this.colorTheme === 'dark-mode'
  }

  public isDevMode(): boolean {
    return this.devMode === 'dev-mode'
  }

  public updateMode(mode: 'dev-mode' | 'prod-mode'): void {
    this.defineMode(mode)
    const previousMode = (mode === 'dev-mode' ? 'dev-mode' : 'prod-mode')
    localStorage.removeItem(previousMode)
    localStorage.setItem('mode', mode)
  }

  public defineMode(mode: string): void {
    this.devMode = mode
    localStorage.setItem('mode', mode)
  }

  public toggleDarkMode(event: MatSlideToggleChange): void {
    this.updateColorTheme(event.checked ? 'dark-mode' : 'light-mode')
    this._store.dispatch(actionsDashboard.DARK_MODE({ payload: event.checked ? 'dark-mode' : 'light-mode' }))
  }

  public activeDevMode(event: MatSlideToggleChange): void {
    this.updateMode(event.checked ? 'dev-mode' : 'prod-mode')
    this.notification(`Dev mode está: ${event.checked ? 'ativado' : 'desativado'}`)
  }

  public onProfileSubmit(): void {
    console.log(this.formProfile.value)
  }

  public onAccountSubmit(): void {
    this.isLoading = true
    this._dashboardService.userUpdatePassword(this.formAccount.value)
      .subscribe(res => {
        console.log(res)
        this.isLoading = false
        this._snackbar.open(res.message, 'ok', { duration: 3000 })
      }, err => {
        this.isLoading = false
        this._snackbar.open(err.error.message, 'ok', { duration: 3000 })
      })
  }

  public checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName]
      const matchingControl = formGroup.controls[matchingControlName]

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true })
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false
      } else {
        matchingControl.setErrors(null)
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false
      }
    }
  }
}
