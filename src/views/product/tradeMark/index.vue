<template>
	<div>
		<el-button
			type="primary"
			icon="el-icon-plus"
			style="margin: 10px 0px"
			@click="showDialog"
			>添加</el-button
		>
		<el-table border style="width: 100%" :data="list">
			<el-table-column
				type="index"
				label="序号"
				width="50"
				align="center"
			></el-table-column>
			<el-table-column
				prop="tmName"
				label="品牌名称"
				width="width"
			></el-table-column>
			<el-table-column prop="logoUrl" label="品牌LOGO" width="width">
				<template slot-scope="{ row, $index }">
					<img
						:src="row.logoUrl"
						alt=""
						style="width: 100px; heigt: 100px"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<template slot-scope="{ row, $index }">
					<el-button
						type="warning"
						icon="el-icon-edit"
						size="mini"
						@click="updateTradeMark(row)"
					></el-button>
					<el-button
						type="danger"
						icon="el-icon-delete"
						size="mini"
						@click="deleteTradeMark(row)"
					></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			style="margin-top: 20px; textalign: center"
			:current-page="page"
			:page-size="limit"
			:total="total"
			:page-sizes="[3, 5, 10]"
			:pager-count="7"
			layout="prev, pager, next,jumper,->,sizes,total"
			@current-change="getPageList"
			@size-change="handleSizeChange"
		>
		</el-pagination>
		<el-dialog
			:title="tmForm.id ? '修改品牌' : '添加品牌'"
			:visible.sync="dialogFormVisible"
		>
			<el-form
				style="width: 80%"
				:model="tmForm"
				:rules="rules"
				ref="ruleForm"
			>
				<el-form-item
					label="品牌名称"
					label-width="100px"
					prop="tmName"
				>
					<el-input
						autocomplete="off"
						v-model="tmForm.tmName"
					></el-input>
				</el-form-item>
				<el-form-item
					label="品牌LOGO"
					label-width="100px"
					prop="logoUrl"
				>
					<el-upload
						class="avatar-uploader"
						action="/dev-api/admin/product/fileUpload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<img
							v-if="tmForm.logoUrl"
							:src="tmForm.logoUrl"
							class="avatar"
						/>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">
							只能上传jpg/png文件，且不超过500kb
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdateTradeMark"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'TradeMark',
	data() {
		//自定义校验规则
		var validateTmName = (rule, value, callback) => {
			//自定义校验规则
			if (value.length < 2 || value.length > 10) {
				callback(new Error('品牌名称2-10位'))
			} else {
				callback()
			}
		}
		return {
			//当前页码
			page: 1,
			//每页展示条数
			limit: 5,
			//分页列表
			list: [],

			total: 0,

			dialogFormVisible: false,

			//添加/修改品牌表单数据
			tmForm: {
				logoUrl: '',
				tmName: '',
			},
			//表单验证规则
			rules: {
				tmName: [
					{
						required: true,
						message: '请输入品牌名称',
						trigger: 'blur',
					},
					{ validator: validateTmName, trigger: 'blur' },
				],
				logoUrl: [{ required: true, message: '请上传品牌图片' }],
			},
		}
	},
	mounted() {
		this.getPageList()
	},
	methods: {
		//获取当前页列表数据
		async getPageList(pager = 1) {
			this.page = pager
			const { page, limit } = this
			let result = await this.$API.trademark.reqTradeMark(page, limit)
			if (result.code == 200) {
				this.list = result.data.records
				this.total = result.data.total
			}
		},
		//修改每页显示条数时,重新获取数据
		handleSizeChange(limit) {
			this.limit = limit
			this.getPageList()
		},
		showDialog() {
			this.dialogFormVisible = true
			//清空表单数据
			this.tmForm = { logoUrl: '', tmName: '' }
		},

		//图片上传成功时
		handleAvatarSuccess(res, file) {
			//console.log(res);
			this.tmForm.logoUrl = res.data
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg'
			const isLt2M = file.size / 1024 / 1024 < 2

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!')
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!')
			}
			return isJPG && isLt2M
		},
		/* 
            * 对话框确定按钮    添加/修改品牌数据 
            *  添加成功后 重新获取列表数据   
            *           添加品牌： 停留在第一页，修改品牌应该留在当前页面
            *      
        
        */
		addOrUpdateTradeMark() {
			this.$refs.ruleForm.validate(async (success) => {
				if (success) {
					this.dialogFormVisible = false
					let res = await this.$API.trademark.reqAddOrUpdateTradeMark(
						this.tmForm
					)
					if (res.code == 200) {
						this.$message({
							type: 'success',
							message: this.tmForm.id
								? '修改品牌成功'
								: '添加品牌成功',
						})
						this.getPageList(this.tmForm.id ? this.page : 1)
					} else {
						this.$message.error(
							this.tmForm.id ? '修改品牌失败' : '添加品牌失败'
						)
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},

		//修改品牌按钮
		updateTradeMark(row) {
			this.dialogFormVisible = true

			this.tmForm = { ...row }
		},

		//删除品牌
		deleteTradeMark(row) {
			this.$confirm(`你确定删除${row.tmName}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
                let res = await this.$API.trademark.reqDeleteTradeMark(row.id)
                console.log(res);
				if (res.code == 200) {
                    this.$message({
                        type:'success',
                        message:'删除成功!'
                    }) 
                } 
                this.getPageList(this.list.length >1 ? this.page: this.page-1)             
			}).catch(()=>{
                this.$message({
                    type:'info',
                    message:'已取消删除'
                })
            })
		},
	},
}
</script>

<style >
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>