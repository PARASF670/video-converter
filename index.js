'use strict';
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');

const fs = require('fs');

function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

var mainWindow = null;
var ipc = require('electron').ipcMain;
var os = require('os');


ipc.on('close-main-window', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 600,
        width: 800,
        webPreferences:{
          nodeIntegration:true
        }
    });
    var menu = Menu.buildFromTemplate([
        {
          
            label: 'New Project', click(){
                Openfolder();
           
          }
        },
          {type:'separator'},
        {
          label: 'Exit',
          click() {
            app.quit()
          }
        }
        
    ])
    Menu.setApplicationMenu(menu); 
mainWindow.loadURL('file://' + __dirname + '/main.html');
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});


//dialog for selecting only particular formats
ipc.on('open-file-dialog-for-file', function (event) {
    console.log("button pressed")
    console.log(event)
    if(os.platform() === 'linux' || os.platform() === 'win32'){

        dialog.showOpenDialog(null, {
            properties: ['openFile'],
            filters:[{name: 'Movies', extensions: ['mp4']}]
          }).then(result => {
            console.log(result.filePaths)
            event.sender.send("selected-file",result.filePaths[0])
          }).catch(err => {
            console.log(err)
          })
   } else {
       dialog.showOpenDialog({
           properties: ['openFile', 'openDirectory'],
           filters:[{name: 'Movies', extensions: ['mp4']}]
       }, function (files) {
           if (files) event.sender.send('selected-file', files[0]);
       });
   }});

  //open folder dialog

function Openfolder() {
    dialog.showOpenDialog({ properties: ['openDirectory'], title: "Select Empty foder only" }
    ).then(result => {
       
      var check = isEmpty(result.filePaths[0]);
      if (check) {
        
        dialog.showMessageBox({ type: 'info', message: "Folder Selected ", title: "Success" })
        // event.sender.send("selected-folder", result.filePaths[0]);
        console.log(result.filePaths[0]);   
        
      } else {
        
        dialog.showMessageBox({ type: 'error', message: "Please Select empty folder only" });
        
      }
      
    }).catch(err => {
      console.log(err)
    }); 
}
