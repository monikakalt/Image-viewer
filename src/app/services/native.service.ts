import { Injectable } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class NativeService {

  constructor() { }

  get nativeWindow(): any {
    return _window();
  }

  get fs(): any {
    return this.nativeWindow.NODE_FS;
  }

  get os(): any {
    return this.nativeWindow.NODE_OS;
  }

  get path(): any {
    return this.nativeWindow.NODE_PATH;
  }

  get electron(): any {
    return this.nativeWindow.ELECTRON;
  }

  get fileUrl(): any {
    return this.nativeWindow.LIB_FILE_URL;
  }

}






