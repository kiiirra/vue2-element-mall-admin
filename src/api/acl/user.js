import request from '@/utils/request'


//获取管理用户列表
export const reqGetUserInfo=(page,limit,searchObj)=>request({url:`/admin/acl/user/${page}/${limit}`,method:'get',params:searchObj})

//用户分配角色 /admin/acl/user/doAssign  roleId的结构: 字符串, 'rId1,rId2,rId3'
export const reqGetAssignRole=(userId,roleId)=>request({url:'/admin/acl/user/doAssign',method:'post',params:{userId,roleId}})

//获取用户角色列表 /admin/acl/user/toAssign/{userId}
export const reqGetUserRole=(userId)=>request({url:`/admin/acl/user/toAssign/${userId}`,method:'get'})


//添加用户/admin/acl/user/save  post
export const reqAddUser=(user)=>request({url:'/admin/acl/user/save',method:'post',data:user})

//修改用户  /admin/acl/user/update  put
export const reqUpdateUser=(user)=>request({url:'/admin/acl/user/update',method:'PUT',data:user})

//删除用户  /admin/acl/user/remove/{id} delete
export const reqDeleteUser=(id)=>request({url:`/admin/acl/user/remove/${id}`,method:'delete'})

//批量删除/admin/acl/user/batchRemove ids的结构: ids是包含n个id的数组
export const reqDeleteUsers =(idList)=>request({url:'/admin/acl/user/batchRemove',method:'delete',data:idList})
