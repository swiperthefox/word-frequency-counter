<template>
  <table v-if="documents.length" class="q-table">
    <tr>
      <th><label><q-checkbox v-model="selectAll" /></label></th>
      <th class="text-left">文档名</th><th>字符总数</th><th>单词数</th><th>单词数（去重）</th>
      <th>句子数</th><th>难度水平</th><th>年级</th>
    </tr>
    <tr v-for="document in documents" v-bind:key="getkey(document)">
        <td><label><q-checkbox v-model="selected" :val="document" /> </label></td>
        <td class="text-left"><a @click="openDocumentDetail(document)">{{ document.name }}</a></td>
        <td>{{ document.stats.char }}</td>
        <td>{{ document.stats.word }}</td>
        <td>{{ document.stats.wc.size }}</td>
        <td>{{ document.stats.sentence }}</td>
        <td>{{ document.stats.level }}</td>
        <td>{{ document.stats.grade }}</td>
    </tr>
  </table>
</template>

<script>

export default {
  name: 'doc-table',
  data: () => ({
    selectAll: false
  }),
  props: [
    'documents'
  ],
  methods: {
    openDocumentDetail: function (document) {
      this.$emit('showDocumentDetail', document)
    },
    getkey: function (doc) {
      let key = doc._id + (doc._version || '0')
      console.log('got key:', key)
      return key
    }
  },
  computed: {
    selected: {
      set (val) {
        this.$store.commit('updateSelected', val)
      },
      get () {
        return this.$store.state.selected
      }
    }
  },
  watch: {
    selectAll: function (newValue, oldValue) {
      if (newValue && this.selected.length === 0) {
        this.selected = this.documents.concat([])
      } else {
        this.selected.splice(0)
        this.selectAll = false
      }
    }
  }
}
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
}
tr:nth-child(even) {
  background-color: #f2f2f2
}
tr:hover {
  background: #bed0f5;
}
tr:first-child:hover {
  background: white;
}
td {
  text-align: center;
}
th>label, td>label {
  width: 100%;
  height: 100%;
  display: inline-block;
}
th:first-child, td:first-child {
  width:40px;
}
.q-table th {
  font-size: 95%;
  font-weight: bold;
}
</style>
