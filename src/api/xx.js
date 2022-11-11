// axios
import request from '@/utils/request'

//下线采集
export function getMODetail(data) {
  return request({
    url: 'GetMODetail',
    method: 'post',
    data
  })
}



export function saveSN(data) {
  return request({
    url: 'SaveSN',
    method: 'post',
    data
  })
}


