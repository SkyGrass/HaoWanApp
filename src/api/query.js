// axios
import request from '@/utils/request'

//库存查询
export function getCurrentStock(data) {
  return request({
    url: 'GetCurrentStock',
    method: 'post',
    data
  })
}


