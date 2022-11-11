export const title = {
  created() {
    if (this.$route != void 0) { 
      const { title, redblue } = this.$route.meta
      let flag = '' 
      if (redblue != void 0 && redblue) {
        flag = this.$route.query.redblue == '1' ? '(蓝字)' : '(红字)'
      }
      if (this.$route.query.bRob != void 0) {
        flag = this.$route.query.bRob == '1' ? '(蓝字)' : '(红字)'
      } 
      window.document.title = title == undefined ? '' : title + flag
    }
  }
}
