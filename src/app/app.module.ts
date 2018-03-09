import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PathComponent } from './components/path/path.component';
import { DirectoryExplorerComponent } from './components/directory-explorer/directory-explorer.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import {NativeService} from './services/native.service';
import {FileService} from './services/file.service';
import {MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatListModule} from '@angular/material';
import { AboutComponent } from './components/about/about.component';
import {ElectronMenuService} from './services/electron-menu.service';


@NgModule({
  declarations: [
    AppComponent,
    PathComponent,
    DirectoryExplorerComponent,
    GalleryComponent,
    AboutComponent
  ],
  entryComponents: [
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    NativeService,
    FileService,
    ElectronMenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
