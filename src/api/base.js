import api from './index'
// axios
import request from '@/utils/request'


// 获取存货
export function getInventory(data) {
  return request({
    url: 'GetSN',
    method: 'post',
    data
  })
}

// 获取仓库
export function getWarehouse(data) {
  return request({
    url: 'Warehouse',
    method: 'post',
    data
  })
}

// 获取货位
export function getPosition(data) {
  return request({
    url: 'Position',
    method: 'post',
    data
  })
}

// 获取部门
export function getDepartment(data) {
  return request({
    url: 'Department',
    method: 'post',
    data
  })
}

// 获取人员
export function getPerson(data) {
  return request({
    url: 'Person',
    method: 'post',
    data
  })
}

// 获取出入库类别
export function getRdStyle(data) {
  return request({
    url: 'Rd_Style',
    method: 'post',
    data
  })
} 
