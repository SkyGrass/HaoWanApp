import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'

// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  //withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    config.headers = {
      'Content-Type': 'multipart/form-data'
    }
    const { accountId, key, loginUserId, pwd, accountDate } = store.getters

    config.data = {
      MethodName: config.url,
      JSON: JSON.stringify(
        Object.assign({}, config.data, {
          cKey: key,
          cUser_Id: loginUserId,
          cPassword: pwd,
          dLoginDate: accountDate
        })
      ),
      AccID: accountId
    }
    if (process.env.VUE_APP_ENV == 'production') {
      config.baseURL =
        'http://' +
        MyLStorage.get('model').server +
        ':' +
        MyLStorage.get('model').port +
        '/' +
        MyLStorage.get('model').path
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      const { Data, Message, Result } = res
      if (Result == 'Y') {
        return Promise.resolve(res)
      } else {
        Toast.fail(Message)
        return Promise.reject({ Message } || 'error')
      }
    }
  },
  error => {
    Toast.clear()
    return Promise.reject(error)
  }
)

export default service
