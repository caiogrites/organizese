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
    return from(this._indexdb.add('organizese', payload))
  }

  public update(payload: any): Observable<any> {
    return from(this._indexdb.update('organizese', payload))
  }

  public delete(id: string): Observable<any> {
    return from(this._indexdb.delete('organizese', id))
  }

  public clearStore(): Observable<any> {
    return from(this._indexdb.clear('organizese'))
  }

  public getById(id: string): Observable<any> {
    return from(this._indexdb.getByID('organizese', id))
  }

  public getAll(): Observable<any> {
    return from(this._indexdb.getAll('organizese'))
  }

  public getByIndex(index: number): Observable<any> {
    return from(this._indexdb.getByIndex('organizese', 'issue', index))
  }

  public count(): Observable<any> {
    return from(this._indexdb.count('organizese'))
  }
}
