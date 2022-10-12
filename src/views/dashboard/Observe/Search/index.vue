<template>
	<el-card>
		<div slot="header">
			<div class="search-header">
				<span>线上热门搜索</span>
				<el-dropdown>
					<span class="el-dropdown-link">
						<i class="el-icon-more"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>黄金糕</el-dropdown-item>
						<el-dropdown-item>狮子头</el-dropdown-item>
						<el-dropdown-item>螺蛳粉</el-dropdown-item>
						<el-dropdown-item disabled>双皮奶</el-dropdown-item>
						<el-dropdown-item divided>蚵仔煎</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<div class="search-charts">
			<el-row :gutter="10">
				<el-col :span="12">
					<LineCharts></LineCharts>
				</el-col>
				<el-col :span="12">
					<LineCharts></LineCharts>
				</el-col>
			</el-row>

			<el-table :data="data" style="width: 100%" border>
				<el-table-column
					prop="prop"
					label="排名"
					width="50"
					type="index"
				>
				</el-table-column>
				<el-table-column prop="prop" label="搜索关键字" width="width">
				</el-table-column>
				<el-table-column
					prop="prop"
					label="用户数"
					width="width"
					sortable
				>
				</el-table-column>
				<el-table-column
					prop="prop"
					label="周涨幅"
					width="width"
					sortable
				>
				</el-table-column>
			</el-table>

			<el-pagination
				layout="prev, pager, next"
				:total="1000"
				class="pagination"
			>
			</el-pagination>
		</div>
	</el-card>
</template>

<script>
import LineCharts from './lineCharts'
export default {
	name: '',
	data() {
		return {
			data: [{}],
		}
	},
	components: {
		LineCharts,
	},
}
</script>

<style  scoped>
.search-header {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #eee;
	padding: 5px 0;
}
.search-charts {
	margin-top: 10px;
}
.pagination {
	float: right;
}
</style>