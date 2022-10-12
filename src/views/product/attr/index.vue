<template>
	<div>
		<el-card style="margin: 20px 0px">
			<CategorySelect
				@getCategoryId="getCategoryId"
				:show="!isShowTable"
			></CategorySelect>
		</el-card>

		<el-card>
			<!-- 属性列表 -->
			<div v-show="isShowTable">
				<el-button
					type="primary"
					icon="el-icon-plus"
					style="margin: 0 0 20px"
					:disabled="!category3Id"
					@click="addAttr"
				>
					添加属性
				</el-button>
				<el-table border :data="attrList" style="width: 100%">
					<el-table-column
						type="index"
						label="序号"
						width="80"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="attrName"
						label="属性名称"
						width="width"
					>
					</el-table-column>
					<el-table-column
						prop="prop"
						label="属性值列表"
						width="width"
					>
						<template slot-scope="{ row, $index }">
							<el-tag
								type="success"
								v-for="(attrValue, index) in row.attrValueList"
								:key="attrValue.id"
								style="margin: 0 10px"
								>{{ attrValue.valueName }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<el-button
								type="warning"
								icon="el-icon-edit"
								size="mini"
								@click="updateAttr(row)"
							>
							</el-button>

							<el-button
								type="danger"
								icon="el-icon-delete"
								size="mini"
								@click="deleteAttr(row)"
							>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 添加 | 修改属性 -->
			<div v-show="!isShowTable">
				<el-form :inline="true" label-width="80px" :model="attrInfo">
					<el-form-item label="属性名">
						<el-input
							placeholder="请输入属性名"
							v-model="attrInfo.attrName"
						></el-input>
					</el-form-item>
				</el-form>
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="addAttrValue"
					:disabled="!attrInfo.attrName"
					>添加属性值</el-button
				>
				<el-button @click="isShowTable = true">取消</el-button>
				<el-table
					border
					style="width: 100%; margin: 20px 0"
					:data="attrInfo.attrValueList"
				>
					<el-table-column
						prop="prop"
						type="index"
						label="序号"
						width="80"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="prop"
						label="属性值名称"
						width="width"
					>
						<template slot-scope="{ row, $index }">
							<el-input
								v-model="row.valueName"
								placeholder="请输入属性值名称"
								size="mini"
								v-if="row.flag"
								@blur="toLook(row)"
								@keyup.native.enter="toLook(row)"
								:ref="$index"
							></el-input>
							<span
								v-else
								@click="toEdit(row, $index)"
								style="display: block"
								>{{ row.valueName }}</span
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<!-- 版本:2.13.2 onConfirm    版本:2.15.7 confirm-->
							<el-popconfirm
								:title="`确定删除${row.valueName}吗?`"
								@onConfirm="deleteAttrValue($index)"
							>
								<el-button
									type="danger"
									icon="el-icon-delete"
									size="mini"
									slot="reference"
								></el-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" @click="addOrUpdateAttr"
					>保存</el-button
				>
				<el-button @click="isShowTable = true">取消</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
/*
 *  1.展示属性列表:
        ---从子组件CategorySelect获取id,发请求,获取数据
    
    2.添加属性:
        --点击添加属性按钮: 清除数据,传入c3id
        --- 在3级分类出来之前,button不可用
        ---添加页结构
        ---收集数据,(attrInfo)
                --输入属性名,添加/确定 button可用 (attrName)
                --添加button:  (attrValueList.valueName)
                            ---删除button
                --保存button:数据发送给服务器;返回到前一页,重新获取当前分类下属性列表
                --取消button: 清空退出

    3.编辑属性
        ---编辑页结构
        ---展示当前属性的数据(属性名,属性值)

    4.删除属性

 */

import cloneDeep from 'lodash/cloneDeep'
export default {
	name: 'Attr',
	data() {
		return {
			category1Id: '',
			category2Id: '',
			category3Id: '',

			//属性列表
			attrList: [],
			//展示属性列表数据
			isShowTable: true,

			//添加 | 修改属性收集的数据
			attrInfo: {
				attrName: '',
				attrValueList: [],
				categoryId: 0,
				categoryLevel: 3,
			},
		}
	},
	methods: {
		//自定义事件回调
		getCategoryId({ categoryId, level }) {
			if (level == 1) {
				this.category2Id = ''
				this.category3Id = ''
				this.category1Id = categoryId
			} else if (level == 2) {
				this.category3Id = ''
				this.category2Id = categoryId
			} else {
				//3级分类改变时,发送请求获取数据
				this.category3Id = categoryId
				this.getAttrList()
			}
		},

		//获取平台属性数据
		async getAttrList() {
			const { category1Id, category2Id, category3Id } = this
			let res = await this.$API.attr.reqAttrInfoList(
				category1Id,
				category2Id,
				category3Id
			)
			if (res.code == 200) {
				this.attrList = res.data
			}
		},

		//添加属性值按钮的回调
		addAttrValue() {
			this.attrInfo.attrValueList.push({
				attrId: this.attrInfo.id,
				valueName: '',
				flag: true,
			})
			this.$nextTick(() => {
				this.$refs[this.attrInfo.attrValueList.length - 1].focus()
			})
		},
		//添加属性按钮的回调,清空数据,传入categoryId
		addAttr() {
			this.isShowTable = false
			this.attrInfo = {
				attrName: '',
				attrValueList: [],
				categoryId: this.category3Id,
				categoryLevel: 3,
			}
		},

		//删除属性值
		deleteAttrValue(index) {
			this.attrInfo.attrValueList.splice(index, 1)
		},

		//进入查看模式
		toLook(row) {
			//检查输入属性值是否正常
			if (row.valueName.trim() == '') {
				this.$message.error('请输入一个正常的属性值')
				return
			}

			//检查是否有重复值
			let isRepeat = this.attrInfo.attrValueList.some((item) => {
				if (row !== item) {
					return row.valueName == item.valueName
				}
			})
			if (isRepeat) {
				this.$message.error('请勿输入重复值')
				return
			}

			row.flag = false
		},

		//进入编辑模式
		toEdit(row, index) {
			row.flag = true
			this.$nextTick(() => {
				this.$refs[index].focus()
			})
		},
		//修改属性按钮
		updateAttr(row) {
			this.isShowTable = false
			this.attrInfo = cloneDeep(row)
			this.attrInfo.attrValueList.forEach((item) => {

				this.$set(item, 'flag', false)
			})
		},

		//保存添加 | 修改的属性
		async addOrUpdateAttr() {
			this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
				(item) => {
					if (item.valueName != '') {
						delete item.flag
						return true
					}
				}
			)
			try {
				await this.$API.attr.reqSaveAttrInfo(this.attrInfo)

				this.isShowTable = true
				this.$message({ type: 'success', message: '保存成功' })
				this.getAttrList()
			} catch (error) {
				this.$message.error('保存失败')
			}
		},
		//删除属性
		async deleteAttr(row) {
			this.$confirm(`你确定删除${row.attrName}?`, '提示', {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async () => {
					let res = await this.$API.attr.reqDeleteAttr(row.id)
					if (res.code == 200) {
						this.$message({
							type: 'success',
							message: '删除成功!',
						})
					}
					this.getAttrList()
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

<style scoped>
</style>