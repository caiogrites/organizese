import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from 'src/app/components/login/login.component'
import { DialogsComponent } from 'src/app/components/dialogs/dialogs.component'
import { MaterialModule } from 'src/app/material.module'
import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { LoginService } from 'src/app/services/login.service'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { VerifyComponent } from './verify/verify.component'
import { NewPasswordComponent } from './new-password/new-password.component'
import { DownloadsComponent } from 'src/app/components/downloads/downloads.component'

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'new_password', component: NewPasswordComponent },
]

@NgModule({
  declarations: [
    LoginComponent,
    DialogsComponent,
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent,
    VerifyComponent,
    NewPasswordComponent,
    DownloadsComponent
  ],
  imports: [
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: LoginService },
  ],
})
export class LoginModule { }
