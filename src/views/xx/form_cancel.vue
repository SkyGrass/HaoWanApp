<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
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
            <van-field
              name="FMOCode"
              label="生产订单"
              ref="ele_FMOCode"
              v-model="form.FMOCode"
              readonly
              placeholder="生产订单"
            ></van-field>
            <van-field
              name="FMORowNo"
              label="订单行号"
              ref="ele_FMORowNo"
              v-model="form.FMORowNo"
              readonly
              placeholder="订单行号"
            ></van-field>
            <van-field
              name="cInvCode"
              label="存货编码"
              ref="ele_cInvCode"
              v-model="form.cInvCode"
              readonly
              placeholder="存货编码"
            ></van-field>
            <van-field
              name="cInvName"
              label="存货名称"
              ref="ele_cInvName"
              v-model="form.cInvName"
              readonly
              placeholder="存货名称"
            ></van-field>
            <van-field
              name="cInvStd"
              label="规格型号"
              ref="ele_cInvStd"
              v-model="form.cInvStd"
              readonly
              placeholder="规格型号"
            >
            </van-field>
            <van-field
              name="cComUnitName"
              label="单位"
              ref="ele_cComUnitName"
              v-model="form.cComUnitName"
              readonly
              placeholder="计量单位"
            ></van-field>
          </div>
          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <!-- <van-button class="btn submit" size="small" @click="inputQuantity">保存</van-button> -->
          </div>
        </div>
      </van-tab>
      <van-tab title="列表页">
        <div class="list1">
          <van-empty class="custom-image" description="没有记录" v-if="cacheList.length <= 0" />
          <van-list>
            <ul
              v-for="(item, index) in cacheList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onDelete(index)"
            >
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>生产订单：{{ item.FMOCode }}</div>
                <div>行号：{{ item.FMORowNo }}</div>
              </li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px">计量单位：{{ item.cComUnitName }}</li>
              <li style="padding: 2px">条码：{{ item.cBarcode }}</li>
            </ul>
            <van-submit-bar
              style="background-color: #e6e6e6"
              button-color="#008577"
              :disabled="cacheList.length <= 0"
              button-text="提交"
              @submit="onSave"
              :loading="submitLoading"
            />
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { saveSN } from '@/api/xx'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getInventory } from '@/api/base'
import dayjs from 'dayjs'
export default {
  name: `xx_form_cancel`,
  components: {},
  data() {
    return {
      active: 0,
      queryForm: {},
      headForm: { FType: 1, FROB: -1 },
      sourceList: [],
      loading: false,
      finished: false,
      submitLoading: false,
      sources: {},
      control: {},
      cSign: newGuid(),
      form: {
        cBarcode: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitCode: '',
        cComUnitName: '',
        FMOCode: '',
        FMODID: '',
        FMOID: '',
        FMORowNo: ''
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.setFocus()
      }
    }
  },
  methods: {
    onDelete(index) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要移除当前记录吗?'
        })
        .then(() => {
          this.cacheList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    doClear() {
      this.clearForm()
    },
    onSubmit() {
      var exist = this.cacheList.filter(f => f.barcode == this.form.cBarcode)
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
      const position = this.cacheList.findIndex(f => {
        return f.cBarcode == this.form.cBarcode
      })
      if (position > -1) {
        let r = this.cacheList[position]
        this.$set(this.cacheList, position, Object.assign({}, r))
      } else {
        this.cacheList.push(Object.assign({}, this.form))
      }

      this.clearForm()
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
          if (Data.length > 0) {
            const { FMOCode, FMOID, FMODID, FMORowNo, FInvCode, FInvName, FInvStd, FComUnitCode, FComUnitName } =
              Data[0]
            this.form.FMOCode = FMOCode
            this.form.FMOID = FMOID
            this.form.FMODID = FMODID
            this.form.FMORowNo = FMORowNo

            this.form.cInvCode = FInvCode
            this.form.cInvName = FInvName
            this.form.cInvStd = FInvStd
            this.form.cComUnitCode = FComUnitCode
            this.form.cComUnitName = FComUnitName

            this.onSubmit()
          } else {
            this.curEle = 'ele_cBarcode'
            return this.$toast({
              type: 'fail',
              message: '未能查询到条码信息!',
              onOpened: () => {
                this.form.cBarcode = ''
                this.setFocus(true)
              }
            })
          }
        })
        .catch(err => {
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    inputQuantity() {
      if (this.form.iQuantity == '') {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '请先录入数量',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      if (this.form.iVouchRowno == '') {
        this.form.iQuantity = ''
        if (this.form.cPosCode == '') {
          this.curEle = 'ele_cPosName'
        } else if (this.form.cBarcode == '') {
          this.curEle = 'ele_cBarcode'
        }
        return this.$toast({
          type: 'fail',
          message: '请按流程进行扫描!',
          onOpened: () => {
            this.setFocus()
          }
        })
      }

      this.onSubmit()
    },
    clearForm(flag) {
      for (const key in this.form) {
        if (key == 'cBarcode') {
          if (this.$store.getters.numProps.includes(key)) {
            this.form[key] = 0
          } else {
            this.form[key] = ''
          }
        }
      }
      this.control.useBatch = false
      this.control.useQuality = false
      this.control.groupType = 1
      if (this.control.usePos) {
        this.curEle = flag ? 'ele_cBarcode' : 'ele_cPosName'
      } else {
        this.curEle = 'ele_cBarcode'
      }
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

  .list0,
  .list {
    height: calc(100vh - 210px);
    overflow: scroll;
  }

  .sourceList {
    height: calc(100vh - 180px);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh - 260px);
    overflow: scroll;
  }

  .form {
    width: 94vw;
  }

  .header {
    .item {
      padding: 8px 10px;
    }
  }
}
</style>
