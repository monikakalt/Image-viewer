import {ChangeDetectorRef, Component} from '@angular/core';
import {FileInfo} from './models/file-info';
import {ElectronMenuService} from './services/electron-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentPathInfo: FileInfo;

  constructor(private changeDetector: ChangeDetectorRef,
  private electronMenuService: ElectronMenuService) {}

  currentPathChanged(fileInfo: FileInfo) {
    console.log(fileInfo);
    this.currentPathInfo =  fileInfo;
    this.changeDetector.detectChanges();
  }
}
