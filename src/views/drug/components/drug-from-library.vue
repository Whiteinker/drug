<style lang="less">
</style>
<template>
	<div class='page-drug-from-library'>			
			<div class="common-search-box">
				<Input class v-model="searchFields.drugName" placeholder="请输入药品名称"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>				
			</div>
			<Table  class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList"></Table>			
			<div class="common-page-box">
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
	
	</div>
</template>
<script>
	import mixins from '@/libs/mixins.js'
	import Cookies from 'js-cookie';
	import expandRow from '@/views/drug/components/expand-row.vue';//table下拉查看详情
	export default {
		name: 'drugFromLibrary',
		mixins: [mixins.searchList, mixins.tableList, mixins.page],
		components: {
			expandRow
		},
		data() {
			return {			
				config: {
					url: '/drug'

				},
				//搜索字段
				searchFields: {
					drugName: '',
				},
				//表格配置
				tableFields: [{
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
//                  {
//						title: '序号',
//						type: 'index',
//						align: 'center',
//						width: '65px',
//					},
					{
						title: '药品图片',
						key: 'photo',
						align: 'center',
						width: '100px',
						render: (h, params) => {
							return h('Avatar', {
								props: {
									shape: 'square',
									size: "large",
									src: params.row.photo
								}
							});
						}
					},
					{
						title: '药品名称',
						key: 'drugName',
						align: 'left',
						width: '200px',
					}, {
						title: '生产商',
						key: 'manufacturer',
						align: 'left',
					},
//					{
//						title: '单价（元）',
//						width: '100px',
//						key: 'unit'
//					},
					{
						title: '操作',
						width: '100px',
						align: 'center',
						key: 'action',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										icon: 'plus-round',
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {

										}
									}
								}, '添加')

							]);
						}
					}
				]				
			};
		},
		mounted() {
		},
		computed: {

		},
		methods: {

		}

	};
</script>