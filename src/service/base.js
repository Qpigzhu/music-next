import axios from 'axios'

const baseURL = 'http://192.168.3.209:9001' // 请求地址
const ERR_OK = 0 // 请求成功状态码

axios.defaults.baseURL = baseURL

// 封装axions的get请求
export function get(url,params){
    return axios.get(url, {
        params
    }).then((res)=>{
        const serverData = res.data
        if(serverData.code === ERR_OK){
            return serverData.result
        }
    }).catch(err=>{
        console.log(err)
    })
}