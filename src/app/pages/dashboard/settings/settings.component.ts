import { Component, DoCheck, KeyValueDiffers, OnInit, Renderer2, RendererFactory2 } from '@angular/core'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { Store } from '@ngrx/store'
import { DashboardComponent } from '../dashboard.component'
import * as actionsDashboard from '../../../actions/dashboard.actions'
import * as actionsProfile from '../../../actions/profile.actions'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DashboardService } from 'src/app/services/dashboard.service'
import { version, author, description } from '../../../../../package.json'
import { UtilsService } from 'src/app/utils/utis.service'

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
  public user: any = {}
  public package: any
  public version: any
  public author: any
  public description: any
  public isReadOnly: boolean = false
  public differ: any

  constructor(
    protected _renderedFactory: RendererFactory2,
    protected _store: Store,
    protected _snackbar: MatSnackBar,
    protected _fb: FormBuilder,
    protected _dashboardService: DashboardService,
    protected _utilsService: UtilsService,
    protected _differs: KeyValueDiffers,
  ) {
    super()
    this.differ = this._differs?.find({}).create()
    this.renderer = this._renderedFactory.createRenderer(null, null)
  }

  public ngOnInit(): void {
    this.init()
    this._store.select(({ profile }: any) => ({ user: profile.user }))
      .subscribe(async state => {
        this.user = await this.isEmpty(state.user)
        this.formProfile.patchValue({
          name: this.user.name,
          email: this.user.email,
          cpf: this.user.cpf,
          tel: this.user.tel
        })
        this.isLoading = false
      })

    // this._store.select(({ login }: any) => ({ user: login.user })).pipe(
    //   mergeMap((state) => from(this.isEmpty(state.user)))
    // ).subscribe(user => console.log(user))

    this.formProfile = this._fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      tel: ['', Validators.required]
    })

    this.formAccount = this._fb.group({
      old_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(6)]]
    }, { validator: this.checkPassword('new_password', 'confirm_password') })
  }

  public isEmpty(user: any): Promise<any> {
    return new Promise(resolve => {
      if (!this._utilsService.isEmpty(user)) {
        resolve(user)
      }
    })
  }

  public ngDoCheck() {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'user') {
          this._snackbar.open('Informa????es atualzadas.', 'ok', { duration: 3000 })
        }
      })
    }
  }

  public init(): void {
    this.getColorTheme()
    this.renderer.addClass(document.body, this.colorTheme)
    this.isDark = this.isDarkMode()
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

  public isDarkMode(): boolean {
    return this.colorTheme === 'dark-mode'
  }

  public defineMode(mode: string): void {
    this.devMode = mode
    localStorage.setItem('mode', mode)
  }

  public toggleDarkMode(event: MatSlideToggleChange): void {
    this.updateColorTheme(event.checked ? 'dark-mode' : 'light-mode')
    this._store.dispatch(actionsDashboard.DARK_MODE({ payload: event.checked ? 'dark-mode' : 'light-mode' }))
  }

  public onProfileSubmit(): void {
    this.isLoading = true
    this._store.dispatch(actionsProfile.LISTENING_PROFILE({ payload: this.formProfile.value }))
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
