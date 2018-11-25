<template>
  <div>
    <q-toolbar color="primary">
      <q-toolbar-title>词频统计</q-toolbar-title>
      <q-btn label="添加" icon="note-add" to="/adddoc" />
      <q-btn label="合并" icon="call_merge" />
      <q-input placeholder="在文档名中搜索" value="searchText" />
      <q-btn label="导出" icon="launch" />
    </q-toolbar>
    <h3>词频统计</h3>
    {{ filteredDocs.length }}
  </div>
</template>

<script>
// import store from 'src/store'

export default {
//  store,
  data: () => ({
    searchText: ''
  }),
  computed: {
    filteredDocs () {
      let docs = this.$store.state.documents
      console.log(docs.length)
      return (this.searchText === '')
        ? docs
        : docs.filter((doc) => doc.name.indexOf(this.searchText) !== -1)
    }
  }
}
</script>
<style>
</style>
