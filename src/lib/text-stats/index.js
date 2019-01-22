import readingLevel from './readinglevel'
// import countWord from './freqcount'
import countWord, { exportCSV, csvArrayToString } from './freqcount'

export { exportCSV, csvArrayToString }

let textStats = function textStats (text) {
  console.log('started word count at', new Date())
  let wordCount = countWord(text)
  console.log('started computing readinglevel at', new Date())
  let level = readingLevel(text, 'full')
  console.log('finished computing readinglevel at', new Date())
  level.wc = wordCount
  return level
}

export default textStats
