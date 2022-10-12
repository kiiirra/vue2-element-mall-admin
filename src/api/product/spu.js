import request from '@/utils/request'

//获取spu列表 /admin/product/{page}/{limit}/?category3Id
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,params:{category3Id},method:'get'})

//获取当前spu的数据 /admin/product/getSpuById/{spuId} spuId get
 export const reqSpuInfo =(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//获取品牌数据 /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = ()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

//获取照片墙数据 /admin/product/spuImageList/{spuId}
export const reqSpuImageList =(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取销售数据 /admin/product/baseSaleAttrList get
export const reqSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})


//修改 | 添加spu 保存数据  
/* 
    添加: /admin/product/saveSpuInfo
    修改: /admin/product/updateSpuInfo  修改要带上spu id

*/
export const reqAddOrUpdateSpuInfo =(spuInfo)=>{
    if (spuInfo.id) {
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
        
    } else {
        return  request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
        
    }
}

//删除spu /admin/product/deleteSpu/{spuId}
export const reqDeleteSpuById = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})


//获取销售属性 /admin/product/spuSaleAttrList/5
export const reqSpuSaleAttrListById = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

//获取平台属性 /admin/product/attrInfoList/2/13/61
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//保存添加sku数据 /admin/product/saveSkuInfo
export const reqsaveSkuInfo =(skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

//获取sku列表 /admin/product/findBySpuId/10677
export const reqSkuInfoBySpuId =(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})