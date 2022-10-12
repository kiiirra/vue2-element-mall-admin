<template>
	<div>
		<el-card style="margin-bottom: 20px">
			<CategorySelect @getCategoryId="getCategoryId" :show="!scene == 0"></CategorySelect>
		</el-card>
		<el-card>
			<!-- spu列表展示 -->
			<div v-show="scene == 0">
				<el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" @click="addSpu"
					:disabled="!category3Id">添加SPU</el-button>
				<el-table style="width: 100%" border :data="spuList">
					<el-table-column type="index" prop="prop" label="序号" width="80" align="center">
					</el-table-column>
					<el-table-column prop="spuName" label="SPU名称" width="width">
					</el-table-column>
					<el-table-column prop="description" label="SPU描述" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
								@click="addSku(row)"></hint-button>
							<hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
								@click="updateSpu(row)"></hint-button>
							<hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"
								@click="handle(row)"></hint-button>
							<el-popconfirm :title="`确定删除${row.spuName}吗?`" @onConfirm="deleteSpu(row)">
								<hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"
									slot="reference"></hint-button>
							</el-popconfirm>

						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="getSpuList" :current-page="page"
					:page-sizes="[3, 5, 7]" :page-size="limit" layout=" prev, pager, next, jumper,->,sizes, total"
					:total="total">
				</el-pagination>
			</div>
			<!-- 展示 添加 | 编辑 spu 页面结构 -->
			<SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene"></SpuForm>
			<!-- 添加 sku -->
			<SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene"></SkuForm>
		</el-card>
		<el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" width="width"
			:before-close="close">
			<el-table style="width: 100%" :data="skuList" v-loading="loading">
				<el-table-column prop="skuName" label="名称" width="width">
				</el-table-column>
				<el-table-column prop="price" label="价格" width="width">
				</el-table-column>
				<el-table-column prop="weight" label="重量" width="width">
				</el-table-column>
				<el-table-column prop="prop" label="默认图片" width="width">
					<template slot-scope="{row , $index}">
						<img :src="row.skuDefaultImg" style="width:100px;height:100px">
					</template>
				</el-table-column>

			</el-table>

		</el-dialog>
	</div>
</template>

<script>
/* 
**  结构:(三种状态切换) scene = 0 | 1 | 3  
		---spu列表展示(请求列表数据)
		--- 添加 | 编辑 spu (保存spu数据)
		--- 添加 sku

	添加 | 编辑 spu (保存spu数据)
		---接口: 
				1.展示数据 当前row的数据;品牌数据;图片数据;销售属性数据;
				2.保存,传递的数据格式
*/

import SkuForm from './skuForm'
import SpuForm from './spuForm'
export default {
	name: 'Spu',
	components: {
		SpuForm,
		SkuForm,
	},
	data() {
		return {
			category1Id: '',
			category2Id: '',
			category3Id: '',
			isShowTable: true,
			//切换三种状态展示
			scene: 0,

			//当前页
			page: 1,
			//每页显示条数
			limit: 5,
			//总条数
			total: 0,
			//spu列表数据
			spuList: [],

			//sku列表弹出框
			dialogTableVisible: false,

			spu: {},
			skuList: [],
			loading: true
		}
	},
	methods: {
		//获取子组件传过来的categoryid
		getCategoryId({ categoryId, level }) {
			if (level == 1) {
				this.category1Id = categoryId
				this.category2Id = ''
				this.category3Id = ''
			} else if (level == 2) {
				this.category2Id = categoryId
				this.category3Id = ''
			} else {
				this.category3Id = categoryId
				this.getSpuList()
			}
		},
		//获取spu列表
		async getSpuList(pages = 1) {
			this.page = pages
			const { page, limit, category3Id } = this

			let res = await this.$API.spu.reqSpuList(page, limit, category3Id)
			if (res.code == 200) {
				this.spuList = res.data.records
				this.total = res.data.total
			}
		},
		//改变每页显示条数
		handleSizeChange() {
			this.limit = limit
			this.getSpuList()
		},
		//添加SPU按钮回调
		addSpu() {
			this.scene = 1
			this.$refs.spu.getAddSpuInfo(this.category3Id)
		},

		//修改SPU按钮回调
		updateSpu(row) {
			this.scene = 1
			this.$refs.spu.getSpuInfo(row)
		},

		//添加sku按钮回调,要把cid3传过去
		addSku(spu) {
			this.scene = 2
			this.$refs.sku.getData(this.category1Id, this.category2Id, spu)

		},
		//自定义事件回调spuForm 
		changeScene({ scene, flag }) {
			this.scene = scene
			if (flag == "修改" || flag == "添加SKU") {
				this.getSpuList(this.page)
			} else {
				this.getSpuList()
			}


		},
		//删除spu
		async deleteSpu(row) {
			try {
				await this.$API.spu.reqDeleteSpuById(row.id)
				this.$message({ type: 'success', message: '删除成功' })
				this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
			} catch (error) {
				this.$message.error(error.message)
			}
		},
		//点击查看当前spu的sku列表按钮
		async handle(spu) {
			this.dialogTableVisible = true
			this.spu = spu
			let res = await this.$API.spu.reqSkuInfoBySpuId(spu.id)
			if (res.code == 200) {
				this.skuList = res.data
				this.loading = false

			}


		},
		//关闭列表
		close(done) {
			this.skuList = []
			this.loading = true

			done();
		}
	},
}
</script>

<style scoped>

</style>