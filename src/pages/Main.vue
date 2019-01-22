<template>
  <q-layout>
    <q-toolbar color="primary">
      <q-btn label="添加"  @click="newDocument"
        icon="note-add" size="lg" />
      <q-btn label="删除" @click="deleteDocument"
        icon="clear" :disable="numberOfSelected === 0" size="lg" :title="deleteBtnHint"/>
      <q-btn label="合并" @click="mergeDocument"
        icon="call_merge" :disable="numberOfSelected <= 1" size="lg" :title="mergeHint" />
      <q-btn label="导出" @click="exportDocument"
        icon="launch" :disable="numberOfSelected !== 1" size="lg" :title="exportHint" />
      <q-search  v-model="searchText" lower-case clearable
        :placeholder="searchPlaceholder" inverted />
      <q-btn-dropdown  flat :label="searchTypeLabel" size="lg">
        <!-- dropdown content -->
          <q-list link>
            <q-item v-close-overlay @click.native="setSearchType('doc')">
              <label label >搜索文档名</label>
            </q-item>
            <q-item v-close-overlay @click.native="setSearchType('word')">
                <label label >搜索完整单词</label>
            </q-item>
          </q-list>
      </q-btn-dropdown>
    </q-toolbar>
    <h4>词频统计</h4>
    <document-table v-if="filteredDocs.length > 0"
      :documents="filteredDocs"
      @showDocumentDetail="showDocumentDetail"
    />
    <div v-else class="no-doc-info">
      <q-icon name="info" color="primary" size="lg"/>没有符合条件的文档。添加新的文档或者修改查询条件。
    </div>
    <document-detail v-if="showDetailFlag"
      :document="showDetailDoc"
      v-on:closeDocDetailDialog="closeDocDetailDialog"
      v-on:confirmDocDetailDialog="saveDocDetail"
    />
    <export-dialog v-if="showExportDialog"
      :document="exportedDoc"
      v-on:closeExportDialog="closeExportDialog"
    />
  </q-layout>
</template>

<script>
import DocumentTable from 'src/components/DocumentTable'
import { mergeDocument, createDocuments, cloneDocument } from 'src/lib/document'
import store from 'src/store'
import DocumentDetail from 'src/components/DocumentDetail'
import ExportDialog from 'src/components/ExportDialog'

export default {
  store,
  data: () => ({
    searchText: '',
    searchType: 'doc',
    showDetailDoc: null,
    showDetailFlag: false,
    exportedDoc: null,
    showExportDialog: false
  }),
  computed: {
    filteredDocs () {
      let docs = this.$store.state.documents
      console.log(docs.length)
      return (this.searchText === '')
        ? docs
        : docs.filter((doc) => this.match(doc, this.searchText, this.searchType))
    },
    numberOfSelected: function () {
      return this.$store.state.selected.length
    },
    exportHint: function () {
      if (this.numberOfSelected === 0) {
        return '没有选择要导出的文档'
      } else if (this.numberOfSelected > 1) {
        return '一次只能导出一个文档'
      } else {
        return '导出所选文档的统计结果'
      }
    },
    deleteBtnHint: function () {
      if (this.numberOfSelected === 0) {
        return '请选择要删除的文档'
      } else {
        return '删除所选文档'
      }
    },
    mergeHint: function () {
      if (this.numberOfSelected < 2) {
        return '至少选择两个要合并的文档'
      } else {
        return '合并选择的文档'
      }
    },

    searchTypeLabel: function () {
      return (this.searchType === 'doc') ? '搜索文档名' : '搜索完整单词'
    },

    searchPlaceholder: function () {
      return this.searchType === 'doc' ? '文档名' : '完整单词'
    }
  },
  components: {
    DocumentTable,
    ExportDialog,
    DocumentDetail
  },
  methods: {
    // new
    newDocument () {
      let files = selectTextFiles()
      let cb = (err, doc) => {
        if (err) {
          this.$q.notify({
            message: '读取文件“' + err + '”失败。请先把文件内容存入本程序支持的文件类型（.txt/.doc/.pdf），然后再添加。',
            timeout: 0,
            closeBtn: 'X',
            type: 'info'
          })
        } else {
          this.$store.dispatch('addDocument', doc)
        }
      }
      if (files) {
        createDocuments(files, cb)
      }
    },

    // edit document
    showDocumentDetail (document) {
      this.showDetailDoc = cloneDocument(document)
      this.showDetailFlag = true
    },

    closeDocDetailDialog () {
      this.showDetailFlag = false
      this.showDetailDoc = null
    },

    saveDocDetail (document) {
      this.$store.dispatch('updateDocument', document)
      this.closeDocDetailDialog()
    },

    // merge
    mergeDocument (newDocName) {
      let newDoc = mergeDocument('', this.$store.state.selected)
      this.showDocumentDetail(newDoc)
    },

    deleteDocument () {
      let docNames = this.$store.state.selected.map(item => item.name).join('\n')
      this.$q.dialog({
        title: '确认删除文档',
        message: ['将要删除以下所列的文档：\n', docNames].join('\n'),
        ok: '删除',
        cancel: '不要删除'
      }).then(() => {
        this.$store.dispatch('deleteSelected')
      })
    },

    // export to csv
    exportDocument () {
      this.exportedDoc = this.$store.state.selected[0]
      this.showExportDialog = true
    },

    closeExportDialog () {
      this.showExportDialog = false
      this.exportedDoc = null
    },

    // search
    setSearchType (t) {
      this.searchType = t
    },

    match (doc, searchText, searchType) {
      if (searchType === 'doc') {
        return doc.name.indexOf(searchText) !== -1
      } else {
        return doc.stats.wc.has(searchText)
      }
    }
  }
}

function selectTextFiles () {
  const { dialog, getCurrentWindow } = require('electron').remote
  return dialog.showOpenDialog(getCurrentWindow(), {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {name: '文本', extensions: ['pdf', 'doc', 'docx', 'txt']},
      {name: 'All Files', extensions: ['*']}
    ],
    title: '选择文档（可选择多个文件）',
    label: '确定'
  })
}
</script>
<style>
h4 {
  text-align: center;
}
.modal-message {
  white-space: pre-line;
}
.no-doc-info {
  font-size: 120%;
  width: 80%;
  margin: auto;
}
</style>
