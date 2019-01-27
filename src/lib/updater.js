/* An adhoc updating system that failed

The idea is that an Electron application consists of two parts: the electron framework shell
and application specific contents (in resources/app folder, or archived as an app.asar file).
On a typical electron application, the former contributes 90% of the size (~100M) while the
later is less than 10M.

To update an application, we only need to download and replace the app.asar file, which is what
this file does.

BUT this doesn't work, because of different reasons for the three major os:

On Mac OS, the application is packaged in a single .app file, whose contents can't be replaced.
On Linux, the AppImage application runs by mounting "resources" to a temp directory,
so replacing the app.asar in this directory is useless.
On Windows, the application is installed to a folder on the disk, but the file is locked, and
can't be replaced within the running app. See https://github.com/electron/electron/issues/2198
for a discussion about this topic.

POSSIBLE WORDAROUND:
1. Package the app as zip file for all OS.
2. For each platform, create a simple script to update asar file. (using Linux as example):
    #! /bin/bash
    # first to check if there is a new file for app.asar, if so, update app.asar.
    # (note that due to Eletrons's patch for the fs module, the new app.asar is
    #  saved in new_app, insteaf of new_app.asar)
    if [[ -f "new_app" ]]
    then
        mv new_app app.asar
    fi
    # start app
    electron
3. In the app, after an update has been downlaoded, call app.relunch, with "execPath" set to
be the previous script.
*/

import httpreq from 'httpreq'
import {remote} from 'electron'
import {URL} from 'url'
// import {rename} from 'fs'
import path from 'path'

const tmpPath = path.join(process.resourcesPath, 'temp_app')
const asarPath = path.join(process.resourcesPath, 'app.asar')

export default function tryUpdate (cb) {
  httpreq.get(
    'https://github.com/swiperthefox/word-frequency-counter/releases/latest',
    (err, res) => {
      if (err) {
        cb(err)
      } else {
        let data = res.body
        let pat = /href="([^<>]*\/download\/[^0-9.<>]*([0-9.]*)\/app.asar)/
        let match = pat.exec(data)
        if (!match) {
          cb(new Error('没有更新'))
        } else {
          let [, url, version] = match
          let asarURL = new URL(url, 'https://github.com/').href
          let oldVersion = remote.app.getVersion()
          if (newer(version, oldVersion)) {
            httpreq.download(asarURL, tmpPath, function (err, progress) {
              if (err) {
                console.log(err)
              } else {
                cb(null, {type: 'progress', data: progress})
              }
            }, function (err, res) {
              if (err) {
                cb(err)
              } else {
                cb(null, {type: 'done', data: asarPath})
              }
            })
          }
        }
      }
    }
  )
}

function newer (newVar, oldVer) {
  return true
  // let vparts1 = newVar.split('.')
  // let vparts2 = oldVer.split('.')
  // if (vparts1.length !== vparts2.length) {
  //   return true
  // }
  // for (let i = 0; i < vparts1.length; ++i) {
  //   let v1 = parseInt(vparts1[i])
  //   let v2 = parseInt(vparts2[i])
  //   if (isNaN(v1) || isNaN(v2) || v1 > v2) {
  //     return true
  //   } else if (v1 < v2) {
  //     return false
  //   }
  // }
  // return false
}
