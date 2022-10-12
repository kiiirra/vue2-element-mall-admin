<template>
	<div>
		<el-table style="width: 100%" border :data="skuList">
			<el-table-column type="index" prop="prop" label="序号" width="80">
			</el-table-column>
			<el-table-column width="width" prop="skuName" label="名称">
			</el-table-column>
			<el-table-column width="width" prop="skuDesc" label="描述">
			</el-table-column>
			<el-table-column width="110" prop="prop" label="默认图片">
				<template slot-scope="{ row, $index }">
					<img
						:src="row.skuDefaultImg"
						style="width: 80px; hieght: 80px"
					/>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="weight" label="重量">
			</el-table-column>
			<el-table-column width="80" prop="price" label="价格">
			</el-table-column>
			<el-table-column width="width" prop="prop" label="操作">
				<template slot-scope="{ row, $index }">
					<hint-button
						type="success"
						icon="el-icon-sort-up"
						title="下架"
						v-if="row.isSale"
						size="mini"
						@click="cancel(row)"
					></hint-button>
					<hint-button
						type="success"
						icon="el-icon-sort-down"
						title="上架"
						v-else
						size="mini"
						@click="sale(row)"
					></hint-button>
					<hint-button
						type="primary"
						icon="el-icon-edit"
						title="修改sku"
						size="mini"
					></hint-button>
					<hint-button
						type="info"
						icon="el-icon-info"
						title="查看sku信息"
						size="mini"
						@click="getSkuById(row)"
					></hint-button>
					<hint-button
						type="danger"
						icon="el-icon-delete"
						title="删除sku"
						size="mini"
						@click="deleteSku(row)"
					></hint-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page"
			:page-sizes="[10, 20, 50]"
			:page-size="limit"
			layout=" prev, pager, next, jumper,->,sizes,total"
			:total="total"
            align="center"
            style="margin:20px 0"
		>
		</el-pagination>

		<!-- 展示sku信息 -->
		<el-drawer :visible.sync="drawer" size="50%" :show-close="false">
			<el-row>
				<el-col :span="5">名称</el-col>
				<el-col :span="16">{{ sku.skuName }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">描述</el-col>
				<el-col :span="16">{{ sku.skuDesc }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">价格</el-col>
				<el-col :span="16">{{ sku.price }}元</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">平台属性</el-col>
				<el-col :span="16">
					<template>
						<el-tag
							v-for="(attr, index) in sku.skuAttrValueList"
							:key="attr.id"
							type="success"
							style="margin: 0 5px 0 0"
						>
							{{ attr.valueName }}
						</el-tag>
					</template>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">图片</el-col>
				<el-col :span="10">
					<template>
						<el-carousel trigger="click" height="300px">
							<el-carousel-item v-for="(image ,index) in sku.skuImageList" :key="image.id">
								<img :src="image.imgUrl">
							</el-carousel-item>
						</el-carousel>
					</template>
				</el-col>
			</el-row>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: 'Sku',
	data() {
		return {
			page: 9,
			limit: 10,
			total: 0, //总条数
			//接收获取的sku列表数据
			skuList: [],
			//sku详细信息
			sku: {},

			drawer: false,
		}
	},
	mounted() {
		this.getSkuList()
	},
	methods: {
		async getSkuList() {
			const { limit, page } = this
			let result = await this.$API.sku.reqGetSkuList(page, limit)
			console.log(result)
			if (result.code == 200) {
				this.skuList = result.data.records
				this.total = result.data.total
			}
		},
		//当前页改变page
		handleCurrentChange(page) {
			this.page = page
			this.getSkuList()
		},
		//改变limit
		handleSizeChange(limit) {
			this.limit = limit
			this.getSkuList()
		},
		//上架
		async sale(row) {
			try {
				await this.$API.sku.reqOnSale(row.id)
				row.isSale = 1
				this.$message({ type: 'success', message: '上架成功' })
			} catch (error) {
				this.$message.error('上架失败')
			}
		},
		//下架
		async cancel(row) {
			try {
				await this.$API.sku.reqCancelSale(row.id)
				row.isSale = 0
				this.$message({ type: 'success', message: '下架成功' })
			} catch (error) {
				this.$message.error('下架失败')
			}
		},
		//展示sku信息
		async getSkuById(row) {
			this.drawer = true
			let result = await this.$API.sku.reqGetSkuById(row.id)
			if (result.code == 200) {
				this.sku = result.data
			}
		},

		//删除sku
		async deleteSku(row) {
			try {
				await this.$API.sku.reqDeleteSku(row.id)
				this.getSkuList(
					this.skuList.length > 1 ? this.page : this.page - 1
				)
				this.$message({ type: 'success', message: '删除成功' })
			} catch (error) {
				this.$message.error('删除失败')
			}
		},
	},
}
</script>

<style>
.el-carousel{
    background: white;
}
.el-carousel__item img {
    height: 300px;
    width: 300px;
    
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
	font-size: 18px;
	text-align: right;
}
.el-col {
	margin: 10px 10px;
}

:deep().el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  }
</style>
