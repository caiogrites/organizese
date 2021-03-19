import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { StatusCode } from 'aws-sdk/clients/apigateway'
import { Observable } from 'rxjs'
import { Constants } from './constants'

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor(
    private http: HttpClient,
    private constants: Constants,
  ) { }

  public isOnline(): Observable<boolean> {
    return this.http.get<any>(this.constants.get('fetch_is_online'))
  }

  public getStatusCode(): Observable<StatusCode[]> {
    return this.http.get<StatusCode[]>(this.constants.get('get_status_code'))
  }
}
