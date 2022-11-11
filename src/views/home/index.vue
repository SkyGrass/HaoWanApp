<template>
  <div style="padding: 5px">
    <van-grid :gutter="10" clickable :column-num="3">
      <van-grid-item class="grid" v-for="menu in menus" :key="menu.id" @click="redirect(menu)">
        <van-image width="64" height="64" fit="cover" :src="menu.icon" />
        <span>{{ menu.label }}</span>
      </van-grid-item>
    </van-grid>
    <van-empty description="没有配置菜单" v-if="list.length <= 0" />
    <div class="footer">
      <van-row>
        <van-col class="item" span="12">
          <div>登录人：{{ model.loginName }}</div>
        </van-col>
        <van-col class="item" span="12">
          <div>账套时间：{{ model.accountDate }}</div>
        </van-col>
      </van-row>
      <van-row>
        <van-col class="item">
          <div>当前账套：{{ model.accountName }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { getMenu } from '@/api/home'

import redblue from '@/components/redblue'
export default {
  name: `home`,
  components: { redblue },
  data() {
    return {
      list: [],
      origin: []
    }
  },
  computed: {
    model() {
      return this.$store.getters.model
    },
    menus() {
      return this.list.map(m => {
        m.icon = require('../../../static/' + m.icon)
        return m
      })
    }
  },
  methods: {
    redirect({ id, path, whCode }) {
      this.$store.dispatch('setDefWhCode', whCode)
      const children = this.origin.filter(f => f.FParentID == id)
      if (children.length > 0) {
        //展示子集
        this.$router.push({
          path: 'subhome',
          query: {
            from: id
          }
        })
      } else {
        this.$router.push({
          path: path,
          query: {
            t: new Date() * 1,
            from: id,
            whCode: whCode
          }
        })
      }
    }
  },
  mounted() {
    getMenu({}).then(({ Data }) => {
      this.origin = Data
      this.list = Data.filter(f => f.FParentID == 0).map(m => {
        return {
          id: m.FItemID,
          icon: m.FImage || 'icon_list.png',
          label: m.FName,
          path: m.FUrl,
          whCode: m.FDefaultWhCode
        }
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.grid {
  ::v-deep .van-grid-item__content {
    padding: 3px;
    background-color: inherit;
  }

  ::v-deep .van-grid-item__content:after {
    border: none;
  }

  ::v-deep span {
    font-size: 14px;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  width: calc(100vw - 15px);
  padding: 5px;
  font-size: 15px;

  .item {
    padding: 3px;
  }
}
</style>
