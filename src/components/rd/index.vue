<template>
  <van-popup v-model="show" position="center" :style="{ height: '50%', width: '100%' }">
    <van-picker
      show-toolbar
      :title="title"
      :columns="columns"
      :default-index="defaulIndex"
      @cancel="cancel"
      @confirm="select"
    />
  </van-popup>
</template>
<script>
export default {
  name: `rd`,
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
      show: false,
      flag: 1
    }
  },
  computed: {
    columns() {
      return this.$props.source.map(m => {
        return `${m.cRdCode}||${m.cRdName}`
      })
    },
    title() {
      if (this.flag == '1') {
        return '选择入库方式'
      } else if (this.flag == '0') {
        return '选择出库方式'
      }
    }
  },
  watch: {
    show(newV, oldV) {
      if (!newV) {
        this.$emit('cancel')
      }
    }
  },
  methods: {
    open(_flag) {
      if (_flag != void 0) {
        this.flag = _flag
      }
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
      this.$emit('choose', this.$props.source[index])
      this.show = false
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
