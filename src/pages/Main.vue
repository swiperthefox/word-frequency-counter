<template>
  <div>
    <h3>词频统计</h3>
    <h4> Docx Content </h4>
    <div> {{ docxContent }} </div>
    <h4> Doc content </h4>
    <div> {{ docContent }} </div>
    <h4> PDF content </h4>
    <div> {{ pdfContent }} </div>
    {{ JSON.stringify(stats) }}
    <pre>
    {{ stats.wc.exportCSV() }}
    </pre>
  </div>
</template>

<script>
import textExtractor from '../lib/text-extractor/textextractor'
import textstats from '../lib/text-stats/textstats'

let data = {
  docxContent: '',
  docContent: 'hi',
  pdfContent: 'load of pdf'
}

export default {
  data: () => data,
  computed: {
    stats: function () {
      return textstats(this.pdfContent)
    }
  }
}

for (let typ of [ 'doc', 'docx', 'pdf' ]) {
  textExtractor('/tmp/sample.' + typ, (err, txt) => {
    if (err) {
      console.log(err)
    } else {
      data[typ + 'Content'] = txt.substring(0, 400)
    }
  })
}
</script>
<style>
</style>
