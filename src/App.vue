<template>
  <div id="app">
    <div class="app-container" style="padding-bottom: 50px">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>

      <redblue ref="redblue" />
    </div>
  </div>
</template>
<script>
import redblue from '@/components/redblue'
export default {
  name: 'App',
  components: { redblue },
  data() {
    return {
      duration: { enter: 300, leave: 1000 },
      transitionName: 'van-slide-right',
      isForbidden: true
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  watch: {},
  methods: {},
  created() {
    let { query, path } = this.$route
    if (path != '/home' || Object.keys(query).length <= 0) {
      query = MyLStorage.get('model')
    }
    this.$store.dispatch('setModel', query)

    this.isForbidden = Object.keys(query).length <= 0
  },
  mounted() { }
}
</script>
<style lang="scss">
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
