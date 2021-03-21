import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {
  @Input() public downloadItem: any

  constructor() { }

  ngOnInit(): void {
    console.log(this.downloadItem)
  }

  public isDark(): boolean {
    return localStorage.getItem('user-theme') === 'light-mode'
  }
}
