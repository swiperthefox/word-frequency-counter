import Vue from 'vue'
import Vuex from 'vuex'
import DocDB from './db'
import textStats from 'src/lib/text-stats'
Vue.use(Vuex)

const db = new DocDB()

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const Store = new Vuex.Store({
  state: {
    documents: []
  },
  getters: {
  },
  mutations: {
    addDocument (state, doc) {
      state.documents.push(doc)
    }
  },
  actions: {
    addDocument (context, doc) {
      if (!doc.name || !doc.content) {
        console.log('Discarded incomplete document, missing name or content.')
        return
      }
      db.insert(doc, (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          context.commit('addDocument', docs[0])
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
            if (!doc.content) {
              db.remove(doc, {}, () => {})
            } else {
              doc.stats = textStats(doc.content)
              context.commit('addDocument', doc)
            }
          })
        }
      })
    }
  }
})

export default Store
