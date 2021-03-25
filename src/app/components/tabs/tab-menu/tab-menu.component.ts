import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actionsRegisters from '../../../actions/registers.actions'

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {
  @Input() public label: string
  @Input() public icon: string
  @Input() public target: string = ''
  @Input() public isButton: boolean = true
  @Input() public subtitle: string

  public tabActive: boolean
  public visible: boolean
  public isMobile: boolean
  private tabList: string[]

  constructor(
    private _store: Store,
    private _breakpointObserver: BreakpointObserver
  ) {
    _breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => this.isMobile = !!result.matches)
  }

  public ngOnInit(): void {
    this._store.select(({ registers }: any) =>
      ({ tab: registers.tab, visible: registers.visible, tabList: registers.tabList }))
      .subscribe(state => {
        this.tabActive = !!(state.tab === this.target)
        this.visible = !!(state.visible[this.target])
        this.tabList = state.tabList
      })

    this.setTabToShow(this.tabList)
  }

  public selectedTab(target: string): void {
    if (!this.isMobile) {
      this._store.dispatch(actionsRegisters.GET_TAB({ payload: target }))
    } else {
      this._store.dispatch(actionsRegisters.GET_SHOWTAB({ payload: ['back'] }))
      this._store.dispatch(actionsRegisters.GET_TAB({ payload: target }))
    }
  }

  private setTabToShow(tabList: string[]): void {
    this._store.dispatch(actionsRegisters.GET_SHOWTAB({
      payload: tabList
    }))
  }
}
