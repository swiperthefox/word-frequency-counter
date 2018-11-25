<template>
  <div class="window">
    <form action="">
      <div v-if="formWarning" class="warning">{{ formWarning }}</div>
      <div class="form-group">
        <label>名称：</label>
        <input class="form-control" v-model='doc.name' placeholder="请输入文本材料名称">
      </div>
      <div class="form-group">
        <label class="bold">材料文本：</label>
        <button type='button' style="float: right" class="btn btn-large" v-if="allowFromFile" @click='loadDocument'>
          从文件加载
        </button>
        <textarea id="content" rows="20" v-model='doc.content'></textarea>
      </div>
      <div v-if="computing">
        <div>选择了以下文件：
          <ul><li v-for="filename in filenames" :key="filename">{{ filename }}</li></ul>
        正在统计 {{ randomWord }}
        </div>
      </div>
      <div v-if="stats">
        <table>
          <tr><th>字符总数</th><th>单词数</th><th>单词数（去重）</th><th>句子数</th><th>难度水平</th><th>年级</th></tr>
          <tr>
            <td>{{ stats.char }}</td>
            <td>{{ stats.word }}</td>
            <td>{{ stats.wc.size }}</td>
            <td>{{ stats.sentence }}</td>
            <td>{{ stats.level }}</td>
            <td>{{ stats.gradecn }}</td>
          </tr>
        </table>
      </div>
      <div v-if="docWarning" class="warning">{{ docWarning }}</div>
      <div>
        <button @click.prevent='cancel'>取消</button>
        <button @click.prevent='confirm'>确定</button>
      </div>
    </form>
  </div>
</template>

<script>
// import { ipcRenderer } from 'electron'
import path from 'path'

import textStats from 'src/lib/text-stats'
import extractFile from 'src/lib/text-extractor'
import { clearInterval, setInterval } from 'timers'

let data = {
  doc: {
    name: '',
    content: ''
  },
  formWarning: '',
  docWarning: '',
  allowFromFile: true,
  stats: null,
  randomWord: 'word',
  filenames: []
}

function reset () {
  data.doc.name = ''
  data.doc.content = ''
  data.docWarning = ''
  data.formWarning = ''
  data.allowFromFile = true
  data.stats = null
  data.filenames = []
}

let randomWordMaker = setInterval(() => {
  let idx = Math.floor(Math.random() * 10)
  let words = ['counting', 'different', 'words', 'home', 'school', 'play', 'study', 'eat', 'sleep', 'happy']
  data.randomWord = words[idx]
}, 100)

export default {
  data: () => data,
  computed: {
    computing: function () {
      return (this.doc.content.length > 0 && this.stats === null)
    }
  },
  watch: {
    'doc.content': function (newValue, oldValue) {
      this.$nextTick(() => {
        data.stats = textStats(newValue)
        clearInterval(randomWordMaker)
      })
    }
  },
  methods: {
    loadDocument (event) {
      // event.preventDefault()
      let filenames = selectTextFiles()
      if (filenames === undefined || filenames.length === 0) {
        return
      }

      extractTextFromFiles(filenames, (err, content, failList) => {
        if (err) {
          console.log(err)
        } else {
          this.doc.content = content
          // If only one file is selected, file the 'name' field with the file's name
          if (filenames.length === 1 && this.doc.name === '' && failList.length === 0) {
            this.doc.name = path.basename(filenames[0], path.extname(filenames[0]))
          }
          if (failList.length > 0) {
            this.warning = '下列文件读取错误，请把他们的内容复制到文本框中。\n' + failList.join('\n')
          }
        }
      })
    }, // loadDocument
    cancel () {
      reset()
      this.$router.push({path: '/'})
      console.log('cancel')
    },
    confirm () {
      this.$store.dispatch('addDocument', this.doc)
      this.$router.push({path: '/'})
      reset()
      console.log('confirm')
    }
  }
}

function selectTextFiles () {
  const { dialog } = require('electron').remote
  return dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      {name: '文本', extensions: ['pdf', 'doc', 'docx', 'txt']},
      {name: 'All Files', extensions: ['*']}
    ],
    title: '选择文档（可选择多个文件）',
    label: '确定'
  })
}

function extractTextFromFiles (filenames, cb) {
  let unfinished = filenames.length
  let failList = []
  let contentArray = filenames.map(() => '')
  console.log('start get text content at', new Date())
  filenames.forEach((filename, idx) => {
    extractFile(filename, (err, text) => {
      unfinished--
      if (!err) {
        contentArray[idx] = text
        if (unfinished === 0) {
          let allText = contentArray.join('\n')
          cb(null, allText, failList)
          console.log('Finished get text content at', new Date())
        }
      } else {
        failList.push(filename)
        console.log(err)
      }
    })
  })
}
</script>

<css>
</css>
