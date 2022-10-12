import request from '@/utils/request'

//获取1级分类GET /admin/product/getCategory1
export const reqCategory1List = () => request({
  url: '/admin/product/getCategory1',
  method: 'get'
})

// 获取2级分类GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

///获取3级分类 admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => request({
  url: `admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

//获取属性列表数据 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}

export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

//保存属性 admin/product/saveAttrInfo post
export const reqSaveAttrInfo = (data) => request({
  url: 'admin/product/saveAttrInfo',
  method: 'post',
  data
})

//删除属性 /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: 'delete'
})
