// import qs from 'qs'
// axios
// import request from '@/utils/request'
// home api

// axios
import request from '@/utils/request'

// 获取菜单
export function getMenu(data) {
  return request({
    url: 'Menu',
    method: 'post',
    data
  })
}
