<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-input
					placeholder="角色名称"
					v-model="tempSearchObj.roleName"
				></el-input>
			</el-form-item>
			<el-button type="primary" icon="el-icon-search" @click="search"
				>查询</el-button
			>
			<el-button @click="resetSearch">清空</el-button>
		</el-form>
		<div style="margin-bottom: 20px">
			<el-button type="primary" @click="addRole">添加</el-button>
			<el-button type="danger" @click="removeRoles" :disabled="selectedIds.length==0">批量删除</el-button>
		</div>

		<!-- 用户列表 -->
		<el-table
			style="width: 100%"
			border
			:data="roles"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55"> </el-table-column>
			<el-table-column label="序号" type="index" width="80">
			</el-table-column>
			<el-table-column label="角色名称" width="width">
				<template slot-scope="{ row }">
					<template v-if="row.edit">
						<el-input
							size="small"
							class="edit-input"
							v-model="row.roleName"
						></el-input>
						<el-button
							type="warning"
							icon="el-icon-refresh"
							size="small"
							class="cancel-btn"
							@click="cancelEdit(row)"
							>取消</el-button
						>
					</template>
					<span v-else>{{ row.roleName }}</span>
				</template>
			</el-table-column>

			<el-table-column prop="prop" label="操作" width="width">
				<template slot-scope="{ row}">
					<HintButton
						icon="el-icon-info"
						type="info"
						title="分配权限"
						size="mini"
						  @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"
					></HintButton>
					<HintButton
						size="mini"
						type="primary"
						icon="el-icon-check"
						title="确定"
						@click="updateRole(row)"
						v-if="row.edit"
					/>
					<HintButton
						icon="el-icon-edit"
						type="primary"
						title="修改角色"
						size="mini"
						@click="row.edit = true"
						v-if="!row.edit"
					></HintButton>
					<HintButton
						icon="el-icon-delete"
						type="danger"
						title="删除角色"
						@click="removeRole(row)"
						size="mini"
					></HintButton>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="getRoles"
			:current-page="page"
			:page-sizes="[3, 5, 7]"
			:page-size="limit"
			layout=" prev, pager, next, jumper,->,sizes,total"
			:total="total"
		>
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: 'Role',
	data() {
		return {
			page: 1,
			limit: 3,
			total: 0,
			dialogVisible: true,
			roles: [],
			tempSearchObj: {
				// 收集搜索条件数据
				roleName: '',
			},
			searchObj: {
				// 发送请求的条件参数数据
				roleName: '',
			},
			//添加某一个角色信息
			role: {},
			selectedIds: [],
		}
	},
	mounted() {
		this.getRoles()
	},
	methods: {
		//获取角色列表
		async getRoles(page = 1) {
			this.page = page
			const { limit, searchObj } = this
			try {
				let res = await this.$API.role.reqGetRolesList(
					page,
					limit,
					searchObj
				)
				const { total, items } = res.data
				this.total = total
				this.roles = items.map((item) => {
					item.edit = false //是否显示编辑框
					item.originRoleName = item.roleName //缓存角色名称,用于取消
					return item
				})
			} catch (error) {
				this.$message.error('获取失败')
			}
		},
		//显示页码改变
		handleSizeChange(limit) {
			this.limit = limit
			this.getRoles()
		},
		/* ******************************* 修改角色 ****************************** */

		//保存修改
		async updateRole(row) {
			try {
				await this.$API.role.reqUpdateRole({
					id: row.id,
					roleName: row.roleName,
				})
				this.$message.success(result.message || '更新角色成功!')
				this.getRoles(this.page)
			} catch (error) {
				this.$message.error(error.message || '更新角色失败!')
			}
		},
		//取消更改
		cancelEdit(row) {
			row.roleName = row.originRoleName
			row.edit = false
			this.$message.warning('取消角色修改')
		},

		//添加角色
		addRole() {
			this.$prompt('请输入新角色名称', '添加角色', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async ({ value }) => {
					let result = await this.$API.role.reqAddRole({
						roleName: value,
					})
					this.$message.success(result.message || '添加角色成功')
					this.getRoles()
				})
				.catch(() => {
					this.$message.warning('取消添加')
				})
		},

		//删除用户
		removeRole(row) {
			this.$confirm('确定删除此角色吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					let result = await this.$API.role.reqDeleteRole(row.id)
					this.$message.success(result.message || '删除成功')
					this.getRoles(
						this.roles.length === 1 ? this.page - 1 : this.page
					)
				})
				.catch(() => {
					this.$message.warning('取消删除')
				})
		},
		//多选选中用户
		handleSelectionChange(val) {
			this.selectedIds = val.map((item) => item.id)
		},
		//批量删除用户
		async removeRoles() {
			this.$confirm('确定删除选中的角色吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					let result = await this.$API.role.reqDeleteRoles(
						this.selectedIds
					)
					this.$message.success(result.message || '删除成功')
					this.getRoles()
				})
				.catch(() => {
					this.$message.warning('取消删除')
				})
		},
		/* *********************************根据角色名搜索********************************* */
		//搜索
		search() {
			this.searchObj = { ...this.tempSearchObj }
			this.getRoles()
		},
		//清空搜索条件
		resetSearch() {
			this.searchObj = {
				roleName: '',
			}
			this.tempSearchObj = {
				roleName: '',
			}
			this.getRoles()
		},
		//查看角色列表
		toRoleAuth(row){
			this.$router.push({
				name:'RoleAuth',
				params:{
					id:row.id
				},
				query:{
					roleName:row.roleName
				}
			})
		}
	},
}
</script>

<style>
.edit-input {
	padding-right: 100px;
}
.cancel-btn {
	position: absolute;
	right: 15px;
	top: 10px;
}
</style>    