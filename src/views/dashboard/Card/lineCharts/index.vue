<template>
	<div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	name: '',
	mounted() {
		// 基于准备好的dom，初始化echarts实例
		let myChart = echarts.init(this.$refs.charts)
		// 绘制图表
		myChart.setOption({
			xAxis: {
				show:false,
                type:'category',
			},
			yAxis: {
                //隐藏y轴
				show:false,
			},
			series: [
				{
					data: [10, 7, 30, 12, 50, 14, 33, 10,46],
					type: 'line',
                    //拐点样式
                    itemStyle:{
                        opacity:0,
                    },
                    lineStyle:{
                        color:'purple'
                    },
                     areaStyle :{
                         color:{
                             type:'linear',
                             x:0,
                             y:0,
                             x2:0,
                             y2:1,
                             colorStops:[
                                 {
                                     offset:0,
                                     color:'purple',
                                 },
                                 {
                                     offset:1,
                                     color:'#fff'
                                 }
                             ],
                             global:false,
                         }

                     }
				},
			],
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0,
            }
		})
	},
}
</script>

<style scoped>
.charts{
    width:100%;
    height:100%;
}
</style>