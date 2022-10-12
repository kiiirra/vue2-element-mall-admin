<template>
	<el-card>
		<div slot="header" class="header">

			<span>销售类别占比</span>
			<el-radio-group v-model="labelPosition" size="small">
				<el-radio-button label="全部渠道">全部渠道</el-radio-button>
				<el-radio-button label="线上">线上</el-radio-button>
				<el-radio-button label="门店">门店</el-radio-button>
			</el-radio-group>
		</div>
		<div class="main">
			<TotalCharts v-show="labelPosition === '全部渠道'"></TotalCharts>
			<OnlineCharts v-show="labelPosition === '线上'"></OnlineCharts>
		</div>
	</el-card>
</template>

<script>
import TotalCharts from './totalCharts'
import OnlineCharts from './onlineCharts'
export default {
	name: '',
	components: {
		TotalCharts,
		OnlineCharts,
	},
	data() {
		return {
			labelPosition: '全部渠道',
		}
	},
}
</script>

<style scoped>
.header {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #eee;
}
</style>