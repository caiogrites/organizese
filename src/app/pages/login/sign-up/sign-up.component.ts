import { HttpErrorResponse } from '@angular/common/http'
import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { delay } from 'rxjs/operators'
import { Signup } from 'src/app/models/models'
import * as actionsLogin from '../../../actions/login.actions'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, DoCheck {
  public textIcon: string = 'password'
  public changeIcon: string = 'visibility_off'
  public changeTextLogin: string = 'Não tenho conta'
  public isLogin: boolean = false
  public isLoginText: string = 'login'
  public isLoading: boolean = false
  public isPasswordSame: boolean = false
  public differ: any
  public created_user: boolean = false

  public formSignup: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    keep_connect: [false],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
  }, { validator: this.checkPassword('password', 'confirm_password') })

  constructor(
    private _fb: FormBuilder,
    private _store: Store,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private _diff: KeyValueDiffers,
  ) {
    this.differ = this._diff.find({}).create()
  }

  public ngDoCheck() {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'created_user') {
          if (this.created_user) {
            this.isLoading = false
            this._snackbar.open('E-mail cadastrado, verifique seu e-mail', 'ok')
          }
        }
      })
    }
  }

  public ngOnInit(): void {
    this._store.select(({ login, http_error }: any) =>
      ({ errors: http_error.errors, created_user: login.created_user }))
      .pipe(delay(3000))
      .subscribe(state => {
        if (state.errors.length > 0) {
          this.isLoading = false
          this._snackbar.open(state.errors[0].e.error.message, 'ok')
        }
        this.created_user = state.created_user
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

  public onSubmit(event: any): void {
    event.preventDefault()
    this.isLoading = true

    const user: Signup = {
      password: this.formSignup.value.password,
      email: this.formSignup.value.email,
      created_at: new Date().getTime() / 1000,
      verified: false
    }

    this._store.dispatch(actionsLogin.CREATE_USER({ payload: user }))
  }

  public changeVisibility(str: string): void {
    this.textIcon = str == 'password' ? 'text' : 'password'
    this.changeIcon = str == 'password' ? 'visibility' : 'visibility_off'
  }

  public forgetPassword(event: any) {
    this.isLoading ? event.preventDefault() : this._router.navigateByUrl('/login/reset')
  }

  public noAccount(event: any) {
    this.isLoading ? event.preventDefault() : this._router.navigateByUrl('/login')
  }
}
