<template>
	<div>
		<div class="charts" ref="charts"></div>
	</div>
</template>

<script>
import echarts from 'echarts'
export default {
	name: '',
	mounted() {
        let mychart = echarts.init(this.$refs.charts)
		mychart.setOption({
			title: {
				text: '视频',
				subtext: 1048,
				left: 'center',
				top: 'center',
			},
			tooltip: {
				trigger: 'item',
			},
			series: [
				{
					name: 'Access From',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2,
					},
					label: {
						show: true,
						position: 'outsize',
					},
					labelLine: {
						show: true,
					},
					data: [
						{ value: 1048, name: '视频' },
						{ value: 735, name: 'Direct' },
						{ value: 580, name: 'Email' },
						{ value: 484, name: 'Union Ads' },
						{ value: 300, name: 'Video Ads' },
					],
				},
			],
		})
		//绑定事件

		mychart.on('mouseover', (params) => {
			//获取鼠标移上去那条数据
			const { name, value } = params.data
			//重新设置标题
			mychart.setOption({
				title: {
					text: name,
					subtext: 'value',
				},
			})
		})
	},
}
</script>

<style scoped>
.charts {
	width: 100%;
	height: 300px;
}
</style>