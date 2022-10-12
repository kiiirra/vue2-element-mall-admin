import request from '@/utils/request'

//获取sku列表 /admin/product/list/{page}/{limit}
export const reqGetSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//上架
export const reqOnSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

//下架
export const reqCancelSale = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

//获取sku信息 /admin/product/getSkuById/{skuId}
export const reqGetSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})

//删除sku /admin/product/deleteSku/{skuId}
export const reqDeleteSku = (skuId)=>request({url:`/admin/product/deleteSku/${skuId}`,method:'delete'})
