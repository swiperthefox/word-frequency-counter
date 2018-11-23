var WordExtractor = require('word-extractor')

export default function docToText (filename, cb) {
  let extractor = new WordExtractor()
  let extracted = extractor.extract(filename)
  extracted.then(function (doc) {
    cb(null, doc.getBody())
  })
}
