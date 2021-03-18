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

  public tabActive: boolean
  public visible: boolean

  constructor(
    private _store: Store
  ) {
    this._store.dispatch(actionsRegisters.GET_SHOWTAB({ payload: ['read', 'create', 'print'] }))
  }

  ngOnInit(): void {
    this._store.select(({ registers }: any) => registers.tab)
      .subscribe(tab => this.tabActive = !!(tab === this.target))
    this._store.select(({ registers }: any) => registers.visible)
      .subscribe(visible => this.visible = !!(visible[this.target]))
  }

  public selectedTab(): void {
    this._store.dispatch(actionsRegisters.GET_TAB({ payload: this.target }))
  }
}
