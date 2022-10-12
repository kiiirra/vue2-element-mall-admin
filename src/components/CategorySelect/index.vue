<template>
	<div>
		<!-- inline 属性可以让表单域变为行内的表单域 -->
		<el-form :inline="true" class="demo-form-inline" :model="cForm">
			<el-form-item label="一级分类">
				<el-select
					placeholder="请选择"
					v-model="cForm.category1Id"
					@change="handler1"
					:disabled="show"
				>
					<el-option
						:label="c1.name"
						:value="c1.id"
						v-for="(c1, index) in list1"
						:key="c1.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="二级分类">
				<el-select
					placeholder="请选择"
					v-model="cForm.category2Id"
					@change="handler2"
					:disabled="show"
				>
					<el-option
						:label="c2.name"
						:value="c2.id"
						v-for="(c2, index) in list2"
						:key="c2.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="三级分类">
				<el-select
					placeholder="请选择"
					v-model="cForm.category3Id"
					@change="handler3"
					:disabled="show"
				>
					<el-option
						:label="c3.name"
						:value="c3.id"
						v-for="(c3, index) in list3"
						:key="c3.id"
					></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
/*
 * 属性1,2,3级 分类菜单
 *   1.页面挂载时,需要获取 1级分类并显示,并清空2,3 级显示内容
 *   2. 当选择了 1级分类(change)时,获取2级分类(存储c2id,发请求),清空3级显示内容
 *   3. 当选择了 2级分类(change)时,获取3级分类(存储c3id)
 *   4.  3级change时,发送请求,获取属性列表数据(c1id,c2id,c3id)
 */

export default {
	name: 'CategorySelect',
	props: ['show'],
	data() {
		return {
			//1,2,3级列表数据
			list1: [],
			list2: [],
			list3: [],

			cForm: {
				category1Id: '',
				category2Id: '',
				category3Id: '',
			},
		}
	},
	mounted() {
		this.getCategory1List()
	},
	methods: {
		//获取1级分类
		async getCategory1List() {
			let res = await this.$API.attr.reqCategory1List()
			if (res.code == 200) {
				this.list1 = res.data
			}
		},
		//当1级分类选择变化时,获取2级分类,并清空之前的2,3级分类值
		async handler1() {
			this.list2 = []
			this.list3 = []
			this.cForm.category2Id = ''
			this.cForm.category3Id = ''
			const { category1Id } = this.cForm
			this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
			let res = await this.$API.attr.reqCategory2List(category1Id)
			if (res.code == 200) {
				this.list2 = res.data
			}
		},

		//当2级分类选择变化时,获取3级分类
		async handler2() {
			this.list3 = []
			this.cForm.category3Id = ''
			const { category2Id } = this.cForm
			this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
			let res = await this.$API.attr.reqCategory3List(category2Id)
			if (res.code == 200) {
				this.list3 = res.data
			}
		},
		//当3级分类选择变化时,获取属性列表,传给父组件attr
		async handler3() {
			const { category3Id } = this.cForm
			this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
		},
	},
}
</script>

<style lang='less' scoped>
</style>