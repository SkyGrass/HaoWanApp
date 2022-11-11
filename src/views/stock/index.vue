<template>
  <div class="container">
    <div class="list0" id="list0">
      <div class="postForm" ref="postForm">
        <van-field
          v-model="curQueryType"
          readonly
          label="查询类型"
          placeholder="请选择查询类型"
          is-link
          @click="openSource"
        />
        <van-field
          class="item"
          type="text"
          name="cBarcode"
          label="条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          placeholder="扫描或录入条码"
          id="ele_cBarcode"
          clearable
          @focus="onFocus('ele_cBarcode')"
          @keyup.enter="queryInv"
        >
          <template #button>
            <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" />
          </template>
        </van-field>
      </div>
      <van-divider v-if="curQueryTypeId == 1 && list.length > 0">货位：{{ form.cPosName }}</van-divider>
      <van-divider v-if="curQueryTypeId == 2 && list.length > 0">批号：{{ form.cBatch }}</van-divider>
      <van-empty class="custom-image" description="没有记录" v-if="list.length <= 0" />

      <ul
        v-if="curQueryTypeId == 3 && form.cInvCode != ''"
        style="padding: 5px; font-size: 14px"
        class="van-hairline--bottom"
      >
        <li style="padding: 2px">存货编码：{{ form.cInvCode }}</li>
        <li style="padding: 2px">存货名称：{{ form.cInvName }}</li>
        <li style="padding: 2px">规格型号：{{ form.cInvStd }}</li>
        <li style="padding: 2px">计量单位：{{ form.cComUnitName }}</li>
      </ul>

      <van-list>
        <ul
          v-for="(item, index) in list"
          :key="index"
          style="padding: 5px; font-size: 14px"
          class="van-hairline--bottom"
        >
          <li
            v-if="curQueryTypeId == 2 || curQueryTypeId == 3"
            style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between"
          >
            <div style="font-weight: bold">仓库：{{ item.cWhName }}</div>
            <div style="font-weight: bold">仓位：{{ item.cPosName }}</div>
          </li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">存货名称：{{ item.cInvName }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">计量单位：{{ item.cComUnitName }}</li>

          <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
            <div v-if="curQueryTypeId != 2">批号：{{ item.cBatch }}</div>
            <div>数量：{{ item.iQuantity }}</div>
          </li>
        </ul>
      </van-list>
    </div>
    <sourcerow ref="sourcerow" :source="sourceList" @choose="pickSource" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { getCurrentStock } from '@/api/query'
import sourcerow from '@/components/sourcerow'
export default {
  name: `stock`,
  components: { sourcerow },
  data() {
    return {
      sourceList: [
        { label: '货位', value: '1' },
        { label: '批号', value: '2' },
        { label: '存货', value: '3' }
      ],
      curQueryType: '货位',
      curQueryTypeId: '1',
      form: {
        cBarcode: '',

        cPosCode: '',
        cPosName: '',
        cBatch: '',

        cComUnitCode: '',
        cComUnitName: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: ''
      },
      list: [],
      curEle: ''
    }
  },
  watch: {},
  methods: {
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
        }, 10)
        setTimeout(() => {
          if (window.android) {
            android.HideSoftKeyboard()
          }
        }, 50)
      }
    },
    clearForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.list = []
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描包装桶条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      this.list = []
      getCurrentStock({ cType: this.curQueryTypeId, cBarcode: this.form.cBarcode })
        .then(({ Data }) => {
          this.clearForm()
          if (Data != null && Data.length > 0) {
            this.list = Data
            if (this.curQueryTypeId == 1) {
              this.form.cPosCode = Data[0]['cPosCode']
              this.form.cPosName = Data[0]['cPosName']
            } else if (this.curQueryTypeId == 2) {
              this.form.cBatch = Data[0]['cBatch']
            } else {
              const { cComUnitCode, cComUnitName, cInvCode, cInvName, cInvStd } = Data[0]
              this.form.cComUnitCode = cComUnitCode
              this.form.cComUnitName = cComUnitName
              this.form.cInvCode = cInvCode
              this.form.cInvName = cInvName
              this.form.cInvStd = cInvStd

              this.list = Data.map(f => {
                return {
                  cWhCode: f.cWhCode,
                  cWhName: f.cWhName,
                  cPosCode: f.cPosCode,
                  cPosName: f.cPosName,
                  cBatch: f.cBatch,
                  iQuantity: f.iQuantity
                }
              })
            }
            this.curEle = 'ele_cBarcode'
          } else {
            this.clearForm()
          }
        })
        .catch(err => {
          this.clearForm()
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
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
    },
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    openSource() {
      this.$refs.sourcerow.open()
    },
    pickSource({ label, value }) {
      this.curQueryType = label
      this.curQueryTypeId = value
      this.$nextTick(() => {
        this.curEle = 'ele_cBarcode'
        this.list = []
        this.clearForm()
        this.setFocus()
      })
    },
    cancelPicker() {
      this.setFocus()
    }
  },
  computed: {},
  created() {},
  mounted() {
    window.scanResult = result => {
      this.form.cBarcode = result
      setTimeout(() => {
        this.queryInv()
      }, 600)
    }

    this.$nextTick(() => {
      if (this.$refs.ele_cBarcode != void 0) {
        this.$refs.ele_cBarcode.focus()
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
      width: 30%;
    }
  }

  .list0,
  .list {
    height: calc(100vh);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh);
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
  .item:after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0.42667rem;
    bottom: 0;
    left: 0.42667rem;
    border-bottom: 0.02667rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  table {
    border: 1px solid #333;
  }

  table td {
    border-top: 0;
    border-bottom: 1px solid #333;
    border-right: 1px solid #333;
    border-left: 0;
  }

  table tr.lastRow td {
    border-bottom: 0;
  }

  table tr td.lastCol {
    border-right: 0;
  }
}
</style>
  