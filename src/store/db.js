import Nedb from 'nedb'
import path from 'path'
import Electron from 'electron'

class DocDB {
  constructor () {
    let dbFolder = Electron.remote.app.getPath('appData')
    let dbPath = path.join(dbFolder, 'wordfreq', 'word-freq-count.nedb')
    console.log('using db at:', dbPath)
    this.db = new Nedb({
      filename: dbPath,
      autoload: true
    })
    // this.db.remove({}, { multi: true }, function (err, numRemoved) {
    //   console.log(err)
    // })
  }
  load (cb) {
    this.db.find({}, (err, docs) => {
      if (err) {
        console.log('Failed to load nedb')
        console.log(err)
      } else {
        cb(null, docs)
      }
    })
  }
  insert (doc, cb) {
    console.log('inserting doc:', doc.name)
    this.db.insert(doc, (err, newDoc) => {
      if (err) {
        console.log('Failed to insert document')
        console.log(err)
      } else {
        cb(null, [newDoc])
      }
    })
  }
  remove (doc, opt, cb) {
    this.db.remove(doc, opt, cb)
  }
}

export default DocDB
