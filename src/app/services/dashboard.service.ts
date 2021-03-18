import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusCode } from 'aws-sdk/clients/apigateway';
import { Observable } from 'rxjs';
import { Consolidado, Register } from '../models/models';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private constants: Constants,
  ) { }

  private convertJsonToUrl(payload: any): string {
    if (!payload) return ''
    return '?' + Object.entries(payload).map(e => e.join('=')).join('&')
  }

  public fetchRegisters(params?: any): Observable<Register[]> {
    return this.http.get<Register[]>(`${this.constants.get('fetch_registers')}${this.convertJsonToUrl(params)}`)
  }

  public fetchSearch(params?: any): Observable<Register[]> {
    return this.http.get<Register[]>(`${this.constants.get('fetch_search')}${this.convertJsonToUrl(params)}`)
  }

  public newRegister(payload: Register): Observable<Register> {
    return this.http.post<Register>(this.constants.get('new_register'), payload)
  }

  public fetchConsolidado(): Observable<Consolidado> {
    return this.http.get<Consolidado>(this.constants.get('fetch_consolidado'))
  }

  public deleteRegister(payload: Register): Observable<Register> {
    return this.http.post<Register>(this.constants.get('delete_register'), payload)
  }

  public updateRegister(payload: Register): Observable<Register> {
    return this.http.post<Register>(this.constants.get('update_register'), payload)
  }

  public getStatusCode(): Observable<StatusCode[]> {
    return this.http.get<StatusCode[]>(this.constants.get('get_status_code'))
  }

  public fetchEvocucao(): Observable<any> {
    return this.http.get<any>(this.constants.get('fetch_evolucao'))
  }

  public fetchEvocucaoDespesas(): Observable<any> {
    return this.http.get<any>(this.constants.get('fetch_evolucao_despesas'))
  }

  public fetchEvocucaoDetail(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('fetch_evolucao_detail'), payload)
  }

  public setDevMode(mode: any): Observable<any> {
    return this.http.post<any>(this.constants.get('set_dev_mode'), mode)
  }

  public fetchAutocomplete(): Observable<any> {
    return this.http.get<any>(this.constants.get('get_list_autocomplete'))
  }

  public userUpdatePassword(payload: any): Observable<any> {
    const credentials = { 'Authorization': `${btoa(payload.old_password)}:updateuser:${btoa(payload.new_password)}` }
    return this.http.get<any>(this.constants.get('update_user'), { headers: credentials })
  }
}
