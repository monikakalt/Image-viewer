import {Injectable, NgZone} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NativeService} from './native.service';
import {AboutComponent} from '../components/about/about.component';

@Injectable()
export class ElectronMenuService {

  private screen = this.nativeService.electron.screen;
  private desktopCapturer = this.nativeService.electron.desktopCapturer;
  private remote = this.nativeService.electron.remote;
  private shell = this.nativeService.electron.shell;

  constructor(private nativeService: NativeService, private dialog: MatDialog, private ngZone: NgZone) {
    nativeService.electron.ipcRenderer.on('about', () => {
      this.showAboutDialog();
    });

    nativeService.electron.ipcRenderer.on('screenshot', () => {
      this.takeScreenshot();
    });
  }

  showAboutDialog() {
    this.ngZone.run(() => {
      this.dialog.closeAll();
      this.dialog.open(AboutComponent);
    });
  }

  determineScreenShotSize () {
    const screenSize = this.screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    };
  }

  takeScreenshot() {
    console.log('Taking a screenshot...');
    const thumbSize = this.determineScreenShotSize();
    console.log(thumbSize);
    const options = { types: ['screen'], thumbnailSize: thumbSize };
    this.desktopCapturer.getSources(options, (error, sources) => {
      if (error) { console.log('error'); } // todo: error dialog

      sources.forEach((source) => {
        if (source.name === 'Entire screen' || source.name === 'Screen 1') {
          this.remote.dialog.showSaveDialog({filters: [{name: 'PNG Files', extensions: ['png']}]}, (fileName) => {
            console.log(fileName);
            if (fileName == null) { return; }
            this.nativeService.fs.writeFile(fileName, source.thumbnail.toPng(), (error) => {
              if (error) {
                console.error(error);
                this.remote.dialog.showErrorBox('Error', error);
              } else {
                this.shell.openExternal(`file://${fileName}`);
              }
            });
          });
        }
      });
    });
  }

}
