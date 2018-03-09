
import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FileInfo} from '../../models/file-info';
import {FileService} from '../../services/file.service';
import {NativeService} from '../../services/native.service';
import {FileOptions} from '../../services/file-options.enum';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnChanges {

  @Input()
  currentPath: string;

  currentDirectory: string;
  supportedExtensions: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
  imageFiles: FileInfo[];

  constructor(private fileService: FileService, private nativeService: NativeService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentPath.currentValue == null || changes.currentPath.currentValue === '') {
      return;
    }
    this.currentDirectory = changes.currentPath.currentValue;
    this.fileService.getFilesWithStat(this.currentDirectory, FileOptions.FilesOnly, this.supportedExtensions).subscribe(f => {
      this.imageFiles = f;
      this.changeDetector.detectChanges();
    });
  }

  openFile(fileInfo: FileInfo) {
    this.fileService.openFile(fileInfo.fullPath);
  }

  deleteFile(fileInfo: FileInfo) {
    const dialog = this.nativeService.electron.remote.dialog;
    const currentWindow = this.nativeService.electron.remote.getCurrentWindow();
    dialog.showMessageBox(currentWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: `Are you sure you want to delete ${fileInfo.name}?`
      }, (choice) => {
        if (choice === 0) {
          this.fileService.deleteFile(fileInfo.fullPath);
          const index = this.imageFiles.indexOf(fileInfo);
          if (index !== -1) {
            this.imageFiles.splice(index, 1);
            this.changeDetector.detectChanges();
          }
        }
      }
    );
  }

}
