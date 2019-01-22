import pdfToText from './pdf.js'
import docToText from './doc.js'
import docxToText from './docx.js'

import chardet from 'chardet'
const iconv = require('iconv-lite')

const { readFile } = require('fs')

function txtReader (filename, cb) {
  chardet.detectFile(filename, { sampleSize: 256 },
    function (err, encoding) {
      console.log('encoding is:', encoding)
      if (err) {
        cb(err)
      } else {
        readFile(filename, null, (err, data) => {
          if (err) {
            cb(err)
          } else {
            cb(null, iconv.decode(data, encoding))
          }
        })
      }
    }
  )
}

export default function extractFile (filename, cb) {
  let extractorMap = new Map([
    ['pdf', pdfToText],
    ['doc', docToText],
    ['docx', docxToText],
    ['txt', txtReader]
  ])
  let extension = filename.toLowerCase().split('.').pop()
  if (extractorMap.has(extension)) {
    try {
      extractorMap.get(extension)(filename, cb)
    } catch (err) {
      cb(err)
    }
  } else {
    cb(new Error('Unsupported file format.'))
  }
}
