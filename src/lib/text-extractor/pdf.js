/*
 * Based on code listed at https://ourcodeworld.com/articles/read/405/how-to-convert-pdf-to-text-extract-text-from-pdf-with-javascript
 */
import PDFJS from 'pdfjs-dist/webpack.js'
import { readFileSync } from 'fs'

export default function pdf2txt (filename, cb) {
  let contents = readFileSync(filename)
  PDFJS.getDocument(contents).then(function (pdf) {
    var pdfDocument = pdf
    var pagesPromises = []

    for (var i = 0; i < pdf.numPages; i++) {
      // Required to prevent that i is always the total of pages
      (function (pageNumber) {
        pagesPromises.push(getPageText(pageNumber, pdfDocument))
      })(i + 1)
    }

    Promise.all(pagesPromises).then(function (pagesText) {
      // Display text of all the pages in the console
      cb(null, pagesText.join('\n'))
    })
  }, function (reason) {
    // PDF loading error
    cb(reason)
  })
}
/**
 * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
 *
 * @param {Integer} pageNum Specifies the number of the page
 * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
 **/
function getPageText (pageNum, PDFDocumentInstance) {
  console.log('clalled getPageText')
  // Return a Promise that is solved once the text of the page is retrieven
  return new Promise(function (resolve, reject) {
    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function (textContent) {
        let textItems = textContent.items
        console.log(textItems.length)
        let finalString = ''

        // Concatenate the string of the item to the final string
        for (var i = 0; i < textItems.length; i++) {
          let item = textItems[i]
          finalString += item.str + ' '
        }
        console.log(finalString)
        // Solve promise with the text retrieven from the page
        resolve(finalString)
      })
    },
    reject
    )
  })
}
