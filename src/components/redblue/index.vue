<template lang="">
  <div>
    <van-popup v-model="show" close-on-popstate :close-on-click-overlay="false" class="form" safe-area-inset-bottom>
      <van-form>
        <h3 style="text-align: center">类型选择</h3>
        <van-field name="redblue" label="红蓝字">
          <template #input>
            <van-radio-group v-model="form.redblue" direction="horizontal">
              <van-radio name="1" checked-color="#008577">蓝字</van-radio>
              <van-radio name="-1" checked-color="#008577">红字</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div style="margin: 5px; text-align: right">
          <van-button style="margin-right: 20px" @click="doCancel">取消</van-button>
          <van-button color="#008577" type="info" @click="onSubmit">确定</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: `redblue`,
  data() {
    return {
      form: { redblue: '1' },
      target: '',
      show: false
    }
  },
  computed: {
    show1() {
      return this.$store.getters.showRb
    }
  },
  methods: {
    open(path) {
      this.target = path
      this.show = true
    },
    doCancel() {
      this.$store.dispatch('setShowRedBlue', false)
    },
    onSubmit() {
      this.$store.dispatch('setShowRedBlue', false)

      this.$router.push({
        name: this.$store.getters.targetUrl,
        query: this.form
      })
    }
  },
  watch: {
    show1(newV, oldV) {
      this.show = newV
      if (newV) {
        this.form.redblue = '1'
      }
    }
  },
  mounted() {
    this.form.redblue = '1'
  }
}
</script>
<style lang="scss" scoped>
.form {
  width: 94vw;
}
</style>
