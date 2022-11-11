export const beforeRouteLeave = {
    data() {
        this.dialog = 0;
        return {
            cacheList: []
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.dialog != 0) { 
            delete window.scanResult
            next(false)
        }
        if (this.cacheList.length <= 0) { 
            delete window.scanResult
            next()
        } else {
            setTimeout(() => {
                this.dialog = this.$dialog
                    .confirm({
                        title: '提示',
                        message: '您确定要退出当前功能吗?'
                    })
                    .then(() => { 
                        delete window.scanResult
                        next()
                    })
                    .catch(() => { 
                        delete window.scanResult
                        next(false)
                    })
            }, 200)
        }
    }
}