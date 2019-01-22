import md5Hash from 'md5-file'
import path from 'path'
import { statSync } from 'fs'

import extractText from 'src/lib/text-extractor'

function createDocuments (filenames, cb) {
  filenames.forEach((filename) => {
    extractText(filename, (err, txt) => {
      if (err) {
        cb(filename)
      } else {
        let lastmtime = statSync(filename).mtimeMs
        let fileEntry = {
          name: filename,
          md5: md5Hash.sync(filename),
          content: txt,
          _lastmt: lastmtime
        }

        let doc = createDocument(
          path.parse(filename).name,
          [fileEntry]
        )
        cb(null, doc)
      }
    })
  })
}

function mergeDocument (name, selectedDocs) {
  let files = mergeFileList(selectedDocs)
  return createDocument(name, files)
}

function mergeFileList (documents) {
  let fileHashes = new Map()
  for (let doc of documents) {
    for (let fileEntry of doc.files) {
      let md5 = fileEntry.md5
      if (!fileHashes.has(md5)) {
        fileHashes.set(md5, fileEntry)
      } else {
        let old = fileHashes.get(md5)
        if (fileEntry._lastmt > old._lastmt) {
          fileHashes.set(md5, fileEntry)
        }
      }
    }
  }
  return Array.from(fileHashes.values())
}

function cloneDocument (document) {
  let fileEntries = document.files.map(entry => ({...entry}))
  return {
    name: document.name,
    files: fileEntries,
    _version: (document._version || 0) + 1,
    _id: document._id
  }
}

export { createDocuments, mergeDocument, cloneDocument }

// helpers

function createDocument (name, files) {
  return {
    name,
    files,
    _version: 0
  }
}
