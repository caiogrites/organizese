import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Register } from 'src/app/models/models'
import { DashboardService } from 'src/app/services/dashboard.service'
import { DashboardComponent } from '../dashboard.component'
import * as actionsRegisters from '../../../actions/registers.actions'

@Component({
  selector: 'app-result-search',
  templateUrl: './result-search.component.html',
  styleUrls: ['./result-search.component.scss']
})
export class ResultSearchComponent extends DashboardComponent implements OnInit, DoCheck {
  protected searchTerm: string | null
  public differ: any
  public RESULT_DATA$: Observable<Register[]>
  public TOTAL_RESULT$: Observable<number>

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _dashboardService: DashboardService,
    protected _diff: KeyValueDiffers,
    protected _store: Store
  ) {
    super()
    this.differ = this._diff.find({}).create()
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this.searchTerm = this._activatedRoute.snapshot.paramMap.get('s')
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'searchTerm') {
        }
      })
    }
  }

  public ngOnInit(): void {
    this._store.dispatch(actionsRegisters.GET_SEARCH({ payload: { search: this.searchTerm } }))
    this.RESULT_DATA$ = this._store.select(({ registers }: any) => registers.result_search)
    this.TOTAL_RESULT$ = this._store.select(({ registers }: any) => registers.result_search.length)
  }

  public onEvent(_: any): void {
    this._store.dispatch(actionsRegisters.GET_SEARCH({ payload: { search: this.searchTerm } }))
  }
}
