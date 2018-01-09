<style lang="less">
	.page-drug-chart {
		.chart {
			width: 100%;
			height: 400px;
			&#drugChart3{
				height: 500px;
			}
		}
		.ivu-card-head{
			border-bottom: none;
		}
	}
</style>
<template>
	<div class='page-drug-chart'>
		<Row :gutter="10">
			<Col span="15">
			<Card>
				<div slot="title" class="common-table-title">
					<p>药品总销售统计</p>
					<div class="common-search-box fr">
						<DatePicker  ref='DatePicker' type="daterange" :options='searchDaterangeOptions' v-model='searchDaterange' format='yyyy-MM-dd' placeholder="请输入起止日期"></DatePicker>
						<Button  type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
					</div>
				</div>
				<div class='chart' id="drugChart1"></div>
				<!--折线形-->
			</Card>
			</Col>
			<Col span="9">
			<Card>
				<div slot="title" class="common-table-title">
					<p>药品分类统计</p>
				</div>
				<div class='chart' id="drugChart2"></div>
				<!--饼形-->
			</Card>
			</Col>
		</Row>
		<Row class='margin-top-10'>
			<Col span="24">
			<Card>
				<div slot="title" class="common-table-title">
					<p>前十药单品销售统计</p>					
				</div>

				<div class='chart' id="drugChart3"></div>
				<!--柱形-->
			</Card>
			</Col>
		</Row>

	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	import echarts from 'echarts'
	export default {
		name: 'drugChart',
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
			//			for(let i=0;i<document.querySelectorAll('.chart').length;i++){
			//				document.querySelectorAll('.chart')[i].style.height=(window.innerHeight-300)/2+'px';
			//			}

			this.dataChartInit1();
			this.dataChartInit2();
			this.dataChartInit3();
		},
		computed: {
			dataChart1() {
				return echarts.init(document.getElementById('drugChart1'));
			},
			dataChart2() {
				return echarts.init(document.getElementById('drugChart2'));
			},
			dataChart3() {
				return echarts.init(document.getElementById('drugChart3'));
			},

		},
		methods: {
			searchData() {
				this.searchLoading = true;

				//				this.getListData({
				//					render: () => {
				//						this.searchLoading = false;
				//					}
				//				});
			},
			dataChartInit1() {
				let option = {
					color: ['#78d6f5'],
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ["销量", ],
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true,
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisTick:{
							show:false
						},
						axisLine:{
							show:false
						},
						splitLine:{
							lineStyle:{
								type:'dashed',
								opacity:0.7
							}
						}
					},
					yAxis: {
						name:'销售额（元）',
						type: 'value',
						axisTick:{
							show:false
						},
						axisLine:{
							show:false
						},
						splitLine:{
							lineStyle:{
								type:'dashed',
								opacity:0.7
							}
						}
					},
					series: [{
						name: '销量',
						smooth: true,
						type: 'line',
						data: [120, 132, 101, 134, 90, 230, 210],
						areaStyle: {
							normal: {
								color:'#78d6f5'
//								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//									offset: 0,
//									color: 'rgba(199, 237, 250,1)'
//								}, {
//									offset: 1,
//									color: 'rgba(199, 237, 250,0.5)'
//								}], false)
							}
						},
						itemStyle:{
							normal:{
								borderWidth:1
								
							}
						},
						lineStyle:{
							normal:{
								opacity:0
								
							}
						}
					}, ]
				};
				this.dataChart1.setOption(option);
			},
			dataChartInit2() {
				let option = {
					color: [ '#78f5d7', '#78f4f5', '#78d6f5', '#78bff5', '#7899f5'],
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {

						data: ['药品分类一', '药品分类二', '药品分类三', '药品分类四', '药品分类五']
					},
					series: [{
						name: '销量',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [{
								value: 1548,
								name: '药品分类一'
							},
							{
								value: 310,
								name: '药品分类二'
							},
							{
								value: 234,
								name: '药品分类三'
							},
							{
								value: 135,
								name: '药品分类四'
							},
							{
								value: 335,
								name: '药品分类五'
							}
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
			dataChartInit3() {
				let option = {
					color: ['#7899f5'],
					tooltip: {},
					legend: {
						data: ['销量']
					},
					grid: {
						right: '5%',
						left: '2%',
						bottom: '6%',
					},
					xAxis: {
						name:'销售额（元）',
						type: 'value',
						boundaryGap: [0, 0.01],
						axisTick:{
							show:false
						},
						axisLine:{
							show:false,
							lineStyle:{
								opacity:0.2
							}
						},
						splitLine:{
							lineStyle:{
								type:'dashed',
								opacity:0.7
							}
						}

					},
					yAxis: {
						type: 'category',
						data: ["曼秀雷敦新乐敦滴眼液", "云南白药气雾剂喷雾剂", "京都念慈菴蜜炼川贝枇杷膏", "达喜铝碳酸镁片", "艾邦医用碘伏棉球", "曼秀雷敦新乐敦滴眼液", "云南白药气雾剂喷雾剂", "京都念慈菴蜜炼川贝枇杷膏", "达喜铝碳酸镁片", "艾邦医用碘伏棉球"],
						axisLabel: {
							inside: true,
							textStyle: {
								color: '#fff'
							}
						},
						axisLine:{
							show:false
						},
						axisTick: {
							show: false,
							alignWithLabel: true,
						},
						z: 10
					},
					series: [{
						name: '销量',
						type: 'bar',
						data: [500, 700, 250, 300, 456, 500, 700, 250, 300, 456]
					}]
				};

				this.dataChart3.setOption(option);
			}
		},

	};
</script>