import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { StatusCode } from 'aws-sdk/clients/apigateway';
import { Observable } from 'rxjs';
import { Consolidado, Download, Register } from '../models/models';
import { Constants } from './constants';
import { distinctUntilChanged, scan, map, tap } from "rxjs/operators";
import { SAVER, Saver } from '../providers/save.provider';

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress)
}

export function download(saver?: (b: Blob | null) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) => source.pipe(
    scan((download: Download, event): Download => {
      if (isHttpProgressEvent(event)) {
        return {
          progress: event.total ? Math.round((100 * event.loaded) / event.total) : download.progress,
          state: "IN_PROGRESS",
          content: null
        }
      }

      if (isHttpResponse(event)) {
        if (saver) {
          saver(event.body)
        }
        return {
          progress: 100,
          state: "DONE",
          content: event.body
        }
      }

      return download
    },
      { state: "PENDING", progress: 0, content: null }
    ),
    distinctUntilChanged((a, b) => a.state === b.state && a.progress === b.progress && a.content === b.content)
  )
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private constants: Constants,
    @Inject(SAVER) private save: Saver
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

  public fetchExcel(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('fetch_excel'), payload, {
      headers: { responseType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    }).pipe(download((blob) => this.save(blob, 'organizese')))
  }
}

