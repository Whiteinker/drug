<style lang="less">

</style>
<template>
	<div class='page-distri-user'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<!--<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>-->
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
				<DatePicker ref='DatePicker' type="daterange" v-model='searchDaterange' :options='searchDaterangeOptions' format='yyyy-MM-dd' placeholder="请输入起止时间"></DatePicker>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
			</div>
			<Table  class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList" @on-selection-change='tableSelectionChange'></Table>

			<div class="common-page-box">				
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<!--<Modal v-model="showFormModal" width='30%' title="配送人员详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="top" :model="formModel" :rules="formRule" inline>					
					<FormItem label="配送订单总数" prop="orderCount">
						<Input v-model="formModel.orderCount" placeholder="请输入配送订单总数"></Input>
					</FormItem>	
				</Form>
			</div>
		</Modal>-->
	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	import Cookies from "js-cookie";
	export default {
		name: 'capitalFlow',
		mixins: [mixins.searchList, mixins.tableList, mixins.page],
		components: {},
		data() {
			return {
				config: {
					url: '/documents'
				},
				//搜索字段
				
				searchFields: {
					startDate: '',
					endDate: '',
					userId: Cookies.get("id")
				},
				//表格配置
				tableFields: [ 
					// {
					// 	title: '序号',
					// 	type: 'index',
					// 	width: '65px',
					// },
					{
						title: '业务日期',
						key: 'addTime',
						width: 200
					},
					{
						title: '单据编号',
						key: 'documentsCode',
						width: 150
					},
					{
						title: '收支项目名称',
						key: 'documentsName',
						width: 200
					},
					{
						title: '收入（元）',
						key: 'revenue',
						width: 100
					},
					{
						title: '支出（元）',
						key: 'spending',
						width: 100
					},
					{
						title: '账面余额（元）',
						key: 'balance',
						width: 200
					}, {
						title: '备注',
						key: 'remark',
						align: 'left',
					
					},
				],
				//表单数据字段
				formModel: {
					"documentsCode": "",
					"documentsName": "",
					"revenue": 0,
					"spending": 0,
					"balance": 0,
					"remark": "",
				}
			};
		},
		computed: {

		},
		mounted(){
			this.getListData();
		},
		methods: {
		
			
		}

	};
</script>