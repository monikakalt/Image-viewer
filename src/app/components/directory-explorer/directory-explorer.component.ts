import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileInfo} from '../../models/file-info';
import {FileService} from '../../services/file.service';
import {FileOptions} from '../../services/file-options.enum';

@Component({
  selector: 'app-directory-explorer',
  templateUrl: './directory-explorer.component.html',
  styleUrls: ['./directory-explorer.component.scss']
})
export class DirectoryExplorerComponent implements OnInit {

  @Output()
  currentPathChanged: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();

  directories: FileInfo[];

  constructor(private fileService: FileService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const path = this.fileService.getHomeDirectoryPath();

    const fileInfo = new FileInfo();
    fileInfo.fullPath = this.fileService.normalizePath(path);
    fileInfo.name = fileInfo.fullPath;
    this.readDirectoryInfo(fileInfo);
  }

  readDirectoryInfo(fileInfo: FileInfo) {
    const upDirectory = this.fileService.getUpDirectory(fileInfo.fullPath);
    this.fileService.getFilesWithStat(fileInfo.fullPath, FileOptions.DirectoriesOnly).subscribe(f => {
      const directories = [];
      if (upDirectory.fullPath !== fileInfo.fullPath) {
        directories.push(upDirectory);
      }
      directories.push(...f);
      this.directories = directories;
      this.cd.detectChanges(); // workaround
      this.currentPathChanged.emit(fileInfo);
    });
  }

  directoryClicked(fileInfo: FileInfo) {
    this.readDirectoryInfo(fileInfo);
  }

}
