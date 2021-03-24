import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DIALOG_DATA, Register } from 'src/app/models/models'
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {
  @ViewChild('contentDialog', { static: false }) public contentDialog: ElementRef

  public type: string = ''
  public detail: Register
  public showProgressbar: boolean = false
  public downloadList: any
  public isLoading: boolean = true

  constructor(
    @Inject(MAT_DIALOG_DATA) public DIALOG_DATA: DIALOG_DATA,
    private _dialogRef: MatDialogRef<DialogsComponent>,
  ) {
  }

  public ngOnInit(): void {
    switch (this.DIALOG_DATA.type) {
      case 'details':
        this.type = this.DIALOG_DATA.type
        this.detail = this.DIALOG_DATA.data
        break
      case 'login':
        this.type = this.DIALOG_DATA.type
        break
      case 'download':
        this.type = this.DIALOG_DATA.type
        this.downloadList = this.DIALOG_DATA.data
        break
    }
  }

  public close() {
    this._dialogRef.close()
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 }).format(valor)
  }

  public async btnShare(): Promise<any> {
    console.log('Share')
    // try {
    //   const sharedResponse = await this.naviShareService.share({
    //     title: '`Web Articles and Tutorials',
    //     text: 'Check out my blog — its worth looking.',
    //     url: 'www.codershood.info'
    //   })
    //   console.log(sharedResponse)
    // } catch (error) {
    //   console.log('You app is not shared, reason: ', error)
    // }
  }

  public btnSave(): void {
    console.log('Save')
  }

  public btnDownload(detail: Register): void {
    const currentTheme = localStorage.getItem('user-theme')
    const color: string = (currentTheme == 'light-mode') ? '#fafafa' : '#303030'
    const al: HTMLElement = document.createElement('div')
    const el: HTMLElement = document.querySelector('.dialog') || al
    if (el) {
      html2canvas(el, { backgroundColor: color }).then(canvas => {
        // document.body.appendChild(canvas)
        var a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = `${detail.description}-${new Date().getTime()}.png`
        a.click()
      })
    }
  }

  public edit(item: Register): void {
    this._dialogRef.close({ operation: 'edit', payload: item })
  }

  public del(item: Register): void {
    this._dialogRef.close({ operation: 'del', payload: item })
  }

  public onTrigger(event: any): void {
    if (event.operation === 'show-progressbar') {
      this.showProgressbar = true
    } else if (event.operation === 'hide-progressbar') {
      this.showProgressbar = false
    } else if (event.operation === 'close' && event.data === 'login') {
      this._dialogRef.close(event.data)
    } else {
      this._dialogRef.close(event)
    }
  }
}
