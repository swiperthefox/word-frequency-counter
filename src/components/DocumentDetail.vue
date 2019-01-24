<template>
  <q-modal id="doc-detail"  maximized v-model="showFlag" @hide="close">
      <q-field
        label="文档名称："
        :label-width="2"
        :error="nameWarning.length > 0"
        :error-label="nameWarning">
        <q-input v-model.trim="name" autofocus />
      </q-field>

      <q-field
        label="包含文件："
        :label-width="2"
        :warning="fileWarning[0] === 'warning'"
        :warning-label="fileWarning[1]"
        :error="fileWarning[0] === 'negative'"
        :error-label="fileWarning[1]">
        <div id="dd-file-list" v-for="fileEntry in document.files" :key="fileEntry.md5Hash">
          <q-checkbox v-model ="selected" :val="fileEntry"
          /> <span :class="{'cross-out': selected.indexOf(fileEntry) === -1}"
          @click="currentFileEntry = fileEntry">{{ fileEntry.name }}</span>
        </div>
      </q-field>

      <div class="row q-field">
        <div class="col-2">
          <label class="q-field-label">文件内容：</label>
          <div class="text-small"><q-icon class="text-primary" name="info"/>点击文件名称，可以查看、编辑文件内容。</div>
        </div>

        <textarea v-model="content"></textarea>
      </div>

      <div class="row button-bar">
        <q-btn label="保存" @click="save" color="primary" :disabled="disableOKButton" :title="fileWarning[1]"></q-btn>
        <q-btn label="取消" @click="close"></q-btn>
      </div>
  </q-modal>
</template>

<script>

export default {
  name: 'DocumentDetail',
  data: () => ({
    selected: [],
    currentFileEntry: null,
    showFlag: true
  }),
  props: ['document'],
  methods: {
    save: function () {
      this.document.files = this.selected
      this.$emit('confirmDocDetailDialog', this.document)
    },

    close: function () {
      this.$emit('closeDocDetailDialog')
    }
  },
  computed: {
    content: {
      get () {
        return this.currentFileEntry ? this.currentFileEntry.content : ''
      },
      set (text) {
        if (this.currentFileEntry) {
          this.currentFileEntry.content = text
          this.currentFileEntry._lastmt = Date.now()
        }
      }
    },
    name: {
      get () {
        return this.document.name
      },
      set (newName) {
        this.document.name = newName
      }
    },
    nameWarning: function () {
      if (this.document.name === '') {
        return '文档名不能为空。'
      } else {
        return ''
      }
    },
    fileWarning: function () {
      let removed = this.document.files.length - this.selected.length

      if (this.selected.length === 0) {
        return ['negative', '已去掉所有文件。如要删除该文档，请在文档列表中删除。']
      } else if (removed > 0) {
        return ['warning', '保存时以上被划掉的文件会被排除在外！']
      } else {
        return ['', '保持修改']
      }
    },
    disableOKButton: function () {
      return this.selected.length === 0 || this.name.length === 0
    }
  },
  watch: {
    document: {
      immediate: true,
      handler: function (newDoc, oldDoc) {
        this.selected = this.document.files.slice(0)
        if (newDoc.files.length === 1) {
          this.currentFileEntry = newDoc.files[0]
        } else {
          this.currentFileEntry = null
        }
      }
    }
  },
  components: {
  }
}
</script>

<style scoped>
li {
  list-style: none;
}
.cross-out {
  text-decoration: line-through;
}
textarea {
  min-height: 500px !important;
  flex-grow: 1;
  margin-right: 10px;
}

#doc-detail .modal-container {
  width: 90%;
}
.text-small {
  font-size: 80%;
  margin: 10px 40px 0px 10px;
}
#dd-file-list span {
  margin-left: 10px;
  overflow: auto;
}
.q-field {
  margin: 10px 10px;
}

.button-bar {
  margin: 20px 0px;
}
.q-btn {
  margin: 2px 15px;
}
</style>
