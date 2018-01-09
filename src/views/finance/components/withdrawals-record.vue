<style lang="less">
.page-withdrawals-record {
}
</style>
<template>
	<div class='page-withdrawals-record'>
		
			<Card>
				<div slot="title" class="common-table-title">
					<p>提现记录</p>
					<div class="action">
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
				</div>
				<div class="common-search-box">
					<DatePicker ref='DatePicker' type="daterange" v-model='searchDaterange' :options='searchDaterangeOptions' format='yyyy-MM-dd' placeholder="请输入起止时间"></DatePicker>
					<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
				</div>
				<Table class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList" @on-selection-change='tableSelectionChange'></Table>
				<div class="common-page-box">
					<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
				</div>
			</Card>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
export default {
  name: "withdrawalsRecord",
  mixins: [mixins.searchList, mixins.tableList, mixins.page],
  components: {},
  data() {
    return {       
      config: {
        url: "/cashManagement"
      },
      //搜索字段
      searchFields: {
        startDate: "",
        endDate: ""
      },
      //表格配置
      tableFields: [
        //					{
        //						title: '名称',
        //						key: 'userName',
        //						width: '200px'
        //					},
        {
          title: "商户订单号|交易号",
          key: "cashCode",
          width: 200
        },
        {
          title: "提现银行卡",
          key: "oppositeParty"
        },
        {
          title: "金额	|	 明细",
          key: "withdrawalsMoney"
        },
        {
          title: "状态",
          key: "state",
          width: 200,
          render: (h, params) => {
            let stateLabel = this.$store.getters.dictionaries.withdrawalsState[
              params.row.state
            ];
            return h(
              "Tag",
              {
                props: {
                  color: this.$store.state.dictionaries.withdrawalsState[
                    params.row.state - 1
                  ].color
                }
              },
              stateLabel
            );
          }
        },
        {
          title: "创建时间",
          key: "addTime",
          width: "200px"
        }
      ],
      //表单数据字段
      formModel: {
        userName: ""
      }
    };
  },
  computed: {},
  mounted() {
    this.getListData();
  },
  methods: {}
};
</script>