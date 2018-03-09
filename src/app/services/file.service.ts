
import {Injectable} from '@angular/core';
import {NativeService} from './native.service';
import {FileInfo} from '../models/file-info';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/empty';
import {FileOptions} from './file-options.enum';

@Injectable()
export class FileService {

  constructor(private nativeService: NativeService) {
  }

  getFilesWithStat(directoryPath: string, fileOptions = FileOptions.All, extensions: string[] = []): Observable<FileInfo[]> {
    const readDirAsObservable = Observable.bindNodeCallback(
      (path: string, callback: (error: Error, files: string[]) => void) => this.nativeService.fs.readdir(path, callback)
    );

    const statAsObservable = Observable.bindNodeCallback(
      (path: string, callback: (error: Error, stats: any) => void) => this.nativeService.fs.stat(path, callback)
    );

    return readDirAsObservable(directoryPath)
      .flatMap(f => f)
      .mergeMap(f => statAsObservable(this.nativeService.path.join(directoryPath, f)).catch(err => Observable.empty())
        .map(s => {
          const fileInfo = new FileInfo();
          fileInfo.fullPath = this.nativeService.path.join(directoryPath, f);
          fileInfo.name = f;
          fileInfo.isDirectory = s.isDirectory();
          fileInfo.url = this.nativeService.fileUrl(fileInfo.fullPath);
          return fileInfo;
        }))
      .filter(f => this.filterFiles(f, fileOptions, extensions)).toArray();
  }

  private filterFiles(f: FileInfo, fileOptions: FileOptions, extensions: string[] = []): boolean {
    switch (fileOptions) {
      case FileOptions.All: {
        return true;
      }
      case FileOptions.DirectoriesOnly: {
        return f.isDirectory === true;
      }
      case FileOptions.FilesOnly: {
        const extension = this.nativeService.path.extname(f.name);
        return extensions.length === 0 ?
          f.isDirectory === false :
          f.isDirectory === false && (extensions.find(e => e === extension) != null);
      }
    }
    return true;
  }

  getUpDirectory(directoryPath: string): FileInfo {
    const upDirectory = this.nativeService.path.join(directoryPath, '..');
    const upDirInfo = new FileInfo();
    upDirInfo.name = '..';
    upDirInfo.fullPath = upDirectory;
    upDirInfo.isDirectory = true;
    return upDirInfo;
  }

  normalizePath(path: string): string {
    return this.nativeService.path.normalize(path);
  }

  pathExists(path: string) {
    return this.nativeService.fs.existsSync(path);
  }

  parsePath(path: string): any {
    return this.nativeService.path.parse(path);
  }

  openFile(path: string) {
    this.nativeService.electron.shell.openItem(path);
  }

  getHomeDirectoryPath(): string {
    return this.nativeService.os.homedir();
  }

  deleteFile(path: string) {
    this.nativeService.fs.unlink(path, error => {
      console.error(error);
    });
  }
}

