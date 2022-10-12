<template>
	<div>
		<!-- 渲染树形数据时，必须要指定 row-key -->
		<el-table
			border
			style="margin-bottom: 20px"
			:data="menuPermissionList"
			:expand-row-keys="expandKeys"
			row-key="id"
		>
			<el-table-column prop="name" label="名称" width="width">
			</el-table-column>
			<el-table-column prop="code" label="权限值" width="width">
			</el-table-column>
			<el-table-column prop="toCode" label="跳转权限值" width="width">
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<template slot-scope="{ row }">
					<HintButton
						icon="el-icon-plus"
						type="primary"
						:title="getAddtitle(row.level)"
						size="mini"
						:disabled="row.level === 4"
						@click="toAddPermission(row)"
					></HintButton>
					<HintButton
						icon="el-icon-edit"
						type="primary"
						title="编辑菜单"
						size="mini"
						@click="toUpdatePermission(row)"
					></HintButton>
					<HintButton
						icon="el-icon-delete"
						type="danger"
						title="删除"
						@click="removePermission(row)"
						size="mini"
					></HintButton>
				</template>
			</el-table-column>
		</el-table>
		<!-- 添加 | 修改菜单
                添加二级菜单  父级 名称 功能
                添加功能      父级 名称 功能 路由
                修改菜单      名称 功能
                修改功能       名称 功能 路由

         -->
		<el-dialog
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="width"
			@close="resetData"
		>
			<el-form
				rule="rules"
				label-width="120px"
				ref="permission"
				:model="permission"
				:rules="permissionRules"
			>
				<el-form-item
					label="父级名称"
					v-if="permission.level > 2 && !permission.id"
				>
					<el-input disabled :value="permission.pname"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop='name'>
					<el-input v-model="permission.name"></el-input>
				</el-form-item>
				<el-form-item label="功能权限值" prop='code'>
					<el-input v-model="permission.code"></el-input>
				</el-form-item>
				<el-form-item label="路由跳转权限值" prop='toCode' vv-if="permission.level === 4">
					<el-input v-model="permission.toCode"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdatePermission"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// 菜单权限校验的规则
const menuRules = {
	name: [{ required: true, message: '名称必须输入' }],
	code: [{ required: true, message: '权限值必须输入' }],
}

// 按钮功能权限校验的规则
const btnRules = {
	name: [{ required: true, message: '名称必须输入' }],
	code: [{ required: true, trigger: 'blur', message: '功能权限值必须输入' }],
}

export default {
	name: 'Permission',
	data() {
		return {
			dialogVisible: false,
			menuPermissionList: [], //菜单列表
			expandKeys: [], // 需要自动展开的项
			permission: {
				level: 0,
				name: '',
				code: '',
				toCode: '',
			},
		}
	},

	mounted() {
		this.getPermissionList()
	},
	computed: {
		//动态计算标签框标题
		dialogTitle() {
			const { id, level } = this.permission
			if (id) {
				return level === 4 ? '修改功能' : '修改菜单'
			} else {
				return level === 4
					? '添加功能'
					: `添加${level === 2 ? '一级' : '二级'}菜单`
			}
		},
		/* 根据权限等级计算确定校验规则 */
		permissionRules() {
			return this.permission.level === 4 ? btnRules : menuRules
		},
	},
	methods: {
		//获取菜单列表
		async getPermissionList() {
			try {
				let result = await this.$API.permission.getPermissionList()
				this.menuPermissionList = result.data.children
				this.expandKeys = [this.menuPermissionList[0].id]
			} catch (error) {
				this.$message.error(error.message)
			}
		},

		/* 动态获取当前节点等级,
		* 根据节点等级,显示对应的状态框	
		
		*/

		/* 动态添加按钮提示文字
			level4 是禁用的,没有提示
		*/
		getAddtitle(level) {
			if (level === 1 || level === 2) {
				return '添加菜单'
			} else if (level === 3) {
				return '添加功能'
			}
		},

		/* 
			添加弹框
		*/
		toAddPermission(row) {
			this.dialogVisible = true
			this.permission.pid = row.id
			this.permission.level = row.level + 1
			//按钮类型
			this.permission.type = this.permission.level === 4 ? 2 : 1
			this.permission.pname = row.name

			//清除校验 ，在界面更新前
			this.$nextTick(() => this.$refs.permission.clearValidate())
		},
		/* 
			编辑框 
		*/
		toUpdatePermission(row) {
			this.dialogVisible = true
			this.permission = { ...row }
			this.permission.type = this.permission.level === 4 ? 2 : 1

			this.$nextTick(() => this.$refs.permission.clearValidate())
		},

		//添加或更新功能权限 addPermission updatePermission
		addOrUpdatePermission() {
			console.log(11111)
			this.$refs.permission
				.validate(async (valid) => {
					if (valid) {
						const { pname, ...perm } = this.permission //pname 不需要携带
						const result = await this.$API.permission[
							perm.id ? 'updatePermission' : 'addPermission'
						](perm)
						this.$message.success(
							result.message ||
								`${perm.id ? '修改' : '添加'}成功!`
						)
						this.resetData()
						this.getPermissionList()
					}
				})
				.catch((error) => {
					console.log(error)
				})
		},
		/* 
		删除某个权限节点
		*/
		removePermission(permission) {
			this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
				type: 'warning',
			})
				.then(async () => {
					const result = await this.$API.permission.removePermission(
						permission.id
					)
					this.$message.success(result.message || '删除成功!')
					this.getPermissionList()
				})
				.catch((error) => {
					if (error === 'cancel') {
						this.$message({
							type: 'info',
							message: '已取消删除',
						})
					}
				})
		},

		//重置数据
		resetData() {
			this.dialogVisible = false
			this.permission = {
				level: 0,
				name: '',
				code: '',
				toCode: '',
			}
		},

		removePerList() {
			this.$confirm('确定删除此条数据吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
	},
}
</script>

<style lang='less' scoped>
</style>