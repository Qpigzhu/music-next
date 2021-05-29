import { get } from './base'

// 请求轮播图的数据接口
export function getRecommend(){
    return get('/api/getRecommend')
}