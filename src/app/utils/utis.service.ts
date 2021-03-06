import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  constructor() {
  }

  public generateUid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  public isEmpty(object: object): boolean {
    return Object.keys(object).length === 0
  }
}
