import Vue from 'vue'
import Vuex from 'vuex'
import DocDB from './db'
import textStats from 'src/lib/text-stats'
import path from 'path'
import Electron from 'electron'
import {compareDoc} from 'src/lib/document'

Vue.use(Vuex)

const config = {
  dbDir: Electron.remote.app.getPath('userData')
}

const db = new DocDB(path.join(config.dbDir, 'freq-counter.nedb'))

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const Store = new Vuex.Store({
  state: {
    documents: [],
    selected: []
  },
  getters: {
  },
  mutations: {
    addDocument (state, doc) {
      state.documents.push(doc)
      state.documents.sort(compareDoc)
    },
    deleteSelected (state) {
      let selected = state.selected.splice(0)
      selected.forEach(doc => {
        db.remove(doc._id, {},
          (err, item) => {
            if (err) {
              console.log(err)
            } else if (item > 0) {
              let idx = state.documents.indexOf(doc)
              if (idx !== -1) {
                state.documents.splice(idx, 1)
              }
              console.log('number of docs: ', state.documents.length)
            }
          }
        )
      })
    },
    replaceDocument (state, doc) {
      let docs = state.documents
      let i = 0
      while (i < docs.length && docs[i]._id !== doc._id) { i++ }
      docs.splice(i, 1, doc)
      docs.sort(compareDoc)
    },

    updateSelected (state, selected) {
      state.selected = selected
    }
  },
  actions: {
    addDocument (context, doc) {
      db.insert(doc, (err, doc) => {
        if (err) {
          console.log('Failed add doc: ', err)
        } else {
          augmentDoc(doc)
          context.commit('addDocument', doc)
        }
      })
    },
    fetchDocument (context) {
      db.load((err, docs) => {
        if (err) {
          console.log(err)
        } else {
          console.log(docs.length)
          docs.forEach((doc) => {
            augmentDoc(doc)
            context.commit('addDocument', doc)
          })
          docs.sort((a, b) => (a.createTime < b.createTime))
        }
      })
    },

    updateSelected (context, selected) {
      context.commit('updateSelected', selected)
    },

    deleteSelected (context) {
      context.commit('deleteSelected')
    },

    updateDocument (context, document) {
      db.update(document, (err, newDoc) => {
        if (err) {
          console.log(err)
        } else {
          augmentDoc(newDoc)
          context.commit('replaceDocument', newDoc)
        }
      })
    }
  }
})

export default Store

function augmentDoc (doc) {
  let content = doc.files.map(item => item.content).join('\n')
  doc.stats = textStats(content)
}
