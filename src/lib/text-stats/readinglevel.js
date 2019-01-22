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
  [1, {age: '5-6', gradeen: 'Kindergarten', gradecn: '幼儿园', gradenum: 'Kindergarten'}],
  [2, {age: '6-7', gradeen: 'First/Second Grade', gradecn: '一/二年级', gradenum: '1st/2nd Grade'}],
  [3, {age: '7-9', gradeen: 'Third Grade', gradecn: '三年级', gradenum: '3rd Grade'}],
  [4, {age: '9-10', gradeen: 'Fourth Grade', gradecn: '四年级', gradenum: '4th Grade'}],
  [5, {age: '10-11', gradeen: 'Fifth Grade', gradecn: '五年级', gradenum: '5th Grade'}],
  [6, {age: '11-12', gradeen: 'Sixth Grade', gradecn: '六年级', gradenum: '6th Grade'}],
  [7, {age: '12-13', gradeen: 'Seventh Grade', gradecn: '七年级', gradenum: '7th Grade'}],
  [8, {age: '13-14', gradeen: 'Eighth Grade', gradecn: '八年级', gradenum: '8th Grade'}],
  [9, {age: '14-15', gradeen: 'Ninth Grade', gradecn: '九年级', gradenum: '9th Grade'}],
  [10, {age: '15-16', gradeen: 'Tenth Grade', gradecn: '十年级', gradenum: '10th Grade'}],
  [11, {age: '16-17', gradeen: 'Eleventh Grade', gradecn: '十一年级', gradenum: '11th Grade'}],
  [12, {age: '17-18', gradeen: 'Twelfth Grade', gradecn: '十二年级', gradenum: '12th Grade'}],
  [13, {age: '18-24', gradeen: 'College student', gradecn: '大学生', gradenum: 'College'}],
  [14, {age: '24+', gradeen: 'Professor', gradecn: '教授', gradenum: 'Professor'}]
])

export default function readingLevel (txt) {
  let stats = stat(txt)
  let level = Math.ceil(readability(stats))
  stats.level = (isNaN(level) ? 'N/A' : level)
  let {age, gradenum} = level2grade.get(level) || {age: '??', gradecn: '??', gradenum: '??'}
  console.log(level, age, gradenum)
  stats.age = age
  if (gradenum.endsWith('Grade')) {
    gradenum = gradenum.substring(0, gradenum.length - 6)
  }
  stats.grade = gradenum
  return stats
}
