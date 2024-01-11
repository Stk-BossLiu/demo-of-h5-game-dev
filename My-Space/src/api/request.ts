import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

interface requestType {
  url: string
  params?: any
}
const handleCode = async (code: number, msg: string) => {
  switch (code) {
    case 401:
      ElMessage.error(msg || '登录失效')
      setTimeout(() => {
        console.log('登录失效')
      }, 1500)
      // 跳转登录
      break
    default:
      ElMessage.error(msg || `后端接口${code}异常`)
      break
  }
}

//创建axsio 赋给常量service
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
const fileService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
// 添加请求拦截器
service.interceptors.request.use(
  (config: any) => {
    console.log(config, 'config')
    return config
  },
  (error: any) => {
    // 对请求错误做些什么
    console.log(error, 'error')
    return Promise.reject(error)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response
    if (config.method == 'post') {
      return data as { code: number; msg: string }
    }
    return data
  },
  (error: any) => {
    const { response } = error

    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg)

      // 对响应错误做点什么
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      ElMessage.error(message || `后端接口未知异常`)
      return Promise.reject(error)
    }
  }
)

/**
 * @description GET
 */
const GET = ({ url, params }: requestType) => {
  return service({
    url,
    method: 'GET',
    params
  } as AxiosRequestConfig)
}

const ImageGet = ({ url, params }: requestType) => {
  return axios({
    method: 'GET',
    url: url,
    params: params,
    responseType: 'blob'
  }).then((res) => {
    return URL.createObjectURL(res.data)
  })
}

/**
 * @description POST
 */
const POST = ({ url, params }: requestType) => {
  return service({
    url,
    method: 'POST',
    data: params
  } as AxiosRequestConfig)
}

const filePost = ({ url, params }: requestType) => {
  return fileService({
    url,
    method: 'POST',
    data: params
  } as AxiosRequestConfig)
}
/**
 * @description PUT
 */
const PUT = ({ url, params }: requestType) => {
  return service({
    url,
    method: 'PUT',
    data: params
  } as AxiosRequestConfig)
}

/**
 * @description DELETE
 */
const DELETE = ({ url, params }: requestType) => {
  return service({
    url,
    method: 'delete',
    data: params
  } as AxiosRequestConfig)
}

/**
 * @description PATCH
 */
const PATCH = ({ url, params }: requestType) => {
  return new Promise((resolve, reject) => {
    service
      .put(url, params)
      .then((res: any) => {
        if (res && res.status == 200) {
          resolve(res)
        }
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}
export { GET, ImageGet, POST, filePost, PUT, DELETE, PATCH }
