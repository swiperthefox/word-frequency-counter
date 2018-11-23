import readability from 'automated-readability'

/*
 * Count number of chars, words and sentences in the text. The task
 * is complexified by the following facts:
 * 1. There are a lot of '.'s are used other than as period, like "A. xx B. kk"
 * 2. Not all letters are part of sentences, like "A. xx"
 */
function stat (txt) {
  // words with at least two characters or underlines (for blanks)
  let words = txt.match(/[a-zA-Z_][a-zA-Z_]+/g) || []
  // single letter words, only 'a' or 'i' is possible, and it can't appear at the end of sentence
  let ais = txt.match(/\b[aAiI] /g) || []
  // '.' is a period only if there are at least two alphabet letters before it, to exclude
  // cases like "A. xx"
  let endOfSentence = txt.match(/[a-zA-Z_][a-zA-Z_]\s*[.?!]/g) || []
  let word = words.length + ais.length
  let sentence = endOfSentence.length
  let char = ais.length
  for (let w of words) {
    char += w.length
  }
  return {
    character: char, word, sentence, char
  }
}

let level2grade = new Map([
  [1, {age: '5-6', grade: 'Kindergarten', gradecn: '幼儿园'}],
  [2, {age: '6-7', grade: 'First/Second Grade', gradecn: '一/二年级'}],
  [3, {age: '7-9', grade: 'Third Grade', gradecn: '三年级'}],
  [4, {age: '9-10', grade: 'Fourth Grade', gradecn: '四年级'}],
  [5, {age: '10-11', grade: 'Fifth Grade', gradecn: '五年级'}],
  [6, {age: '11-12', grade: 'Sixth Grade', gradecn: '六年级'}],
  [7, {age: '12-13', grade: 'Seventh Grade', gradecn: '七年级'}],
  [8, {age: '13-14', grade: 'Eighth Grade', gradecn: '八年级'}],
  [9, {age: '14-15', grade: 'Ninth Grade', gradecn: '九年级'}],
  [10, {age: '15-16', grade: 'Tenth Grade', gradecn: '十年级'}],
  [11, {age: '16-17', grade: 'Eleventh Grade', gradecn: '十一年级'}],
  [12, {age: '17-18', grade: 'Twelfth grade', gradecn: '十二年级'}],
  [13, {age: '18-24', grade: 'College student', gradecn: '大学生'}],
  [14, {age: '24+', grade: 'Professor', gradecn: '教授'}]
])

export default function readingLevel (txt) {
  let stats = stat(txt)
  let level = Math.ceil(readability(stats))
  stats.level = (isNaN(level) ? 'N/A' : level)
  let {age, grade} = level2grade.get(level) || {age: 'N/A', gradecn: 'N/A', grade: 'N/A'}
  console.log(level, age, grade)
  stats.age = age
  stats.grade = grade
  return stats
}
