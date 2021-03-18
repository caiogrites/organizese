import { Injectable } from '@angular/core'
import { NgxIndexedDBService } from 'ngx-indexed-db'
import { Observable, from, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class IndexdbService {
  constructor(
    private _indexdb: NgxIndexedDBService
  ) { }

  public create(payload: any): Observable<any> {
    return from(this._indexdb.add('PrimeiroApp', payload))
  }

  public update(payload: any): Observable<any> {
    return from(this._indexdb.update('PrimeiroApp', payload))
  }

  public delete(id: string): Observable<any> {
    return from(this._indexdb.delete('PrimeiroApp', id))
  }

  public clearStore(): Observable<any> {
    return from(this._indexdb.clear('PrimeiroApp'))
  }

  public getById(id: string): Observable<any> {
    return from(this._indexdb.getByID('PrimeiroApp', id))
  }

  public getAll(): Observable<any> {
    return from(this._indexdb.getAll('PrimeiroApp'))
  }

  public getByIndex(index: number): Observable<any> {
    return from(this._indexdb.getByIndex('PrimeiroApp', 'issue', index))
  }

  public count(): Observable<any> {
    return from(this._indexdb.count('PrimeiroApp'))
  }
}
