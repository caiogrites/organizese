import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadService } from 'src/app/services/load.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  public ngOnInit(): void {
  }

  public onTrigger(event: any): void {
    if (event.operation === 'close' && event.data === 'login') {
      this._router.navigateByUrl('/dashboard')
    }
  }
}
