import { remote } from 'electron'

app = remote.require('app'),
EBU = remote.require('electron-basic-updater');

export function updaterInit () {
  EBU.init({
    'api': 'http://localhost:8888/update ' // The API EBU will talk to
  });
}
export function updaterCheck (cb) {
  EBU.check(function(error){
    if(error){
      cb({success: false, msg: error})
      console.log(error)
      return false
    }

    cb({success: true, msg: 'App updated successfully! Restart it please.'})
  })
}