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
    <Card style='margin-bottom:10px;'>
			<div slot="title" class="common-table-title">
				<p>ws</p>			
			</div>
			<div class="common-search-box">	
				<Input v-model="ws.content" placeholder="请输入发送内容"></Input>
        	<Button type="primary"   @click='wsSend'>发送ws内容</Button>		
				<!-- <Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>			 -->
			</div>
		</Card>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">	
				<Input v-model="searchFields.userName" placeholder="请输入姓名"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>			
			</div>
			<Table v-if="listStyle=='navicon'" border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList" @on-selection-change='tableSelectionChange'></Table>
			
			<div class="common-page-box">
				<Poptip class='fl' confirm transfer title="您确认删除这些内容吗？" @on-ok="deleteAllListData">
					<Button v-if="listStyle=='navicon'" type="error" icon="trash-a">批量删除</Button>
				</Poptip>
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal v-model="showFormModal" width='50%' title="人员详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="right" :label-width="95" :model="formModel" :rules="formRule" inline>				
					<FormItem label="姓名" prop="userName">
						<Input v-model="formModel.userName" placeholder="请输入登录名"></Input>            
					</FormItem>		
          	<FormItem label="密码" prop="password">
						 <Input v-model="formModel.password" placeholder="请输入登录密码"></Input>        
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
// var ws = new WebSocket("ws://192.168.1.153:3000"); 
// ws.onmessage=function(e){
//   alert(`你有一条新订单${e.data}`)
// }
export default {
  name: "user",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {},
  data() {
    return {
      ws: {
        content: ""
      },
      config: {
        url: "/user",
        baseURL: "http://192.168.1.153:3000"
      },
      //搜索字段
      searchFields: {
        userName: ""
      },
      //表格配置
      tableFields: [
        {
          title: "登录用户名",
          key: "userName"
        },
         {
          title: "登录密码",
          key: "password"
        },
        {
          title: "添加时间",
          key: "createdAt"
        },
        {
          title: "修改时间",
          key: "updatedAt"
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
          password: ""
      }
    };
  },
  computed: {},
  mounted() {
    this.getListData();
  },
  methods: {
    wsSend() {
      ws.send(this.ws.content);
    },
    //获取表格数据
    getListData() {
      this.tableLoading = true;
      return this.$ajax({
        url: this.config.url,
        baseURL: this.config.baseURL,
        method: "post",
        data: {
          currentPage: this.config.currentPage,
          pageSize: this.config.pageSize,
          fields: this.searchFields
        },
        success: res => {
          this.tableLoading = false;
          this.tableList = res.data;
          this.config.total = res.total;
        },
        error: () => {
          this.tableLoading = false;
        }
      });
    },
    //删除表格数据
    deleteListData(opt) {
      this.tableLoading = true;
      this.$ajax({
        url: this.config.url + "/" + opt.id,
        baseURL: this.config.baseURL,
        method: "delete",
        success: res => {
          this.tableLoading = false;
          this.$Message.success("删除成功");
          if (this.currentPageState) {
            this.config.currentPage = this.config.currentPage - 1;
          }
          this.getListData();
        },
        error: () => {
          this.tableLoading = false;
        }
      });
    },
    //获取数据
    getFormData(opt) {
      this.formLoading = true;
      return this.$ajax({
        url: this.config.url + "/" + opt.id,
        baseURL: this.config.baseURL,
        method: "get",
        success: res => {
          this.formLoading = false;
          for (let attr in this.formModel) {
            this.formModel[attr] = res.data[attr];
          }
          this.formModel.id = res.data.id;
        },
        error: () => {
          this.formLoading = false;
        }
      });
    },
    //提交表单(提交的loading做了特殊处理，为了iview的modal确定按钮回调做处理)
    submitFormData() {
      this.$refs["formModel"].validate(valid => {
        if (valid) {
          this.submitFormLoading = true;
          this.$ajax({
            url: this.config.url,
            baseURL: this.config.baseURL,
            method: "put",
            data: this.formModel,
            success: res => {
              this.showFormModal = false;
              this.submitFormLoading = false;
              setTimeout(() => {
                this.submitFormLoading = true;
              }, 0);
              this.$Message.success(this.formModel.id ? "修改成功" : "新增成功");
              this.closeFormModal();
              this.getListData();
            },
            error: res => {
              this.submitFormLoading = false;
              setTimeout(() => {
                this.submitFormLoading = true;
              }, 0);
            }
          });
        } else {
          this.submitFormLoading = false;
          setTimeout(() => {
            this.submitFormLoading = true;
          }, 0);
        }
      });
    }
  }
};
</script>