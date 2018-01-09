<style lang="less"></style>
<template>
	<div class='page-distri-record'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
				<Input class v-model="searchFields.guestName" placeholder="请输入客户姓名"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
			</div>
			<!--<Table border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList"></Table>-->
			<div class="common-page-box">
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal v-model="showFormModal" width='50%' title="配送记录详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="top" :model="formModel" :rules="formRule" inline>
					<FormItem label="姓名" prop="guestName" style='width:20%;'>
						<Input v-model="formModel.guestName" placeholder="请输入姓名"></Input>
					</FormItem>
					<FormItem label="手机" prop="guestMobile" style='width:20%;'>
						<Input v-model="formModel.guestMobile" placeholder="请输入手机"></Input>
					</FormItem>
					<FormItem label="地址" prop="address" style='width:100%;'>
						<Input v-model="formModel.address" placeholder="请输入地址"></Input>
					</FormItem>

				</Form>
			</div>
		</Modal>
	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	export default {
		name: 'distriRecord',
		mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
		components: {},
		data() {
			return {
				config: {
					url: '/distriRecord'
				},
				//搜索字段
				searchFields: {
					storeName: ''
				},
				//表格配置
				tableFields: [{
						title: '序号',
						type: 'index',
						width: '65px',
					},
					{
						title: '姓名',
						key: 'guestName',
						width: '150px',
					}, {
						title: '手机',
						key: 'guestMobile',
						width: '150px',
					},
					{
						title: '地址',
						key: 'address',
						align: 'left'
					},
					{
						title: '操作',
						width: '200px',
						align: 'center',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										icon: 'compose',
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.openFormModal({
												id: params.row.id
											})
										}
									}
								}, '编辑'),
								h('Poptip', {
									props: {
										confirm: true,
										title: '您确定要删除这条数据吗?',
										transfer: true
									},
									on: {
										'on-ok': () => {
											this.deleteListData({
												id: params.row.id
											});
										}
									}

								}, [h('Button', {
									props: {
										icon: 'trash-a',
										type: 'error',
										size: 'small'
									}
								}, '删除')])

							]);
						}
					}
				],
				//表单数据字段
				formModel: {
					"orderId": 0,
					"distriUserId": 0,
					"processNode": "",
					"gpsCoordinate": "",
					"remark": ""
				}
			};
		},
		computed: {},
		methods: {

		}

	};
</script>