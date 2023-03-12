import axios from '@/libs/api.request'

// 商品列表
export const goodsPage = (info) => {
  return axios.request({
    url: 'goods/page',
    data: info,
    method: 'post',
  })
}
// 商品修改
export const goodsUpdate = (info) => {
  return axios.request({
    url: 'goods/update',
    data: info,
    method: 'post',
  })
}
// 商品添加
export const goodsAdd = (info) => {
  return axios.request({
    url: 'goods/add',
    data: info,
    method: 'post',
  })
}
// 商品删除
export const goodsDel = (info) => {
  return axios.request({
    url: 'goods/del',
    data: info,
    method: 'post',
  })
}
// 商品分类列表
export const goodsTypePage = (info) => {
  return axios.request({
    url: 'goodstype/page',
    data: info,
    method: 'post',
  })
}

export const goodsAll = () => {
  return axios.request({
    url: 'goods/page',
    data: {
      pageNo:1,
      pageSize:10000000,
    },
    method: 'post',
  })
}






