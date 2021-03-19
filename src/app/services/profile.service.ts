import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Constants } from './constants'

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(
    private http: HttpClient,
    private constants: Constants,
  ) { }

  public profileUpdate(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('profile_update'), payload)
  }
}
