var httpreq = require('httpreq')
const {remote} = require('electron')
import {URL} from 'url'
import {rename} from 'fs'
import path from 'path'

const tmpPath = path.join(remote.app.getPath('temp'), 'tmp_app.asar')
const asarPath = path.join(remote.app.getAppPath(), 'Resources', 'app', 'app.asar')

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
          let asarURL = new URL(url, 'https://github.com/')
          let oldVersion = remote.app.getVersion()
          if (newer(version, oldVersion)) {
            httpreq.download(asarURL, tmpPath, function (err, progress) {
              if (err) {
                cb(err)
              } else {
                cb(null, {type: 'progress', data: progress})
              }
            }, function (err, res) {
              if (err) {
                cb(err)
              } else {
                rename(tmpPath, asarPath)
                cb(null, {type: 'done', data: res})
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
