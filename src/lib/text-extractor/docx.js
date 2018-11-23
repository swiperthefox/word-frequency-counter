const fs = require('fs')
const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')

export default function docxToText (filename, cb) {
  let content = fs.readFileSync(filename, 'binary')
  let zip = new JSZip(content)
  let doc = new Docxtemplater()
  doc.loadZip(zip)
  cb(null, doc.getFullText())
}
