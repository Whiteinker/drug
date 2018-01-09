<style lang="less">
</style>
<template>
	<div class='page-guest'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<!--<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>-->
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
				
				<Select ref='asyncSelectStore' transfer v-model="searchFields.storeId" placeholder="请选择药店" filterable  @on-change='getListData'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>
						<Input v-model="searchFields.guestName" placeholder="请输入客户姓名"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
			</div>
			<Table border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList"></Table>
			<div class="common-page-box">
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal v-model="showFormModal" width='50%' title="客户信息详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="right" :label-width="60" :model="formModel" :rules="formRule" inline>					
					<FormItem label="姓名：" prop="guestName" >
						<Input v-model="formModel.guestName" placeholder="请输入姓名"></Input>
					</FormItem>
					<FormItem label="手机：" prop="guestMobile" >
						<Input v-model="formModel.guestMobile" placeholder="请输入手机"></Input>
					</FormItem>
					<FormItem label="地址：" prop="address" style='width:95%;'>
						<Input v-model="formModel.address" placeholder="请输入地址"></Input>
					</FormItem>							
				</Form>				
			</div>
		</Modal>
		<Modal class='common-see-modal' v-model="showSeeFormModal" width='20%' title="客户信息详情" @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form   label-position="right" :label-width="60" :model="formModel">					
					<FormItem label="姓名：">
						<span>{{formModel.guestName}}</span>
					</FormItem>
					<FormItem label="手机：" >
						<span>{{formModel.guestMobile}}</span>
						</FormItem>		
					<FormItem label="地址：" style='width:95%;'>
							<span>{{formModel.address}}</span>
					</FormItem>							
				</Form>					
			</div>
		</Modal>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
export default {
  name: "guest",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {},
  data() {
    return {
      config: {
        url: "/guest",
        pageSize: 2
      },
      //搜索字段
    searchFields:{
        guestName: "",
        userId: Cookies.get("id"),
        storeId: Store.get('cacheStore')[0].value,
      },
      //表格配置
      tableFields: [
        {
          title: "序号",
          type: "index",
          width: 65
        },
        {
          title: "姓名",
          key: "guestName",
          width: 150
        },
        {
          title: "手机",
          key: "guestMobile",
          width: 150
        },
        {
          title: "地址",
          key: "address",
          align: "left"
        },
        {
          title: "总订单数",
          key: "totalOrder",
          width: 100
        },
        {
          title: "最后下单时间",
          key: "orderLastTime",
          width: 150
        },
        {
          title: "操作",
          width: 100,
          align: "center",
          key: "action",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    icon: "eye",
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openSeeFormModal({
                        id: params.row.id
                      });
                    }
                  }
                },
                "查看"
              )
              //								h('Poptip', {
              //									props: {
              //										confirm: true,
              //										title: '您确定要删除这条数据吗?',
              //										transfer: true
              //									},
              //									on: {
              //										'on-ok': () => {
              //											this.deleteListData({
              //												id: params.row.id
              //											});
              //										}
              //									}
              //
              //								}, [h('Button', {
              //									props: {
              //										icon: 'trash-a',
              //										type: 'error',
              //										size: 'small'
              //									}
              //								}, '删除')])
            ]);
          }
        }
      ],
      //表单数据字段
      formModel: {
        guestName: "",
        guestMobile: "",
        lastAdd: "",
        address: "",
        storeId: "",
        userId: Cookies.get("id")
      }
    };
  },
  computed: {
    
  },
  mounted() {
   this.getListData();
  },
  methods: {}
};
</script>