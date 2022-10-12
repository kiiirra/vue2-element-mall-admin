<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="6">
				<el-card>
					<Detail title="总销售额" count="¥ 126560">
						<template slot="charts">
							<span>
								周同比 56.67%
								<svg
									t="1649678763789"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="10176"
									width="16"
									height="16"
								>
									<path
										d="M917 211.1l-199.2 24c-6.6 0.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1c-3.1 3.1-3.1 8.2 0 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3c4.7 4.7 12.8 1.9 13.6-4.7l24-199.2c0.7-5.1-3.7-9.5-8.9-8.8z"
										p-id="10177"
										fill="#1afa29"
									></path>
								</svg>
								&nbsp;&nbsp;日同比 19.96%
								<svg
									t="1649678848091"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="10369"
									width="16"
									height="16"
								>
									<path
										d="M938.581333 812.117333l-24.746666-204.714666a8.277333 8.277333 0 0 0-13.994667-4.821334l-61.098667 61.013334-279.637333-278.698667a16.597333 16.597333 0 0 0-23.253333 0l-104.96 104.533333-285.141334-284.373333a8.277333 8.277333 0 0 0-11.648 0L87.722667 251.52a8.234667 8.234667 0 0 0 0 11.605333l331.52 330.794667c6.4 6.485333 16.938667 6.485333 23.338666 0l104.917334-104.533333 232.96 232.277333-61.098667 60.970667a8.234667 8.234667 0 0 0 4.864 13.952l205.312 24.661333a8.106667 8.106667 0 0 0 9.045333-9.130667z"
										p-id="10370"
										fill="#d81e06"
									></path>
								</svg>
							</span>
						</template>
						<template slot="footer">
							<span> 日销售额 ¥ 12342 </span>
						</template>
					</Detail>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card>
					<Detail title="访问量" count="88460">
						<template slot="charts">
							<LineCharts></LineCharts>
						</template>
						<template slot="footer"
							><span> 日访问量 1234</span>
						</template>
					</Detail>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card>
					<Detail title="支付笔数" count="88460">
						<template slot="charts">
							<BarCharts></BarCharts>
						</template>
						<template slot="footer">
							<span> 转换率 64%</span>
						</template>
					</Detail>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card>
					<Detail title="运营活动效果" count="78%">
						<template slot="charts">
							<ProgressCharts></ProgressCharts>
						</template>
						<template slot="footer">
							<span>
								周同比 56.67%
								<svg
									t="1649678763789"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="10176"
									width="16"
									height="16"
								>
									<path
										d="M917 211.1l-199.2 24c-6.6 0.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1c-3.1 3.1-3.1 8.2 0 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3c4.7 4.7 12.8 1.9 13.6-4.7l24-199.2c0.7-5.1-3.7-9.5-8.9-8.8z"
										p-id="10177"
										fill="#1afa29"
									></path>
								</svg>
								&nbsp;&nbsp;日同比 19.96%
								<svg
									t="1649678848091"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="10369"
									width="16"
									height="16"
								>
									<path
										d="M938.581333 812.117333l-24.746666-204.714666a8.277333 8.277333 0 0 0-13.994667-4.821334l-61.098667 61.013334-279.637333-278.698667a16.597333 16.597333 0 0 0-23.253333 0l-104.96 104.533333-285.141334-284.373333a8.277333 8.277333 0 0 0-11.648 0L87.722667 251.52a8.234667 8.234667 0 0 0 0 11.605333l331.52 330.794667c6.4 6.485333 16.938667 6.485333 23.338666 0l104.917334-104.533333 232.96 232.277333-61.098667 60.970667a8.234667 8.234667 0 0 0 4.864 13.952l205.312 24.661333a8.106667 8.106667 0 0 0 9.045333-9.130667z"
										p-id="10370"
										fill="#d81e06"
									></path>
								</svg>
							</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Detail from './Detail'
import LineCharts from './lineCharts'
import BarCharts from './barCharts'
import ProgressCharts from './progressCharts'
export default {
	name: '',
	components: {
		Detail,
		LineCharts,
		BarCharts,
		ProgressCharts,
	},
}
</script>

<style lang='less' scoped>
</style>