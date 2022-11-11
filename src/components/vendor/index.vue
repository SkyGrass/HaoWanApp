<template>
  <van-popup v-model="show" position="top" :style="{ top: '54px', height: '55%', width: '100%' }">
    <van-field
      type="text"
      label="过滤"
      v-model="keyword"
      autocomplete="off"
      placeholder="输入编码或名称进行过滤"
      @keyup.enter="query"
    ></van-field>
    <van-picker
      show-toolbar
      title="选择供应商"
      :columns="columns"
      :default-index="defaulIndex"
      @cancel="cancel"
      @confirm="select"
    />
  </van-popup>
</template>
<script>
export default {
  name: `vendor`,
  props: {
    source: {
      type: Array,
      default() {
        return []
      }
    },
    defaulIndex: Number
  },
  data() {
    return {
      keyword: '',
      data: [],
      originData: [],
      show: false
    }
  },
  watch: {
    show(newV, oldV) {
      if (!newV) {
        this.$emit('cancel')
      }
    },
    source(newV, oldV) {
      this.data = newV
      this.originData = newV
    }
  },
  computed: {
    columns() {
      return this.data.map(m => {
        return `${m.cVenCode}||${m.cVenName}`
      })
    }
  },
  methods: {
    open() {
      this.show = true
    },
    dismiss() {
      this.show = false
    },
    cancel() {
      this.$emit('cancel')
      this.show = false
    },
    select(value, index) {
      this.$emit('choose', this.data[index])
      this.show = false
    },
    query() {
      this.data = this.originData.filter(f => {
        return f.cVenCode.indexOf(this.keyword) > -1 || f.cVenName.indexOf(this.keyword) > -1
      })
      if (window.android) {
        android.HideSoftKeyboard()
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
