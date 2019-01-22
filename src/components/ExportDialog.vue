<template>
  <q-modal  v-model="showFlag" id="export-dialog" maximized @hide="close">
    <q-field
      label="文档名称："
      :label-width="3">
      <label> {{ document.name }} </label>
    </q-field>

    <q-field label="导出选项：" :label-width="3"
      :error="!(showSum || showSub)"
      error-label="至少要选择一项">
      <div>
        <q-checkbox v-model ="showSum" :value="showSum" label="包含单词原形统计"/>
        <q-checkbox v-model ="showSub" :value="showSub" label="包含派生单词统计"/>
      </div>
    </q-field>

    <div class="row">
      <div class="col-3 q-field-label">输出预览：</div>
      <textarea v-model="csvString.string" readonly></textarea>
    </div>

    <div class="button-bar row">
      <label class="col-3 q-field-label">共计：</label>
      <label>共 {{ csvString.count }} 个单词</label>
    </div>

    <div class="row">
      <q-btn label="导出" @click="save" color="primary"></q-btn>
      <q-btn label="取消" @click="close"></q-btn>
    </div>
  </q-modal>
</template>

<script>
import { exportCSV, csvArrayToString } from 'src/lib/text-stats'
import { writeFileSync } from 'fs'

export default {
  name: 'ExportDialog',
  data: () => ({
    outfilname: '',
    showSum: true,
    showSub: true,
    showFlag: true
  }),
  props: ['document'],
  computed: {
    csvItems: function () {
      return exportCSV(this.document.stats.wc)
    },
    wordTotal: function () {
      return this.csvString.length
    },
    csvString: function () {
      return csvArrayToString(this.csvItems, this.showSub, this.showSum)
    }
  },

  methods: {
    save: function () {
      let name = selectCSVFile(this.document.name)
      if (name) {
        if (!name.endsWith('.csv')) {
          name = name + '.csv'
        }
        writeFileSync(name, this.csvString)
        this.close()
      }
    },
    close: function () {
      this.showFlag = false
      this.$emit('closeExportDialog')
    }

  }
}

function selectCSVFile (defaultName) {
  const { dialog, getCurrentWindow } = require('electron').remote
  return dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: defaultName,
    filters: [
      {name: 'CSV文件', extensions: ['csv']}
    ],
    title: '请选择导出文件',
    label: '保存'
  })
}

</script>

<style scoped>
#export-dialog .modal-container {
  width: 80%;
  font-size: 1.2rem;
}
.q-field {
  margin: 10px 0px;
}
.q-field-label {
  font-weight: bold;
}

textarea {
  flex-grow: 1
}
</style>
