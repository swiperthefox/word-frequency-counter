<template>
  <q-modal id="doc-detail"  maximized v-model="showFlag" @hide="close">
      <q-field
      label="文档名称："
      :label-width="2"
      :error="nameWarning.length > 0"
      :error-label="nameWarning"
      >
      <q-input v-model="name" autofocus />
      </q-field>

      <q-field
      label="包含文件："
      :label-width="2"
      :warning="fileWarning[0] === 'warning'"
      :warning-label="fileWarning[1]"
      :error="fileWarning[0] === 'negative'"
      :error-label="fileWarning[1]"
      >
        <div id="dd-file-list" v-for="fileEntry in document.files" :key="fileEntry.md5Hash">
          <q-checkbox v-model ="selected" :val="fileEntry"
          /> <span :class="{'cross-out': selected.indexOf(fileEntry) === -1}"
          @click="current = fileEntry">{{ fileEntry.name }}</span>
        </div>
      </q-field>

      <div class="row">
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
    current: null,
    showFlag: true
  }),
  props: ['document', 'show'],
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
    totalFiles: function () {
      return this.document.files.length
    },
    content: {
      get () {
        return this.current ? this.current.content : ''
      },
      set (text) {
        if (this.current) {
          this.current.content = text
          this.current._lastmt = Date.now()
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
          this.current = newDoc.files[0]
        } else {
          this.current = null
        }
      }
    }
  },
  components: {
  }
}
</script>

<style>
li {
  list-style: none;
}
.cross-out {
  text-decoration: line-through;
}
textarea {
  height: 500px !important;
  flex-grow: 1;
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
.q-field-label {
  margin-left: 10px !important;
}
.button-bar {
  margin: 20px 0px;
}
.q-btn {
  margin: 2px 15px;
}
</style>
