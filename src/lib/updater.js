var httpreq = require('httpreq')

export function checkUpdate(cb) {
  )
}

function getLatestVersion (cb) {
  httpreq.get('https://github.com/swiperthefox/word-frequency-counter/releases/latest',
  (err, res) => {
    if (err) {
      cb(err)
      return
    } else {
      let data = res.body
      // https://github.com/swiperthefox/word-frequency-counter/releases/download/wordfreq-v1.0.18/Word.Frequency.Setup.1.0.0.exe
      let pat = /href[^<>]*\/releases\/download/([0-9.]+)\/app.asar/
      let match = pat.match(data)

    }

}
httpreq.download(
  'https://ssl.gstatic.com/gb/images/k1_a31af7ac.png',
  __dirname + '/test.png'
, function (err, progress){
  if (err) return console.log(err);
  console.log(progress);
}, function (err, res){
  if (err) return console.log(err);
  console.log(res);
});

const {app} = require('electron')
app.on('ready', function () {
    console.log(app.getVersion())
})

let options = {
  url: 'https://github.com/swiperthefox/word-frequency-counter/releases/latest'
}