import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { PrimeiroAppStore } from './store/primeiroapp.store'
import { RegistersEffect } from './effects/registers.effects'
import { DashboardEffect } from './effects/dashboard.effects'
import { registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt'
import { HomeComponent } from './pages/home/home.component'
import { Constants } from './services/constants'
import { AngularCreatePdfModule } from 'angular-create-pdf'
import { AppService } from './services/app.service'
import { AppEffect } from './effects/app.effects'
import { DialogsComponent } from './components/dialogs/dialogs.component'
import { LoginModule } from './pages/login/login.module'
import { MaterialModule } from './material.module'
import { LoginEffect } from './effects/login.effects'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { DashboardInterceptor } from './interceptor/dashboard.interceptor'
import { NgxMaskModule } from 'ngx-mask'
import { LoadInterceptor } from './interceptor/load.interceptor';
import { LoaderComponent } from './components/loader/loader.component';

registerLocaleData(localePt, 'pt-BR')

const indexedConfig: DBConfig = {
  name: 'PrimeiroApp',
  version: 3, // only work on this version
  objectStoresMeta: [{
    store: 'PrimeiroApp',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: []
  }],
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularCreatePdfModule,
    MaterialModule,
    AppRoutingModule,
    LoginModule,
    NgxMaskModule.forRoot(),
    NgxIndexedDBModule.forRoot(indexedConfig),
    StoreModule.forRoot(PrimeiroAppStore),
    StoreDevtoolsModule.instrument({ maxAge: 45 }),
    EffectsModule.forRoot([LoginEffect, AppEffect, RegistersEffect, DashboardEffect])
  ],
  entryComponents: [
    DialogsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DashboardInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi: true },
    { provide: Constants },
    { provide: AppService },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
