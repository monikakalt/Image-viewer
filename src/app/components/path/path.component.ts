
import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FileInfo} from '../../models/file-info';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent implements OnInit, OnChanges {

  @Input()
  currentPathInfo: FileInfo;

  currentPath = '';

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentPathInfo.currentValue == null || changes.currentPathInfo.currentValue === '') {
      this.currentPath = '';
    } else {
      this.currentPath = changes.currentPathInfo.currentValue.fullPath;
    }
    this.changeDetector.detectChanges();
  }

}
