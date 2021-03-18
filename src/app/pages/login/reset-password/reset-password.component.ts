import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public isLoading: boolean = false

  public formReset: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  })

  constructor(
    private _fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private _loginService: LoginService
  ) { }

  public ngOnInit(): void {
  }

  public onSubmit(event: any): void {
    event.preventDefault()
    this.isLoading = true

    this._loginService.mailToReset({ email: this.formReset.value.email })
      .subscribe(res => {
        this._snackbar.open(res.message, 'ok', { duration: 3000 })
        this.isLoading = false
      },
        err => {
          console.error(err)
          this.isLoading = false
          this._snackbar.open(err.error.message, 'ok', { duration: 3000 })
        }
      )
  }

  public toSignup(event: MouseEvent): void {
    this.isLoading ? event.preventDefault() : this._router.navigateByUrl('/login/signup')
  }

  public toLogin(event: MouseEvent): void {
    this.isLoading ? event.preventDefault() : this._router.navigateByUrl('/login')
  }
}
