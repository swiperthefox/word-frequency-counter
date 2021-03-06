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
}

export function exportCSV (wordCounter) {
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
      let subWords = allsubwords.map(item => [header, item[0], item[1]])
      result.push(...subWords)
    }
  })

  return result
}

export function csvArrayToString (csvArray, showSub, showSum) {
  let result
  if (showSub && showSum) {
    result = csvArray
  } else if (showSub) {
    result = []
    csvArray.forEach(item => {
      if (item[1] !== '') {
        result.push([item[1], item[2]])
      }
    })
  } else if (showSum) {
    result = []
    let seen = new Set()
    csvArray.forEach(item => {
      if (!seen.has(item[0])) {
        result.push([item[0], item[2]])
        seen.add(item[0])
      }
    })
  } else {
    result = []
  }

  let showBoth = showSub && showSum
  let csvHeader = showBoth ? '"单词原型","单词","次数"' : '"单词","次数"'
  let formatter = (showBoth
    ? (item) => `"${item[0]}","${item[1]}",${item[2]}`
    : (item) => `"${item[0]}",${item[1]}`
  )
  let csvStrings = result.map(formatter).join('\n')
  return {count: result.length, string: csvHeader + '\n' + csvStrings}
}

export default function countWord (txt) {
  let counter = new WordFreqCounter()
  for (let word of allWords(txt)) {
    counter.addWord(word)
  }
  return counter.map
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
