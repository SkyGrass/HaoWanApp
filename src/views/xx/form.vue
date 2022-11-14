<template>
  <div class="container">
    <div class="header van-hairline--bottom">
      <ul
        style="padding: 6px; font-size: 16px"
        class="van-hairline--bottom"
        v-for="source in [queryForm]"
        :key="source.MODID"
        :source="source"
      >
        <li style="padding: 2px">日期：{{ source.dDate }}</li>
        <li style="padding: 2px; width: 100%; display: inline-flex; justify-content: space-between">
          <div>生产订单：{{ source.cCode }}</div>
          <div>行号：{{ source.iVouchRowno }}</div>
        </li>
        <li style="padding: 2px">存货编码：{{ source.cInvCode }}</li>
        <li style="padding: 2px">存货名称：{{ source.cInvName }}</li>
        <li style="padding: 2px">规格型号：{{ source.cInvStd }}</li>
        <li style="padding: 2px; width: 100%; display: inline-flex; justify-content: space-between">
          <div>计量单位：{{ source.cComUnitName }}</div>
          <div>订单数量：{{ source.iQuantity }}</div>
        </li>
        <li style="padding: 2px; width: 100%; display: inline-flex; justify-content: space-between">
          <div>已下线数量：{{ source.iCommitQuantity }}</div>
          <div>未下线数量：{{ source.iQuantity2 }}</div>
        </li>
      </ul>
    </div>
    <div class="list0" id="list0">
      <div ref="postForm" class="postForm inputForm">
        <van-field
          clearable
          type="text"
          name="cBarcode"
          label="条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          placeholder="扫描或录入存货条码"
          id="ele_cBarcode"
          @keyup.enter="queryInv"
        >
          <template #button>
            <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" />
          </template>
        </van-field>

        <van-divider v-if="cacheList.length > 0">当前扫描{{ cacheList.length }}个</van-divider>
        <van-list class="cacheList" v-if="cacheList.length > 0">
          <van-cell is-link @click="onDelete(item)" :id="item.id" v-for="item in cacheList" v-bind:key="item.cBarcode">
            {{ item.cBarcode }}</van-cell
          >
        </van-list>
        <van-empty v-if="cacheList.length == 0" description="尚未扫描条码" />
      </div>
      <div class="btns" v-if="cacheList.length > 0">
        <van-button class="btn submit" size="small" @click="onSave">上传</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { saveSN } from '@/api/xx'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getInventory } from '@/api/base'
export default {
  name: `xx_form`,
  components: {},
  data() {
    return {
      queryForm: {},
      headForm: { FType: 1, FROB: 1 },
      sourceList: [],
      loading: false,
      finished: true,
      submitLoading: false,
      cSign: newGuid(),
      form: {
        id: '',
        cBarcode: '',
        FMOID: '',
        FMODID: ''
      },
      curEle: ''
    }
  },
  watch: {},
  methods: {
    onDelete(item) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要移除当前记录吗?'
        })
        .then(() => {
          const position = this.cacheList.findIndex(f => {
            return f.cBarcode == item.cBarcode
          })
          this.cacheList.splice(position, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    doClear() {
      this.clearForm(0)
    },
    onSubmit() {
      if (this.checkPlan()) {
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '数量超过源单!',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus(true)
          }
        })
      }
      const position = this.cacheList.findIndex(f => {
        return f.cBarcode == this.form.cBarcode
      })
      if (position > -1) {
        let r = this.cacheList[position]
        this.$set(this.cacheList, position, Object.assign({}, r))
      } else {
        this.cacheList.push(Object.assign({}, this.form))
      }
      const _id = this.form.id
      this.$nextTick(() => {
        const domTarget = document.querySelector('#' + _id)
        if (domTarget != void 0) {
          setTimeout(function () {
            domTarget.scrollIntoView(false)
          }, 300)
        }
      })

      this.clearForm(1)
    },
    onSave() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要提交记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const { accountId } = this.$store.getters
          const form = Object.assign({}, this.headForm, {
            cSign: this.cSign,
            cAcc_Id: accountId
          })
          saveSN(
            Object.assign({}, form, {
              Entry: this.cacheList.map(m => {
                return {
                  FMOID: m.FMOID,
                  FMODID: m.FMODID,
                  FSN: m.cBarcode
                }
              })
            })
          )
            .then(({ Data, Message }) => {
              this.$toast({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.cacheList = []
                  this.$router.go(-1) //回退1个
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    },
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    checkPlan() {
      return floatSub(this.cacheList.length, this.queryForm.iQuantity2) >= 0
    },
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
          if (window.android) {
            if (this.curEle != 'ele_iQuantity' || flag) {
              android.HideSoftKeyboard()
            }
          }
          setTimeout(() => {
            if (window.android) {
              if (this.curEle != 'ele_iQuantity' || flag) {
                android.HideSoftKeyboard()
              }
            }
          }, 50)
        }, 10)
      }
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }

      var exist = this.cacheList.filter(f => f.cBarcode == this.form.cBarcode)
      if (exist.length > 0) {
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '当前条码已扫描,请核实!',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus(true)
          }
        })
      }

      getInventory(Object.assign({}, { FSN: this.form.cBarcode }, this.headForm))
        .then(({ Data }) => {
          this.form.id = 'id_' + this.form.cBarcode
          this.form.FMOID = this.queryForm.ID
          this.form.FMODID = this.queryForm.MODID
          this.onSubmit()
        })
        .catch(err => {
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
    }, 
    clearForm(flag) {
      for (const key in this.form) {
        if (flag == 0) {
          //手动清除
          if (this.$store.getters.numProps.includes(key)) {
            this.form[key] = 0
          } else {
            this.form[key] = ''
          }
        } else if (flag == 1) {
          if (key == 'cBarcode') {
            //只清空 cBarcode
            if (this.$store.getters.numProps.includes(key)) {
              this.form[key] = 0
            } else {
              this.form[key] = ''
            }
          }
        }
      }

      this.curEle = 'ele_cBarcode'

      this.setFocus()
    },
    onFocus(e) {
      var dom = document.activeElement.id
      if (dom != '') {
        this.curEle = dom
        const domTarget = document.querySelector('#' + dom)
        if (domTarget != void 0) {
          setTimeout(function () {
            domTarget.scrollIntoView(false)
          }, 300)
        }
      }
    }
  },
  computed: {},
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  mounted() {
    window.scanResult = result => {
      setTimeout(() => {
        if (this.curEle == 'ele_cBarcode') {
          this.form.cBarcode = result
          this.queryInv()
        } else if (this.curEle == 'ele_cPosName') {
          this.form.cPosName = result
          this.queryPos()
        }
      }, 600)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  .list0 {
    .cacheList {
      height: calc(100vh - 360px);
      overflow: scroll;
    }
  }

  .list0 .btns {
    display: flex;
    margin-top: 3px;
    margin-bottom: 20px;
    justify-content: space-around;

    .btn {
      width: 45%;
      border-radius: 3px;
    }
    .submit {
      color: #fff;
      background-color: rgb(0, 133, 119);
    }
  }

  .postForm {
    .van-cell {
      padding: 8px 10px;

      ::v-deep .van-cell__title {
        font-size: 15px;
        color: #333;
        width: 70px;
      }
    }
  }

  .table-d table {
    font-size: 16px;
    background: #333;
  }
  .table-d table td {
    background: #fff;
  }
}
</style>
