import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.component.html',
  styleUrls: ['./panel-control.component.scss']
})
export class PanelControlComponent implements OnInit {
  @Input() public aReceber: number = 0
  @Input() public aPagar: number = 0
  @Input() public totalDespesa: number = 0
  @Input() public totalReceita: number = 0
  @Input() public filterByDays: number = 0
  @Input() public total: number = 0

  constructor() { }

  ngOnInit(): void { }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
      .format(parseFloat(valor.toFixed(2)))
  }
}
