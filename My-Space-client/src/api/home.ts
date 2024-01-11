import { type AxiosResponse } from 'axios'
import { GET, ImageGet, POST, filePost } from '@/api/request'

// 首页数据更新
export const getCardInfos = (params?: Object): Promise<AxiosResponse<any, any>> => {
  return GET({
    url: '/api/renderCard',
    params
  })
}

export const getCardImage = (params?: Object): Promise<string> => {
  return ImageGet({
    url: '/api/cardImage',
    params
  })
}

export const userAuthenticate = (params?: Object): Promise<any> => {
  return POST({
    url: '/api/Authenticate',
    params
  })
}

export const uploadFile = (params: FormData): Promise<any> => {
  return filePost({
    url: '/api/uploadFile',
    params
  })
}

export const uploadInfoSubmit = (params?: Object): Promise<any> => {
  return POST({
    url: '/api/uploadInfoSubmit',
    params
  })
}
