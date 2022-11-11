// axios
import request from '@/utils/request'

//产成品入库
export function saveProStockIn(data) {
  return request({
    url: 'SaveProStockIn',
    method: 'post',
    data
  })
}


