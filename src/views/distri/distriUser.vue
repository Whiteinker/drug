<style lang="less">
.distri-user-card {
  .ivu-card {
    width: 11%;
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
      height: 200px;
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

.distri-file-base64 {
  .ivu-avatar-large {
    height: 190px;
    i.ivu-icon {
      line-height: 190px;
    }
  }
  input[type="file"] {
    height: 190px;
  }
}
</style>
<template>
	<div class='page-distri-user'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">				
				<Select ref='asyncSelectStore' transfer v-model="searchFields.storeId" placeholder="请选择药店" filterable  @on-change='getListData'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
				</Select>
				<Input v-model="searchFields.userName" placeholder="请输入配送员姓名"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
				<div class="operation">
					<Button :type="listStyle=='grid'?'primary':'ghost'" size="small" icon="grid" @click='switchListStyle("grid")'></Button>
					<Button :type="listStyle=='navicon'?'primary':'ghost'" size="small" icon="navicon" @click='switchListStyle("navicon")'></Button>
				</div>
			</div>
			<Table v-if="listStyle=='navicon'" border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList" @on-selection-change='tableSelectionChange'></Table>
			<div v-if="listStyle=='grid'" class="margin-top-10 card-list-box distri-user-card" style='margin-left:-24px;'>
				<Spin size="large" fix v-if="tableLoading"></Spin>
				<Card v-for='(t,i) in tableList'>
					<div class="img">
						<img :src="t.photo" style='width:100%;height:100%;'>
					</div>
					<div class="text">
						<h3><Icon type="ios-person"></Icon>  {{t.userName}}
						</h3>
						<p>
							<Icon type="iphone"></Icon> {{t.mobile}}</p>
						<p class='orderCount'>已送：{{t.orderCount}}单</p>
					</div>
					<div class='btn-group'>
						<!-- <Button type="info" shape="circle" size='small' icon="eye" @click='openSeeFormModal({id:t.id})'>查看</Button> -->
						<Button type="info" shape="circle" size='small' icon="compose" @click='openFormModal({id:t.id})'>编辑</Button>
						<Poptip confirm transfer title='您确定要删除这条数据吗?' @on-ok='deleteListData({id:t.id})'>
							<Button type="error" size='small' shape="circle" icon="trash-a">删除</Button>
						</Poptip>
					</div>
				</Card>
			</div>
			<div class="common-page-box">
				<Poptip class='fl' confirm transfer title="您确认删除这些内容吗？" @on-ok="deleteAllListData">
					<Button v-if="listStyle=='navicon'" type="error" icon="trash-a">批量删除</Button>
				</Poptip>
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal v-model="showFormModal" width='50%' title="配送人员详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="right" :label-width="95" :model="formModel" :rules="formRule" inline>
					<FormItem label="配送员头像：" prop="photo" class='common-file-base64 distri-file-base64' style='display: block;'>
						<Avatar icon="ios-person" shape='square' size="large" :src='formModel.photo'></Avatar>
						<input type="file" title='选择上传文件' @change='changeFile($event,"photo")' />
					</FormItem>
					<FormItem label="配送员姓名：" prop="userName">
						<Input v-model="formModel.userName" placeholder="请输入配送员姓名"></Input>
					</FormItem>
					<FormItem label="配送员手机：" prop="mobile">
						<Input v-model="formModel.mobile" placeholder="请输入配送员手机"></Input>
					</FormItem>
					<FormItem label="配送总单数：" prop="orderCount">
						<Input v-model="formModel.orderCount" placeholder="请输入配送订单总数"></Input>
					</FormItem>
					<FormItem prop="oneStarCount" class='hidden'>
						<Input v-model="formModel.oneStarCount"></Input>
					</FormItem>
					<FormItem prop="twoStarCount" class='hidden'>
						<Input v-model="formModel.twoStarCount"></Input>
					</FormItem>
					<FormItem prop="threeStarCount" class='hidden'>
						<Input v-model="formModel.threeStarCount"></Input>
					</FormItem>
					<FormItem prop="fourStarCount" class='hidden'>
						<Input v-model="formModel.fourStarCount"></Input>
					</FormItem>
					<FormItem prop="fiveStarCount" class='hidden'>
						<Input v-model="formModel.fiveStarCount"></Input>
					</FormItem>
					<FormItem class='pie-chart' label="星级统计：" style='display: block;'>
						<div style="width:500px;height:300px;" id="data_source_con"></div>
					</FormItem>
				</Form>
			</div>
		</Modal>
		<Modal class='common-see-modal' v-model="showSeeFormModal" width='35%' title="配送人员详情" @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form   label-position="right" :label-width="85" :model="formModel">					
					<FormItem label="配送员头像：" class='common-file-base64 distri-file-base64'>
						<Avatar icon="ios-person" shape='square' size="large" :src='formModel.photo'></Avatar>
					</FormItem>
					<FormItem label="配送员姓名：" >
						<span>{{formModel.userName}}</span>
						</FormItem>		
					<FormItem label="配送员手机：" >
							<span>{{formModel.mobile}}</span>
					</FormItem>		
					<FormItem label="配送总单数：" >
							<span>{{formModel.orderCount}}</span>
					</FormItem>	
					<FormItem class='pie-chart' label="星级统计：" style='display: block;'>
						<div style="width:500px;height:300px;" id="data_source_con"></div>
					</FormItem>
				</Form>					
			</div>
		</Modal>
	</div>
</template>
<script>
const echarts = require("echarts");
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
export default {
  name: "distriUser",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {},
  data() {
    return {
      config: {
        url: "/distriUser"
      },
       //搜索字段
    searchFields:{
        userName: "",
        storeId:Store.get('cacheStore')[0].value,
        userId: Cookies.get("id")
      },
      //表格配置
      tableFields: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "配送员头像",
          key: "photo",
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
          title: "配送员姓名",
          key: "userName",
          width: 100
        },
        {
          title: "配送员手机",
          key: "mobile",
          width: 200
        },
        {
          title: "配送订单总数",
          key: "orderCount"
        },
        {
          title: "一星评价",
          key: "oneStarCount"
        },
        {
          title: "二星评价",
          key: "twoStarCount"
        },
        {
          title: "三星评价",
          key: "threeStarCount"
        },
        {
          title: "四星评价",
          key: "fourStarCount"
        },
        {
          title: "五星评价",
          key: "fiveStarCount"
        },
        {
          title: "操作",
          width: 200,
          key: "action",
          render: (h, params) => {
            return h("div", [
              // h('Button', {
              // 	props: {
              // 		icon: 'eye',
              // 		type: 'info',
              // 		size: 'small'
              // 	},
              // 	style: {
              // 		marginRight: '5px'
              // 	},
              // 	on: {
              // 		click: () => {
              // 			this.openSeeFormModal({
              // 				id: params.row.id
              // 			})

              // 		}
              // 	}
              // }, '查看'),
              h(
                "Button",
                {
                  props: {
                    icon: "compose",
                    type: "primary",
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
                "编辑"
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
        userName: "",
        mobile: "",
        storeId: "",
        photo: "",
        orderCount: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
        storeId: "",
        userId: Cookies.get("id")
      },
       formRule: {
        userName: [
          {
            required: true,
            message: "配送员姓名不能为空"
          }
        ] ,
         mobile: [
          {
            required: true,
            message: "配送员手机不能为空"
          },{
            pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
            message: "必须是11位手机号码"            
          }
        ]  
      }
    };
  },
  computed: {
   
  },
  mounted() {
    this.getListData();
  },
  methods: {
    //重写mixins编辑弹窗
    async openFormModal(opt) {
      this.showFormModal = true;
      if (opt && opt.id) {
        document.querySelector(".pie-chart").style.display = "block";
        await this.getFormData({
          id: opt.id
        });
        this.pieChart();
      } else {
        document.querySelector(".pie-chart").style.display = "none";
      }
    },
    //重写mixins查看弹窗
    async openSeeFormModal(opt) {
      this.showSeeFormModal = true;
      if (opt && opt.id) {
        document.querySelector(".pie-chart").style.display = "block";
        await this.getFormData({
          id: opt.id
        });
        this.pieChart();
      } else {
        document.querySelector(".pie-chart").style.display = "none";
      }
    },
    //初始化图表
    pieChart() {
      this.$nextTick(() => {
        var dataSourcePie = echarts.init(
          document.getElementById("data_source_con")
        );
        const option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "right",
            data: ["一星", "二星", "三星", "四星", "五星"]
          },
          series: [
            {
              name: "星级评价",
              type: "pie",
              radius: "66%",
              center: ["50%", "60%"],
              data: [
                {
                  value: this.formModel.oneStarCount,
                  name: "一星",
                  itemStyle: {
                    normal: {
                      color: "#9bd598"
                    }
                  }
                },
                {
                  value: this.formModel.twoStarCount,
                  name: "二星",
                  itemStyle: {
                    normal: {
                      color: "#ffd58f"
                    }
                  }
                },
                {
                  value: this.formModel.threeStarCount,
                  name: "三星",
                  itemStyle: {
                    normal: {
                      color: "#abd5f2"
                    }
                  }
                },
                {
                  value: this.formModel.fourStarCount,
                  name: "四星",
                  itemStyle: {
                    normal: {
                      color: "#ab8df2"
                    }
                  }
                },
                {
                  value: this.formModel.fiveStarCount,
                  name: "五星",
                  itemStyle: {
                    normal: {
                      color: "#e14f60"
                    }
                  }
                }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        dataSourcePie.setOption(option);
        window.addEventListener("resize", function() {
          dataSourcePie.resize();
        });
      });
    }
  }
};
</script>