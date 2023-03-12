// 商品分类列表
import axios from "@/libs/api.request";

export const goodsTypePage = (info) => {
    return axios.request({
        url: 'goodstype/page',
        data: info,
        method: 'post',
    })
}

export const goodsTypeDel = (info) => {
    return axios.request({
        url: 'goodstype/del',
        data: info,
        method: 'post',
    })
}


export const goodstypeAdd = (info) => {
    return axios.request({
        url: 'goodstype/add',
        data: info,
        method: 'post',
    })
}
export const goodstypeUpdate = (info) => {
    return axios.request({
        url: 'goodstype/update',
        data: info,
        method: 'post',
    })
}



