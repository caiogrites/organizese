import { Component, OnInit, DoCheck, KeyValueDiffers, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActionsSubject, Store } from '@ngrx/store'
import { IpcService } from 'src/app/services/ipc.service'
import * as actionsErrors from '../../actions/errors.actions'
import * as actionsRegister from '../../actions/registers.actions'
import * as actionsDashboard from '../../actions/dashboard.actions'
import * as actionsLogin from '../../actions/login.actions'
import { MatSnackBar } from '@angular/material/snack-bar'
import { filter, map, startWith } from 'rxjs/operators'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { ScrollService } from 'src/app/services/scroll.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { LoadService } from 'src/app/services/load.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, DoCheck, AfterViewInit {
  public menuList: any[] = [
    {
      link: '/',
      name: 'Home',
      icon: 'home'
    },
    {
      link: '/dashboard',
      name: 'Dashboard',
      icon: 'dashboard'
    },
    {
      link: '/dashboard/registers',
      name: 'Registros',
      icon: 'create'
    },
    {
      link: '/dashboard/settings',
      name: 'Configurações',
      icon: 'settings'
    },
  ]
  public logo: string = './assets/icon-default-transparent-512x512.svg'
  public searchTerms: FormControl = new FormControl()
  public consolidado: number = 0
  public isMobile: boolean = false
  public json: any
  public scroll: number
  public buttonToTop: boolean
  public type: string
  public value: number
  public showErrors: boolean = false
  public isActive: string = ''
  public differ: any
  public autocomplete: string[] = []
  public autocomplete$: Observable<string[]>
  public user: any
  public isLoadingDashboard: boolean = true

  constructor(
    protected _ipcService?: IpcService,
    protected _store?: Store,
    protected _snackbar?: MatSnackBar,
    protected _as?: ActionsSubject,
    protected _breakpoint?: BreakpointObserver,
    protected _scrollService?: ScrollService,
    protected _router?: Router,
    protected _differs?: KeyValueDiffers,
    protected _dialog?: MatDialog,
    protected _loadService?: LoadService,
  ) {
    this.logo = './assets/' + this.getTheme()
    this._router?.events.subscribe((u: any) => this.isActive = u.url)
    this._breakpoint?.observe([Breakpoints.XSmall]).subscribe(result => this.isMobile = !!result.matches)

    this._store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }))
    this.differ = this._differs?.find({}).create()

    this.autocomplete$ = this.searchTerms.valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filterAutocomplete(value) : this.autocomplete)
    )
  }

  public ngOnInit(): void {
    this.initialize()
    this._scrollService?.getScrollAsStream().subscribe(per => this.buttonToTop = (per >= 30))
    this._store?.select(({ http_error, registers, dashboard, login }: any) => ({
      http_error,
      consolidado: dashboard.consolidado,
      autocomplete: dashboard.auto_complete,
      user: login.user
    })).subscribe(state => {
      this.consolidado = state.consolidado.total_consolidado
      this.autocomplete = state.autocomplete
      this.user = state.user
      if (state.http_error.errors.length > 0) {
        this.handleError(state.http_error.errors[0])
      }
    })
    this._as?.pipe(filter(a => a.type === actionsErrors.actionsTypes.SET_SUCCESS))
      .subscribe(({ payload }: any) => {
        const name: string = this.fetchNames(payload)
        this._snackbar?.open(`${name}`, 'Ok', { duration: 3000 })
      })
  }

  public ngDoCheck() {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'isActive') {
          this._store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }))
        }
        if (item.key === 'consolidado') {
        }
      })
    }
  }

  public ngAfterViewInit() {
    this._loadService?.httpProgress().subscribe((status: boolean) => {
      if (!status && this.consolidado && this.user) {
        this.isLoadingDashboard = false
      }
    })
  }

  private filterAutocomplete(value: string = ''): string[] {
    return this.autocomplete.filter(option => option.toLowerCase().includes(value.toLowerCase())).sort()
  }

  private async initialize() {
    await this.fetchUser()
    await this.fetchRegisters()
    await this.initDashboard()
    await this.fetchAutocomplete()
  }

  private async fetchUser(): Promise<any> {
    this._store?.dispatch(actionsLogin.GET_USER())
  }

  private async initDashboard(): Promise<any> {
    this._store?.dispatch(actionsDashboard.INIT_DASHBOARD())
  }

  private async fetchRegisters(): Promise<any> {
    this._store?.dispatch(actionsRegister.INIT({ payload: { days: 7 } }))
  }

  private async fetchAutocomplete(): Promise<any> {
    this._store?.dispatch(actionsDashboard.FETCH_AUTOCOMPLETE())
  }

  public onSubmit(): void {
    this._router?.navigate(['dashboard/result-search', { s: this.searchTerms.value }])
    this.searchTerms.reset()
  }

  public setSearch(event: MatAutocompleteSelectedEvent) {
    this._router?.navigate(['dashboard/result-search', { s: event.option.value }])
    this.searchTerms.reset()
  }

  public handleError(error: any): void {
    this.showErrors = true
    const name: string = this.fetchNames(error.source)
    this.notification(`Error: ${name} code: ${error.status}`)
  }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
      .format(parseFloat(valor.toFixed(2)))
  }

  private fetchNames(name: string): string {
    switch (name) {
      case 'fetch_registers':
        return 'Registros carregados'
      case 'update_register':
        return 'Registro atualizado'
      case 'delete_register':
        return 'Registro excluído'
      case 'new_register':
        return 'Novo registro'
      case 'status_code':
        return 'Status code: '
      case 'fetch_evolucao_detail':
        return 'ao carregar gráfico'
      case 'signin':
        return 'Login'
      case 'login':
        return 'Login sucesso'
      default:
        return ''
    }
  }

  public goToTop() {
    window.scrollTo(0, 0)
  }

  public returnClass(): string {
    if (this.consolidado > 0) {
      return 'cards-money cards-money-on'
    } else if (this.consolidado > 0 && this.type === 'outcoming') {
      return 'cards-money cards-debit'
    } else if (this.consolidado < 0) {
      return 'cards-money cards-money-off'
    } else {
      return 'cards-money'
    }
  }

  public notification(str: string, time: number = 3000): void {
    this._snackbar?.open(str, 'ok', { duration: time })
  }

  public openDialog(component: any, data: MatDialogConfig = {}) {
    const settings: MatDialogConfig = { ...data, panelClass: 'dialog-default' }
    return this._dialog?.open(component, settings)
  }

  public cleanText(text: string | undefined = ''): string {
    return text.toLowerCase().replace(' ', '_').replace('&', 'e').replace('á', 'a').replace('ã', 'a')
      .replace('ç', 'c').replace('õ', 'o')
  }

  public logout() {
    this._router?.navigateByUrl('/')
    this._store?.dispatch(actionsLogin.LOGOUT())
  }

  public getTheme(): string {
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
