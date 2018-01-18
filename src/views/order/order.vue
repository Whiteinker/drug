<style lang="less">
.page-order-modal {
  .common-form-box {
    .ivu-form-item {
      display: inline-block;
      width: 44%;
      margin-bottom: 5px;
      label.ivu-form-item-label {
        font-size: 14px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  .total-box {
    margin-top: 10px;
    text-align: right;
    b {
      margin-left: 5px;
      span {
        font-size: 12px;
      }
      font-size: 18px;
      color: red;
    }
  }
  .ivu-modal-footer {
    display: none;
  }
  .btn-group {
    text-align: center;
    margin-top: 20px;
  }
}
.distri-user-modal {
  .distri-user-card {
    .ivu-card {
      width: 120px;
      display: inline-block;
      margin-left: 24px;
      margin-bottom: 24px;
      .ivu-card-body {
        padding: 10px;
      }
      &:hover {
        .btn-group {
          opacity: 1;
        }
      }
      .img {
        /*float: left;*/
        border-radius: 5px;
        overflow: hidden;
        width: 100%;
        height: 120px;
        margin: 0 auto;
      }
      .text {
        /*float: right;*/
        text-align: center;
        h3 {
          font-size: 14px;
          margin: 5px 0;
        }
        p.orderCount {
          font-size: 12px;
        }
      }
    }
    .btn-group {
      opacity: 0;
      background: rgba(0, 0, 0, 0.45);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
      transition: all 0.2s;
      button,
      .ivu-poptip {
        top: 50%;
        position: relative;
      }
      .ivu-poptip:hover .btn-group {
        opacity: 1;
      }
    }
  }
  .ivu-modal-footer {
    display: none;
  }
}
</style>
<template>
	<div class='page-order'>
   
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
         <Select ref='asyncSelectStore' transfer v-model='searchFields.storeId'  placeholder="请选择药店" filterable  @on-change='getListData'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
				</Select>
				<Input v-model="searchFields.orderCode" placeholder="请输入完整订单号"></Input>
				<Input v-model="searchFields.guestName" placeholder="请输入收货人姓名"></Input>       
				<DatePicker ref='DatePicker' type="daterange" v-model='searchDaterange' :options='searchDaterangeOptions' format='yyyy-MM-dd' placeholder="请输入订单起止时间"></DatePicker>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
			</div>
			<Tabs v-model='searchFields.state' class='margin-top-20' @on-click='getListData'>
				<TabPane label="全部订单" name="0"></TabPane>
				<TabPane v-for='t in $store.state.dictionaries.orderState' :label="t.label" :name="t.value.toString()"></TabPane>
			</Tabs>
			<Table border :loading="tableLoading" :columns="tableFields" :data="tableList"></Table>
			<div class="common-page-box">
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal class='page-order-modal' v-model="showFormModal" width='50%' title="订单详情">
			<div class='common-form-box' style='margin-left:0'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Steps :current="formModel.state-1" :status='stepsStatus' style='margin-bottom: 40px;margin-top:20px;margin-left:20px;'>
          <Step v-for='t in $store.state.dictionaries.orderState' :title="t.label" ></Step>				
				</Steps>
				<Form ref="formModel" :label-width="100" :model="formModel">
					<Alert>
						<FormItem label="订单号：">
							<span>{{formModel.orderCode}}</span>
						</FormItem>
						<FormItem label="订单状态：">
							<Tag color="default">{{$store.getters.dictionaries.orderState[formModel.state]}}</Tag>
						</FormItem>
            	<FormItem label="药店名称：">
							<span>{{formModel.storeName}}</span>
						</FormItem>
						<FormItem label="下单时间：">
							<span>{{formModel.addTime}}</span>
						</FormItem>
						<FormItem label="配送时间：">
							<span>{{formModel.distriTime}}</span>
						</FormItem>
						<FormItem label="送达时间：">
							<span>{{formModel.deliveryTime}}</span>
						</FormItem>
					
						<FormItem label="收货人：">
							<span>{{formModel.orderUserName}}</span>
						</FormItem>
						<FormItem label="收货人手机：">
							<span>{{formModel.orderUserPhone}}</span>
						</FormItem>
						<FormItem label="收货地址：" style='display: block;width:100%'>
							<span>{{formModel.address}}</span>
						</FormItem>
						<FormItem label="备注：" style='display: block;width:100%'>
							<span>{{formModel.remark}}</span>
						</FormItem>
						<FormItem label="配送员：">
							<span>{{formModel.distriUserName}}</span>
						</FormItem>
						<FormItem label="配送员手机：">
							<span>{{formModel.distriUserPhone}}</span>
						</FormItem>

					</Alert>
					<Table border class="margin-top-10" :columns="drugTableFields" :data="formModel.orderDetail" height='200'></Table>
					<div class="total-box">
						总金额
						<b><span>￥</span>{{formModel.totalPrice}}</b>
					</div>
				</Form>
        <div class='btn-group' slot='footer'>
             <Button v-if='formModel.state==1' type="primary" :loading='submitFormLoading' @click='meetOrder'>接单</Button>
             <div v-if='formModel.state==2'>
               <span style='cursor: pointer;margin-right:5px;' @click='openDistriUserFormModal'>
                 配送员：{{formModel.distriUserName}}
               </span>
                <Button  type="primary" :loading='submitFormLoading' @click='distribution'>配送</Button>
             </div>
             
        </div>
			</div>
		</Modal>
    <Modal class='distri-user-modal' v-model="showDistriUserFormModal" width='40%' title="配送员列表">
      <div class="margin-top-10 card-list-box distri-user-card" style='margin-left:-24px;'>
              <Spin size="large" fix v-if="distriUserListLoading"></Spin>
              <Card v-for='(t,i) in distriUserList' @click.native='changeDistriUser(t)'>
                <div class="img">
                  <img :src="t.photo" style='width:100%;height:100%;'>
                </div>
                <div class="text">
                  <h3><Icon type="ios-person"></Icon>  {{t.userName}}
                  </h3>
                  <!-- <p>
                    <Icon type="iphone"></Icon> {{t.mobile}}</p>
                  <p class='orderCount'>已送：{{t.orderCount}}单</p> -->
                </div>               
              </Card>
            </div>
    </Modal>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
export default {
  name: "order",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {},
  data() {
    return {
      distriUserList: [],
      distriUserListLoading: false,
      showDistriUserFormModal: false,
      submitFormLoading: false,
      stepsStatus: "process", //步骤条状态
      config: {
        url: "/order"
      },
      //搜索字段
      searchFields: {
        orderCode: "",
        guestName: "",
        startDate: "",
        endDate: "",
        state: "0",
        userId: Cookies.get("id"),
        storeId: Store.get("cacheStore")[0].value
      },
      drugTableFields: [
        // {
        //   title: "序号",
        //   type: "index",
        //   align: "center",
        //   width: "65px"
        // },
        {
          title: "药品图片",
          key: "photo",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("Avatar", {
              props: {
                shape: "square",
                size: "large",
                src: params.row.photo
              }
            });
          }
        },
        {
          title: "药品名称",
          key: "drugName",
          align: "left",
          width: 200
        },
        {
          title: "药品编号",
          key: "drugCode",
          width: 100
        },
        {
          title: "厂家",
          key: "manufacturer",
          align: "left",
          width: 150
        },
        {
          title: "药品规格",
          key: "specification",
          width: 120
        },

        {
          title: "数量",
          key: "buyNum",
          width: 70
        },
        {
          title: "单价",
          key: "unitPrice",
          width: 70
        },
        {
          title: "小计",
          key: "totalPrice",
          width: 100
        }
      ],
      //表格配置
      tableFields: [
        {
          title: "序号",
          type: "index",
          width: 65
        },
        {
          title: "订单号",
          key: "orderCode",
          width: 150
        },
        // {
        //   title: "药店名称",
        //   key: "storeName",
        //   align: "left",
        //   ellipsis: true
        // },
        {
          title: "收货人",
          key: "orderUserName",
          width: 100
        },
        {
          title: "收货人手机",
          key: "orderUserPhone",
          width: 150
        },
        {
          title: "订单状态",
          key: "state",
          width: 100,
          render: (h, params) => {
            let stateLabel = this.$store.getters.dictionaries.orderState[
              params.row.state
            ];
            return h(
              "Tag",
              {
                props: {
                  color: "default"
                }
              },
              stateLabel
            );
          }
        },
        {
          title: "备注",
          key: "remark",
          align: "left"
        },
        {
          title: "下单时间",
          key: "addTime",
          width: 150
        },
        {
          title: "操作",
          width: 200,
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
                      this.openFormModal({
                        id: params.row.id
                      });
                    }
                  }
                },
                "查看"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.deleteListData({
                        id: params.row.id
                      });
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        icon: "trash-a",
                        type: "error",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      //表单数据字段
      formModel: {
        distriUserId: "",
        storeName: "",
        orderCode: "",
        comeFrom: "",
        storeId: "",
        userId: Cookies.get("id"),
        orderDetail: [],
        state: 1,
        orderUserName: "",
        orderUserPhone: "",
        remark: "",
        address: "",
        distriUserName: "",
        distriUserPhone: "",
        distriTime: "",
        deliveryTime: "",
        totalPrice: "",
        addTime: ""
      }
    };
  },
  computed: {},
  mounted() {
    this.getListData();
  },
  methods: {
    meetOrder() {
      this.formModel.state = 2;
      this.submitFormData();
    },
    distribution() {
      this.formModel.state = 3;
      this.submitFormData({
          url:'/distriRecord',
          data:{
            state:this.formModel.state,
            orderId:this.formModel.id,
            distriUserId:this.formModel.distriUserId
          }
      });
    },
    submitFormData(opt) {
      this.submitFormLoading = true;
      this.$ajax({
        url: opt&&opt.url||this.config.url,
        method: "put",
        data: opt&&opt.data||this.formModel,
        success: res => {
          this.showFormModal = false;
          this.submitFormLoading = false;
          this.$Message.success("操作成功");
          this.closeFormModal();
          this.getListData();
        },
        error: res => {
          this.submitFormLoading = false;
        }
      });
    },
    openDistriUserFormModal() {
      this.showDistriUserFormModal = true;
      this.distriUserListLoading = true;
      this.$ajax({
        url: "/distriUser",
        method: "post",
        data: {
          currentPage: 1,
          pageSize: 999,
          fields: {
            userName: "",
            storeId: Store.get("cacheStore")[0].value,
            userId: Cookies.get("id")
          }
        },
        success: res => {
          this.distriUserListLoading = false;
          this.distriUserList = res.data;
        },
        error: () => {
          this.distriUserListLoading = false;
        }
      });
    },
    changeDistriUser(distriUser) {
      this.formModel.distriUserId = distriUser.id;
      this.formModel.distriUserName = distriUser.userName;
      this.formModel.distriUserPhone = distriUser.mobile;
      this.showDistriUserFormModal = false;
    }
  }
};
</script>