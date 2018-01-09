<style lang="less">
	@import "../../styles/mixins.less";
	.page-evaluate-chart {
		.chart {
			width: 100%;
			height: 445px;
			&#evaluateChart1{
				height: 780px;
			}
		}
		.evaluation-list {
			ul {
				li {
					float: left;
					width: 100%;
					border-bottom: 1px dashed #dfdfdf;
					padding: 15px;
					.text {
						margin-left: 10px;
						width: 90%;
						h3 {
							font-size: 14px;
							color: #a3afb7;
							font-weight: normal;
						}
						p {
							font-size: 12px;
							margin-bottom: 5px;
							.text-hidden(1);
						}
					}
				}
			}
		}
	}
</style>
<template>
	<div class='page-evaluate-chart'>
		<Row :gutter="10">
			<Col span="15">
			<Card>
				<div slot="title" class="common-table-title">
					<p>评价统计</p>
					<div class="common-search-box fr">
						<DatePicker ref='DatePicker' type="daterange" :options='searchDaterangeOptions' v-model='searchDaterange' format='yyyy-MM-dd' placeholder="请输入起止日期"></DatePicker>
						<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
					</div>
				</div>
				<div class='chart' id="evaluateChart1"></div>
			</Card>
			</Col>
			<Col span="9">
			<Card>
				<div slot="title" class="common-table-title">
					<p>最新评价列表</p>
				</div>
				<div class='evaluation-list'>
					<ul class='clearfix'>
						<li>
							<Avatar class='fl' size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
							<div class="text fl">
								<p>android studio 引用库的问题</p>
								<h3>匿名用户 / 1小时前 / <Tag checkable color="blue">好评</Tag></h3>

							</div>
						</li>
						<li>
							<Avatar class='fl' size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
							<div class="text fl">
								<p>springmvc怎么访问/test/do和访问/test? </p>
								<h3>张三 / 1小时前 / <Tag checkable color="yellow">中评</Tag></h3>
							</div>
						</li>
						<li>
							<Avatar class='fl' size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
							<div class="text fl">
								<p>linux中使用java -cp 使用通配符 执行主类的main方</p>
								<h3>匿名用户 / 1小时前 / <Tag checkable color="red">差评</Tag></h3>
							</div>
						</li>
					</ul>
				</div>

			</Card>
			<Card class='margin-top-10'>
				<div slot="title" class="common-table-title">
					<p>评价占比统计</p>
				</div>
				<div class='chart' id="evaluateChart2"></div>
			</Card>
			</Col>
		</Row>
	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	import echarts from 'echarts'
	export default {
		name: 'evaluateChart',
		mixins: [mixins.searchList, ],
		components: {},
		data() {
			return {
				config: {
					url: '/guest'
				},

				//搜索字段
				searchFields: {
					guestName: ''
				},

			};
		},
		mounted() {
			this.dataChartInit1();
			this.dataChartInit2();
		},
		computed: {
			dataChart1() {
				return echarts.init(document.getElementById('evaluateChart1'));
			},
			dataChart2() {
				return echarts.init(document.getElementById('evaluateChart2'));
			}

		},
		methods: {
			searchData() {
				this.searchLoading = true;
			},
			dataChartInit1() {
				let option = {
					color: ['#2d8cf0', '#ff9900', '#ed3f14'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						data: ['好评', '中评', '差评'],

					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['2017-07-07', '2017-07-08', '2017-07-09', '2017-07-10', '2017-07-11'],
						axisLine: {
							show: false
						},
						axisTick: {
							show: false,
							alignWithLabel: true,
						},
					}],
					yAxis: [{
						type: 'value',
						name: '数量（个）',
						axisLabel: {
							formatter: '{value}'
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								opacity: 0.2
							}
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								opacity: 0.7
							}
						}
					}],
					series: [{
						name: '好评',
						type: 'bar',
						data: [20, 12, 31, 34, 31]
					}, {
						name: '中评',
						type: 'bar',
						data: [10, 20, 5, 9, 3]
					}, {
						name: '差评',
						type: 'bar',
						data: [1, 1, 2, 3, 1]
					}]
				};
				this.dataChart1.setOption(option);
			},
			dataChartInit2() {
				let option = {
					color: ['#2d8cf0', '#ff9900', '#ed3f14'],
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {

						data: ['好评', '中评', '差评']
					},
					series: [{
						name: '评价',
						type: 'pie',
						radius: '55%',
						radius: ['40%', '55%'],
						data: [{
								value: 1548,
								name: '好评'
							},
							{
								value: 310,
								name: '中评'
							},
							{
								value: 234,
								name: '差评'
							},
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};
				this.dataChart2.setOption(option);
			},

		},

	};
</script>