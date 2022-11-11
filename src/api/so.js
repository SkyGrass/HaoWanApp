// axios
import request from '@/utils/request'

//发货单单据  表头
export function getDispatchHead(data) {
  return request({
    url: 'GetDispatchHead',
    method: 'post',
    data
  })
}

//发货单单据
export function getDispatch(data) {
    return request({
      url: 'GetDispatch',
      method: 'post',
      data
    })
  }

  
  //销售出库
export function saveProStockOut(data) {
    return request({
      url: 'SaveProStockOut',
      method: 'post',
      data
    })
  }
  

