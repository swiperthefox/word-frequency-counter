import md5Hash from 'md5-file'
import { statSync } from 'fs'
import extractText from 'src/lib/text-extractor'

function createDocuments (filenames, cb) {
  let goodFiles = []
  let failedFiles = []

  filenames.forEach((filename) => {
    extractText(filename, (err, txt) => {
      if (err) {
        failedFiles.push([filename, err])
        cb(err, filename)
      } else {
        let lastmtime = statSync(filename).mtimeMs
        let fileEntry = {
          name: filename,
          md5: md5Hash.sync(filename),
          content: txt,
          _lastmt: lastmtime
        }
        goodFiles.push(fileEntry)
      }
      if (goodFiles.length + failedFiles.length === filenames.length) {
        let doc = createDocument('', goodFiles)
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
    _id: document._id,
    createTime: document.createTime
  }
}

function compareDoc (a, b) {
  return a.createTime < b.createTime
}

export { createDocuments, mergeDocument, cloneDocument, compareDoc }

// helpers

function createDocument (name, files) {
  return {
    name,
    files,
    _version: 0,
    createTime: Date.now()
  }
}
