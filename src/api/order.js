import axios from '@/libs/api.request'


export const orderAdd = (info) => {
    return axios.request({
        url: 'order/add',
        data: info,
        method: 'post',
    })
}

export const orderPage = (info) => {
    return axios.request({
        url: 'order/page',
        data: info,
        method: 'post',
    })
}
export const orderDetail = (info) => {
    return axios.request({
        url: 'order/detail',
        data: info,
        method: 'post',
    })
}