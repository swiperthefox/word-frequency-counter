import stemmer from 'stemmer'

let irvStr = require('./irregularverbs.txt')

function loadIrregularWords (contents) {
  let lines = contents.split('\n')
  console.log(lines.length, 'lines in total.')
  let irregularVerbs = new Map()
  for (var i = 0; i < lines.length; ++i) {
    let words = lines[i].split(' ')
    irregularVerbs.set(words[0], words[1])
  }
  return irregularVerbs
}
const irregularVerbs = loadIrregularWords(irvStr)
irvStr = undefined

class WordClassCounter {
  constructor () {
    this.counter = new Map()
    this.header = null
    this.total = 0
  }
  addWord (w, worig) {
    this.total += 1
    this.counter.set(w, (this.counter.get(w) || 0) + 1)
    if (this.header === null || (this.header.length > worig.length)) {
      this.header = worig
    }
  }
}

class WordFreqCounter {
  constructor () {
    this.map = new Map()
  }
  addWord (word) {
    let wordOrign = irregularVerbs.get(word) || word
    let root = stemmer(wordOrign)
    if (!this.map.has(root)) {
      this.map.set(root, new WordClassCounter())
    }
    let counter = this.map.get(root)
    counter.addWord(word, wordOrign)
  }
  exportCSV () {
    let wordCounter = this.map
    let result = []
    let allWords = Array.from(wordCounter.values())
    allWords.sort((item1, item2) => (item2.total - item1.total))
    allWords.forEach((item) => {
      let allsubwords = Array.from(item.counter)
      allsubwords.sort((item1, item2) => (item2[1] - item1[1]))
      let header = item.header || allsubwords[0][0]
      let headerBody = (allsubwords.length > 1) ? '' : allsubwords[0][0]
      result.push([header, headerBody, item.total])
      if (allsubwords.length > 1) {
        result.push(...(allsubwords.map(item => item.unshift(header) && item)))
      }
    })
    let csvHeader = '"单词原型","单词","次数"'
    let csvString = result.map(item => `"${item[0]}","${item[1]}",${item[2]}`).join('\n')
    return csvHeader + '\n' + csvString
  }
}

export default function countWord (txt) {
  let counter = new WordFreqCounter()
  for (let word of allWords(txt)) {
    counter.addWord(word)
  }
  return counter
}

function *allWords (txt) {
  txt = txt.toLowerCase()
  let wordPattern = /[a-z]+/g
  let match
  while ((match = wordPattern.exec(txt)) != null) {
    if (match[0].length > 1) {
      yield match[0]
    }
  }
}
