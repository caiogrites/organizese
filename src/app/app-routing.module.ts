import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginGuards } from './guards/login-guards'
import { HomeComponent } from './pages/home/home.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [LoginGuards] },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: '**', redirectTo: '', pathMatch: 'prefix' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
