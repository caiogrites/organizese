import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input('cols') public cols: string = ''
  @Input('title') public title: string = ''
  @Input('color') public color: string = ''
  @Input('icon') public icon: string = ''
  @Input('value') public value: number = 0
  @Input('type') public type: string = ''

  constructor() { }

  public ngOnInit(): void {
  }

  public returnClass(): string {
    if (this.value > 0 && this.type === 'incoming') {
      return 'cards-money cards-money-on'
    } else if(this.value > 0 && this.type === 'outcoming') {
      return 'cards-money cards-debit'
    } else if(this.value < 0) {
      return 'cards-money cards-money-off'
    } else {
      return 'cards-money'
    }
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 }).format(valor)
  }

}
