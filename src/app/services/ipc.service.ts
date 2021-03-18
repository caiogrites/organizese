import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron'

export interface window {
  require: NodeRequire
}

@Injectable({
  providedIn: 'root'
})

export class IpcService {
  private _ipc: IpcRenderer | undefined = void 0

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
        console.group('%cBem-vindo ao Primeiro App', "color: #2196F3;");
      } catch (e) {
        throw e;
      }
    } else {
      console.log('%cElectron\'s IPC was not loaded', "color: #2196f3;");
    }
  }

  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public send(channel: string, ...args: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }
}
