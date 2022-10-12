import request from '@/utils/request'


//获取角色列表
export const reqGetRolesList=(page,limit,searchObj)=>request({url:`/admin/acl/role/${page}/${limit}`,method:'get',params:searchObj})


//添加角色   post { }
export const reqAddRole=(role)=>request({url:'/admin/acl/role/save',method:'post',data:role})

//修改   put
export const reqUpdateRole=(role)=>request({url:'/admin/acl/role/update',method:'PUT',data:role})

//删除用户   delete
export const reqDeleteRole=(id)=>request({url:`/admin/acl/role/remove/${id}`,method:'delete'})

//批量删除 ids的结构: ids是包含n个id的数组
export const reqDeleteRoles =(ids )=>request({url:'/admin/acl/role/batchRemove',method:'delete',data:ids })

