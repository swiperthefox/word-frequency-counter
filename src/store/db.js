import Nedb from 'nedb'

class DocDB {
  constructor (dbPath) {
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
        cb(null, newDoc)
      }
    })
  }
  remove (docId, opt, cb) {
    this.db.remove({_id: docId}, opt, cb)
  }
  update (doc, cb) {
    if (doc._id === undefined) {
      this.insert(doc, cb)
    } else {
      this.db.update({_id: doc._id}, doc, {returnUpdatedDocs: true},
        (err, n, affectedDoc, _) => {
          if (err) {
            cb(err)
          } else if (n === 1) {
            cb(null, affectedDoc)
          }
        })
    }
  }
}

export default DocDB
