import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Download } from 'src/app/models/models';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss']
})
export class CustomSnackbarComponent implements OnInit {
  public progress$: Observable<Download>

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackRef: MatSnackBarRef<CustomSnackbarComponent>,
    private _dashboardService: DashboardService
  ) { }

  public ngOnInit(): void {
    this.progress$ = this._dashboardService.fetchExcel(this.data)
  }

  public dismiss(): void {
    this._snackRef.dismiss()
  }

}
