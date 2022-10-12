import request from '@/utils/request'

/* 
 *  品牌分页列表: /admin/product/baseTrademark/{page}/{limit}
 */

export const reqTradeMark = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

//新增品牌 /admin/product/baseTrademark/save  post {logoUrl,tmName}

//修改品牌  /admin/product/baseTrademark/update  put  {id,logoUrl,tmName}

export const reqAddOrUpdateTradeMark = (tradeMark) => {

  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update ',
      method: 'put',
      data: tradeMark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

//删除品牌  /admin/product/baseTrademark/remove/{id} delete id
export const reqDeleteTradeMark = (id) =>request ({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
