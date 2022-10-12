<template>
	<el-card class="box-card">
		<div slot="header" class="header">
			<el-tabs class="tab" v-model="activeName">
				<el-tab-pane label="销售额" name="sale"></el-tab-pane>
				<el-tab-pane label="访问量" name="visit"></el-tab-pane>
			</el-tabs>
			<div class="right">
				<span @click="setDay">今日</span>
				<span @click="setWeek">本周</span>
				<span @click="setMonth">本月</span>
				<span @click="setYear">本年</span>
				<el-date-picker
					v-model="date"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					class="date"
				>
				</el-date-picker>
			</div>
		</div>
		<div>
			<el-row :gutter="10">
				<el-col :span="18">
					<div class="charts" ref="charts"></div>
				</el-col>
				<el-col :span="6" class="right">
					<h3>门店{{title}}排名</h3>
					<ul>
						<li>
							<span class="rindex">1</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span class="rindex">2</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span class="rindex">3</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>4</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>5</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
						<li>
							<span>6</span>
							<span>肯德基</span>
							<span class="rvalue">123456</span>
						</li>
					</ul>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
	name: '',
	data() {
		return {
			activeName: 'sale',
			date: [],
			mycharts: null,
		}
	},
	computed: {
		title() {
			return this.activeName == 'sale' ? '销售额' : '访问量'
		},
		...mapState({
			listState: (state) => state.home.list,
		}),
	},
	mounted() {
		this.mycharts = echarts.init(this.$refs.charts)
		this.mycharts.setOption({
			title: {
				text: this.title + '趋势',
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: [
				{
					type: 'category',
					data: [],
					axisTick: {
						alignWithLabel: true,
					},
				},
			],
			yAxis: [
				{
					type: 'value',
				},
			],
			seris: [
				{
					name: 'Direct',
					type: 'bar',
					barWidth: '60%',
					data: [34, 28, 19, 35, 42, 25, 58, 39, 23, 10, 98],
					color: 'cyan',
				},
			],
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
		})
	},
	watch: {
		//更改访问量/销售额 配置数据
		title() {
			console.log('修改配置数据')
			//重新修改图标的配置数据
			//图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
			this.mycharts.setOption({
				title: {
					text: this.title,
				},
				xAxis: {
					data:
						this.title == '销售额'
							? this.listState.orderFullYearAxis
							: this.listState.userFullYearAxis,
				},
				series: [
					{
						name: 'Direct',
						type: 'bar',
						barWidth: '60%',
						data:
							this.title == '销售额'
								? this.listState.orderFullYear
								: this.listState.userFullYear,
						color: 'yellowgreen',
					},
				],
			})
		},
		listState() {
			this.mycharts.setOption({
				title: {
					text: this.title + '趋势',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						data: this.listState.orderFullYearAxis,
						axisTick: {
							alignWithLabel: true,
						},
					},
				],
				yAxis: [
					{
						type: 'value',
					},
				],
				series: [
					{
						name: 'Direct',
						type: 'bar',
						barWidth: '60%',
						data: this.listState.orderFullYear,
						color: 'yellowgreen',
					},
				],
			})
		},
	},
	methods: {
		setDay() {
			const day = dayjs().format('YYYY-MM-DD')
			this.date = [day, day]
		},
		//本周
		setWeek() {
			const start = dayjs().day(1).format('YYYY-MM-DD')
			const end = dayjs().day(7).format('YYYY-MM-DD')
			this.date = [start, end]
		},
		setMonth() {
			const start = dayjs().startOf('month').format('YYYY-MM-DD')
			const end = dayjs().endOf('month').format('YYYY-MM-DD')
			this.date = [start, end]
		},
        setYear(){
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
			const end = dayjs().endOf('year').format('YYYY-MM-DD')
			this.date = [start, end]
        }
	},
}
</script>

<style  scoped>
.box-card {
	margin: 10px 0;
}
.header {
	position: relative;
	display: flex;
	justify-content: space-between;
}
.tab {
	width: 100%;
}
.right {
	position: absolute;
	right: 0;
}
.right span {
	margin: 0 10px;
}
.date {
	width: 250px;
	margin: 0 20px;
}
ul {
	list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
}
ul li{
    margin: 10px 0;
    height: 8%;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
.charts {
	width: 100%;
	height: 300px;
}
</style>