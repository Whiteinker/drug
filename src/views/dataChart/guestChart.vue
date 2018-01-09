<style lang="less">
	.page-guest-chart {
		.chart {
			width: 100%;
			height: 650px;
		}
		.ivu-card-head {
			border-bottom: none;
		}
		.infor-card-con {
			height: 150px!important;
			.ivu-icon {
				font-size: 50px!important;
			}
			.infor-card-count {
				p {
					font-size: 38px!important;
					&.infor-intro-text {
						font-size: 16px!important;
					}
				}
			}
		}
	}
</style>
<template>
	<div class='page-guest-chart'>
		<Row>
			<Col span="8">
			<infor-card id-name="user_created_count" :end-val="guestCount.createUser" iconType="android-person-add" color="#2d8cf0" intro-text="今日新增用户"></infor-card>
			</Col>
			
			<Col span="8" class-name="padding-left-5">
			<infor-card id-name="collection_count" :end-val="guestCount.collection" iconType="android-person" color="#ffd572" intro-text="今日老客户"></infor-card>
			</Col>
			<Col span="8" class-name="padding-left-5">
			<infor-card id-name="visit_count" :end-val="guestCount.visit" iconType="ios-eye" color="#64d572" :iconSize="50" intro-text="今日访客"></infor-card>
			</Col>
			<!--<Col span="6" class-name="padding-left-5">
			<infor-card id-name="transfer_count" :end-val="count.transfer" iconType="shuffle" color="#f25e43" intro-text="今日服务调用量"></infor-card>
			</Col>-->
		</Row>
		<Row class='margin-top-10'>
			<Col span="24">
			<Card>
				<div slot="title" class="common-table-title">
					<p>客户增长统计</p>
					<div class="common-search-box fr">
						<DatePicker ref='DatePicker' type="daterange" placement='bottom-end' :options='searchDaterangeOptions' v-model='searchDaterange' format='yyyy-MM-dd' placeholder="请输入起止日期"></DatePicker>
						<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
					</div>
				</div>
				<div class='chart' id="guestChart1"></div>
			</Card>
			</Col>
		</Row>
	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	import echarts from 'echarts'
	import inforCard from '@/components/inforCard.vue';
	export default {
		name: 'guestChart',
		mixins: [mixins.searchList, ],
		components: {
			inforCard
		},
		data() {
			return {
				guestCount: {
					createUser: 496,
					visit: 200,
					collection: 22,
					transfer: 60
				},
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
		},
		computed: {
			dataChart1() {
				return echarts.init(document.getElementById('guestChart1'));
			}

		},
		methods: {
			searchData() {
				this.searchLoading = true;
			},
			dataChartInit1() {
				let option = {
					color: ['#7dd3ae'],
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ["销量", ],
					},
					grid: {
						left: '3%',
						right: '3%',
						bottom: '3%',
						containLabel: true,
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								opacity: 0.7
							}
						}
					},
					yAxis: {
						name: '个数（人）',
						type: 'value',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								opacity: 0.7
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
								color: '#7dd3ae'								
							}
						},
						itemStyle: {
							normal: {
								borderWidth: 1

							}
						},
						lineStyle: {
							normal: {
								opacity: 0

							}
						}
					}, ]
				};
				this.dataChart1.setOption(option);
			},

		},

	};
</script>