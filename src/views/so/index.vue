<template lang="">
  <div class="container">
    <van-form @submit="onSubmit" label-width="50px">
      <div class="top">
        <van-field
          clearable
          v-model="keyword"
          name="keyword"
          label="条件"
          ref="keyword"
          placeholder="扫描或输入关键词回车查询"
          @keyup.enter="onSubmit"
        />
      </div>
      <div class="bottom">
        <van-row>
          <van-col span="12">
            <van-field
              label="开始"
              name="dBeginDate"
              is-link
              placeholder="开始时间"
              :value="startDateStr"
              input-align="right"
              @click="show1 = true"
              readonly
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="结束"
              name="dEndDate"
              is-link
              placeholder="结束时间"
              :value="endDateStr"
              input-align="right"
              @click="show2 = true"
              readonly
            />
          </van-col>
        </van-row>
        <div class="list">
          <van-empty class="custom-image" description="没有记录" v-if="sourceList.length <= 0" />
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              v-for="(source, index) in sourceList"
              :key="source.ID"
              :source="source"
              @click="onChoose(source)"
            >
              <li style="padding: 2px">日期：{{ source.dDate }}</li>
              <li style="padding: 2px">单号：{{ source.cCode }}</li>
              <li style="padding: 2px">客户：{{ source.cCusCode }}||{{ source.cCusName }}</li>
            </ul>
          </van-list>
          <van-button class="reload">
            <van-image
              width="32"
              height="32"
              fit="scale-down"
              class="img"
              :src="require('../../../static/icon_refresh.png')"
            />
          </van-button>
        </div>
      </div>
    </van-form>
    <!-- <van-calendar v-model="show1" /> -->
    <!-- <van-calendar v-model="show2" @confirm="onConfirm2" /> -->
    <van-popup v-model="show1" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="form.dBeginDate"
        type="date"
        title="选择年月日"
        @confirm="onConfirm1"
        @cancel="show1 = false"
      />
    </van-popup>
    <van-popup v-model="show2" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="form.dEndDate"
        type="date"
        title="选择年月日"
        @confirm="onConfirm2"
        @cancel="show2 = false"
      />
    </van-popup>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { getDispatchHead } from '@/api/so'
export default {
  name: `so`,
  data() {
    return {
      keyword: '',
      form: { dBeginDate: '', dEndDate: '' },
      maxDate: new Date(),
      show1: false,
      show2: false,
      sourceList: [],
      loading: false,
      finished: false,
      readonly: false,
      rob: 0
    }
  },
  computed: {
    startDateStr() {
      if (this.form.dBeginDate == '' || this.form.dBeginDate == null) return ''
      return this.formatDate(this.form.dBeginDate)
    },
    endDateStr() {
      if (this.form.dEndDate == '' || this.form.dEndDate == null) return ''
      return this.formatDate(this.form.dEndDate)
    }
  },
  watch: {
    show1(newV, oldV) {
      if (newV) {
        if (this.form.dBeginDate == '' || this.form.dBeginDate == null) {
          this.form.dBeginDate = new dayjs().toDate()
        }
      }
    },
    show2(newV, oldV) {
      if (newV) {
        if (this.form.dEndDate == '' || this.form.dEndDate == null) {
          this.form.dEndDate = new dayjs().toDate()
        }
      }
    }
  },
  methods: {
    onLoad() {
      this.sourceList = []
      getDispatchHead(
        Object.assign(
          {},
          { dBeginDate: this.startDateStr, dEndDate: this.endDateStr, FRob: this.rob },
          {
            cFilter: this.keyword
          }
        )
      )
        .then(({ Data }) => {
          this.sourceList = Data
        })
        .catch(err => {})
      this.loading = false
      this.finished = true
    },
    onSubmit() {
      this.onLoad()
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    onConfirm1(date) {
      this.show1 = false
      this.onLoad()
    },
    onConfirm2(date) {
      this.show2 = false
      this.onLoad()
    },
    onChoose(row) {
      this.$router.push({
        name: 'so_form',
        query: Object.assign({}, row, {
          bRob: this.rob,
          redblue: this.rob
        })
      })
    }
  },
  created() {
    this.rob = this.$route.query.redblue
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.keyword != void 0) {
        this.$refs.keyword.focus()
        if (window.android) {
          android.HideSoftKeyboard()
        }
        setTimeout(() => {
          if (window.android) {
            android.HideSoftKeyboard()
          }
        }, 100)
      }
    })
  },
  activated() {
    const scrollTop = this.$route.meta.scrollTop
    const $content = document.querySelector('.list')
    if (scrollTop && $content) {
      $content.scrollTop = scrollTop
    }
  }
}
</script>
<style lang="scss">
.container {
  height: 100vh;
  .bottom {
    .list {
      height: calc(100vh - 90px);
      overflow: scroll;
      .reload {
        bottom: 55px;
        overflow: hidden;
        position: fixed;
        right: 50px;
        width: 54px;
        height: 54px;
        border-radius: 54px;
        z-index: 999;
        background-color: #008577;
        display: flex;
        justify-content: center;
        align-items: center;
        .img {
          display: block;
          float: right;
          outline: 0 none;
          text-indent: -9999em;
        }
      }
    }
  }
}
</style>
