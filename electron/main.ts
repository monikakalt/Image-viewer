import { app, BrowserWindow, Tray, MenuItemConstructorOptions, Menu  } from 'electron';
import * as path from 'path';
import * as url from 'url';


let mainWindow: Electron.BrowserWindow;
let appIcon: Tray;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    icon: path.join(__dirname, 'assets/img/x-icon.png')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  const menuHelper = new MenuHelper(mainWindow);
  Menu.setApplicationMenu(menuHelper.mainMenu);

  const iconPath = path.join(__dirname, 'assets/img/x-icon.png');
  appIcon = new Tray(iconPath);
  appIcon.setToolTip('Image Viewer');
  appIcon.setContextMenu(menuHelper.trayMenu);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
export class MenuHelper {

  constructor(private browserWindow: BrowserWindow) {
  }

  private mainMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          role: 'close'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            this.browserWindow.webContents.send('about');
          }
        }
      ]
    }
  ];

  private trayMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'New screenshot',
      click: () => {
        this.browserWindow.webContents.send('screenshot');
      }
    },
    {
      label: 'Exit',
      click: () => { app.quit(); }
    }
  ];

  get mainMenu() {
    return Menu.buildFromTemplate(this.mainMenuTemplate);
  }

  get trayMenu() {
    return Menu.buildFromTemplate(this.trayMenuTemplate);
  }

}
