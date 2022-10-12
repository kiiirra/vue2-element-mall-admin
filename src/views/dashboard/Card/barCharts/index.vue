<template>
	<div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
	name: '',
	mounted() {
		let mycharts = echarts.init(this.$refs.charts)
		mycharts.setOption({
			xAxis: {
				show: false,
				type: 'category',
			},
			yAxis: {
				show: false,
			},
			series: [
				{
					type: 'bar',
					data: [10, 2, 33, 47, 26, 48, 40, 35, 28, 9],
					color: 'cyan',
				},
			],
			//布局调试
			grid: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
			},
            tooltip:{}
		})
	},
}
</script>

<style scoped>
.charts {
	width: 100%;
	height: 100%;
}
</style>