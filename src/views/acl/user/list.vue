<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-input placeholder="用户名" v-model="tempSearchObj.username"></el-input>
			</el-form-item>
			<el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
			<el-button @click="resetSearch">清空</el-button>
		</el-form>
		<div style="margin-bottom: 20px">
			<el-button type="primary" @click="showAddUser">添加</el-button>
			<el-button
				type="danger"
				@click="removeUsers"
				:disabled="selectedIds.length == 0"
				>批量删除</el-button
			>
		</div>

		<!-- 用户列表 -->
		<el-table
			style="width: 100%"
			border
			:data="users"
			v-loading = "loading"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55"> </el-table-column>
			<el-table-column label="序号" type="index" width="80">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="width">
			</el-table-column>
			<el-table-column prop="nickName" label="用户昵称" width="width">
			</el-table-column>
			<el-table-column prop="roleName" label="权限列表" width="width">
			</el-table-column>
			<el-table-column prop="gmtCreate" label="创建时间" width="width">
			</el-table-column>
			<el-table-column prop="gmtModified" label="更新时间" width="width">
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="230">
				<template slot-scope="{ row, $index }">
					<HintButton
						icon="el-icon-user-solid"
						type="info"
						title="分配角色"
						size="mini"
						@click="showAssignRole(row)"
					></HintButton>
					<HintButton
						icon="el-icon-edit"
						type="primary"
						title="修改用户"
						size="mini"
						@click="showUpdateUser(row)"
					></HintButton>
					<el-popconfirm
						:title="`确定删除${row.username}吗?`"
						@onConfirm="removeUser(row.id)"
					>
						<HintButton
							icon="el-icon-delete"
							type="danger"
							title="删除用户"
							size="mini"
							slot="reference"
							style="margin-left:10px"
						></HintButton>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="getUsers"
			:current-page="page"
			:page-sizes="[3, 5, 7]"
			:page-size="limit"
			layout=" prev, pager, next, jumper,->,sizes,total"
			:total="total"
		>
		</el-pagination>

		<!-- 分配角色弹出框 -->
		<el-dialog
			title="设置角色"
			:visible.sync="dialogVisible"
			width="width"
			:before-close="resetRoleData"
		>
			<el-form ref="form" label-width="80px">
				<el-form-item label="用户名">
					<el-input disabled :value="user.username"></el-input>
				</el-form-item>
				<el-form-item label="角色列表">
					<el-checkbox
						:indeterminate="isIndeterminate"
						v-model="checkAll"
						@change="handleCheckAllChange"
						>全选</el-checkbox
					>
					<div></div>
					<el-checkbox-group
						v-model="userRoleId"
						@change="handleCheckedCitiesChange"
					>
						<el-checkbox
							:label="role.id"
							v-for="(role, index) in allRolesList"
							:key="role.id"
							>{{ role.roleName }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="resetRoleData">取 消</el-button>
				<el-button type="primary" @click="assignRoles">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 添加/修改用户对话框 -->
		<el-dialog
			:title="user.id ? '修改用户' : '添加用户'"
			:visible.sync="dialogUserVisible"
			width="width"
		>
			<el-form
				ref="userForm"
				:model="user"
				:rules="userRules"
				label-width="120px"
			>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="user.username"></el-input>
				</el-form-item>
				<el-form-item label="用户昵称" prop="nickname">
					<el-input v-model="user.nickName"></el-input>
				</el-form-item>
				<el-form-item label="用户密码" v-if="!user.id" prop="password">
					<el-input v-model="user.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="addorUpdateUser"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'User',
	data() {
		return {
			users: [],
			//当前页
			page: 1,
			limit: 3,
			total: 0,
			//加载效果 loading
			loading:false,

			//某一个用户信息
			user: {},
			//用户全部角色
			allRolesList: [],

			//收集用户已授权角色id
			userRoleId: [],

			//全选框 状态
			isIndeterminate: false,
			//是否全选
			checkAll: false,

			//分配角色气泡框是否显示
			dialogVisible: false,
			// 添加/修改用户对话框是否显示
			dialogUserVisible: false,

			//表单验证
			userRules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur',
					},
					{ min: 4, message: '用户名不能小于4位', trigger: 'blur' },
				],
				password: [
					{
						required: true,
						validator: this.validatePassword,
						trigger: 'blur',
					},
				],
			},

			//选中用户列表 批量删除
			selectedIds: [],

			//搜索关键字
			searchObj: {
				// 包含请求搜索条件数据的对象
				username: '',
			},
			tempSearchObj: {
				// 收集搜索条件输入的对象
				username: '',
			},
		}
	},
	mounted() {
		this.getUsers()
	},
	methods: {
		//获取用户列表
		async getUsers(page = 1) {
			
			this.page = page
			const { limit ,searchObj } = this

			try {
				this.loading = true
				let res = await this.$API.user.reqGetUserInfo(page, limit,searchObj)
				this.loading = false
				this.total = res.data.total
				this.users = res.data.items
			} catch (error) {
				this.$message.error('获取失败')
			}
		},
		//改变显示条数
		handleSizeChange(limit) {
			this.limit = limit
			this.getUsers()
		},

		/* *********************************分配角色********************************* */

		//点击分配角色 按钮
		showAssignRole(row) {
			this.user = row
			this.dialogVisible = true
			this.getRole()
		},
		//获取某个用户的角色列表
		async getRole() {
			try {
				let res = await this.$API.user.reqGetUserRole(this.user.id)
				const { allRolesList, assignRoles } = res.data
				this.allRolesList = allRolesList
				this.userRoleId = assignRoles.map((item) => item.id)
			} catch (error) {
				this.$message.error(error.message)
			}
		},
		//全选按钮
		handleCheckAllChange(val) {
			//val 全选框状态,true/false

			//如果全选
			this.userRoleId = val
				? this.allRolesList.map((item) => item.id)
				: []

			// 如果当前不是全选也不全不选时, 指定为false
			this.isIndeterminate = false
		},

		//列表选择框 选中值改变时
		handleCheckedCitiesChange(value) {
			//value = userRoleId  当前选中值 数组
			const { userRoleId, allRolesList } = this
			this.checkAll =
				userRoleId.length === allRolesList.length &&
				allRolesList.length > 0
			this.isIndeterminate =
				userRoleId.length > 0 && userRoleId.length < allRolesList.length
		},
		//保存 分配角色
		async assignRoles() {
			try {
				const userId = this.user.id
				const roleId = this.userRoleId.join(',')
				await this.$API.user.reqGetAssignRole(userId, roleId)
				this.$message({ type: 'success', message: '授权成功' })
				this.getUsers(this.page)
				this.resetRoleData()
			} catch (error) {
				this.$message.error(error.message)
			}
		},

		//分配角色页 取消按钮回调
		resetRoleData() {
			this.dialogVisible = false
			this.user = {}
			this.userRoleId = []
			this.allRolesList = []
			this.isIndeterminate = false
			this.checkAll = false
		},

		/* ********************************* 修改 | 添加用户 **********************************/
		//修改 | 添加用户回调
		showUpdateUser(row) {
			this.dialogUserVisible = true
			this.user = row
		},
		//添加用户按钮
		showAddUser() {
			this.dialogUserVisible = true
			this.user = {}
		},
		//表单校验
		//自定义密码校验
		validatePassword(rule, value, callback) {
			if (!value) {
				callback('密码必须输入')
			} else if (!value || value.length < 6) {
				callback('密码不能小于6位')
			} else {
				callback()
			}
		},

		//保存用户信息
		addorUpdateUser() {
			this.$refs.userForm.validate(async (valid) => {
				if (valid) {
					try {
						const { user } = this
						await this.$API.user[
							user.id ? 'reqUpdateUser' : 'reqAddUser'
						](user)
						this.$message.success('保存成功!')
						this.getUsers(user.id ? this.page : 1)
						this.user = {}
						this.dialogUserVisible = false
					} catch (error) {
						this.$message.error(error.message)
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		//取消保存
		cancel() {
			this.dialogVisible = false
			this.user = {}
		},

		/* ********************************* 删除用户 ********************************* */

		//删除用户
		async removeUser(userId) {
			console.log(11111);
			try {
				await this.$API.user.reqDeleteUser(userId)
				this.$message.success('删除成功')
				this.getUsers(
					this.users.length > 1 ? this.page : this.
					page - 1
				)
			} catch (error) {
				this.$message.error(error.message)
			}
		},

		//选中用户数据收集
		handleSelectionChange(selection) {
			this.selectedIds = selection.map((item) => item.id)
		},

		//删除选中用户 批量删除
		removeUsers() {
			this.$confirm('确定删除选中用户吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					await this.$API.user.reqDeleteUsers(this.selectedIds)
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
					this.getUsers()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},

		/* *********************************根据用户名搜索********************************* */
		//搜索
		search(){
			this.searchObj = {...this.tempSearchObj}
			this.getUsers()
		},
		//清空搜索条件
		resetSearch(){
			this.searchObj={
				username:''
			}
			this.tempSearchObj = {
				username:''
			}
			this.getUsers()
		}
	},
}
</script>

<style lang='less' scoped>
</style>