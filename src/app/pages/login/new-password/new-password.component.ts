import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  private isTokenValidated: boolean = false
  public isPasswordSame: boolean = false
  public textIcon: string = 'password'
  public changeIcon: string = 'visibility_off'
  public changeTextLogin: string = 'Não tenho conta'
  public isLogin: boolean = false
  public isLoginText: string = 'login'
  public isLoading: boolean = false
  public token: string = ''

  public formNewPassword: FormGroup = this._fb.group({
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
  }, { validator: this.checkPassword('password', 'confirm_password') })

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService,
    private _fb: FormBuilder,
    private _snackbar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.queryParams.pipe(switchMap((params: any) => {
      if (params['token']) {
        this.token = params['token']
        return this._loginService.loginVerified({ token: params['token'] })
      } else {
        return of(null)
      }
    }
    ))
      .subscribe(() => {
        this.isTokenValidated = true
        this.isLoading = false
        console.log('token validado')
      },
        err => {
          this._router.navigateByUrl('/')
          this._snackbar.open('Nenhum token encontrado ou token inválido')
        }
      )
  }

  public onSubmit(event: any): void {
    event.preventDefault()
    this.isLoading = true
    this._loginService.resetPassword({ password: this.formNewPassword.value.password, token: this.token })
      .subscribe(res => {
        this.isLoading = false
        this._snackbar.open(res.message, 'ok')
      }, err => {
        console.error(err)
        this.isLoading = false
        this._snackbar.open(err.error.message, 'ok')
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
  // eyJhbGciOiJIUzUxMiIsImlhdCI6MTYxNTg5NTYxNSwiZXhwIjo0MjQzODk1NjE1fQ.eyJfaWQiOiI2MDUwMTk4NjdlN2UzNDAzYWFhNmQ2NTAifQ.M4rTVeUcxFCuIH_Qg04KhuaKrL1fRE2CsJr6-ukD2_0YrmqFY9Un0W8EAze8w14FC9le9v_wkjJz1hSn7K7zkA
}
