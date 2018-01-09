<style lang="less">
.page-store-modal {
  .common-form-box {
    .ivu-form-item {
      width: 45%;
    }
  }
}
</style>
<template>
	<div class='page-store'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
				<Input v-model="searchFields.storeName" placeholder="请输入药店名称"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
			</div>
			<Table border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList"></Table>
			<div class="common-page-box">
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal class='page-store-modal' v-model="showFormModal" width='50%' title="药店详情" :loading='submitFormLoading'  @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
        	<Form ref="formModel" label-position="right" :label-width="120" :model="formModel" :rules="formRule" inline>
					<FormItem label="药店LOGO：" prop="logo" class='common-file-base64' style='display: block;'>
						<Avatar icon="upload" shape='square' size="large" :src='formModel.logo'></Avatar>
						<input type="file" title='选择上传文件' @change='changeFile($event,"logo")' />
					</FormItem>
					<FormItem label="药店名称：" prop="storeName" style='display:block;'>
						<Input v-model="formModel.storeName" placeholder="请输入药店名称"></Input>
					</FormItem>					
					<FormItem label="服务电话：" prop="tel">
						<Input v-model="formModel.tel" placeholder="请输入服务电话"></Input>
					</FormItem>
					<FormItem label="药店状态：" prop="state" >
						<Select transfer v-model="formModel.state" placeholder="请选择药店状态">
							<Option v-for="t in $store.state.dictionaries.storeState" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>
					</FormItem>
					<FormItem label="药店地址：" prop="address" style='width:94%'>
						<Input v-model="formModel.address" placeholder="请输入药店地址" style='width:91%'></Input>
            	<Button icon='location' type="primary" @click="openMapModal" ></Button>
					</FormItem>
					<FormItem label="定位：" prop="gpsCoordinate" style='width:5%' class='hidden'>	</FormItem>
					<FormItem label="配送范围（公里）：" prop="distriRange" style='width: 28%;'>
						<InputNumber :max="999" :min="1" v-model="formModel.distriRange" placeholder="请输入配送范围"> </InputNumber>
					</FormItem>
					<FormItem label="起送价（元）：" prop="startSendPrice" style='width: 28%;'>
						<InputNumber :max="999" :min="1" v-model="formModel.startSendPrice" placeholder="请输入起送价"> </InputNumber>
					</FormItem>
					<FormItem label="配送费（元）：" prop="distriFee" style='width: 28%;'>
						<Input v-model="formModel.distriFee" placeholder="请输入配送费"></Input>
					</FormItem>
					<FormItem label="配送开始时间：" prop="distriStartTime" style='width:230px;'>
						<TimePicker transfer :value="timePickerHandle.distriStartTime" format="HH:mm" placeholder="请输入配送开始时间" @on-change='timePickerChange($event,"distriStartTime")'></TimePicker>
					</FormItem>
					<FormItem label="配送结束时间：" prop="distriEndTime"  style='width:230px;'>
						<TimePicker transfer :value="timePickerHandle.distriEndTime" format="HH:mm" placeholder="请输入配送结束时间" @on-change='timePickerChange($event,"distriEndTime")'></TimePicker>
					</FormItem>
					<FormItem label="店铺简介：" prop="descrip" style='width: 94%;'>
						<Input type='textarea' :rows='3' v-model="formModel.descrip" placeholder="请输入店铺简介"></Input>
					</FormItem>
					<FormItem label="店铺公告：" prop="notice" style='width: 94%;'>
						<Input type='textarea' :rows='3' v-model="formModel.notice" placeholder="请输入店铺公告"></Input>
					</FormItem>
					<FormItem label="密码：" prop="password" class='hidden'>
						<Input v-model="formModel.password"></Input>
					</FormItem>
				</Form>
			</div>
		</Modal>
		<Modal v-model="mapModal" title="百度地图" width='50%' @on-ok='okMapModal' @on-cancel="closeMapModal">
			<storeMap ref='commonMap' :formModel='formModel'></storeMap>
		</Modal>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import storeMap from "@/views/store/map.vue";
import Cookies from "js-cookie";
export default {
  name: "store",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {
    storeMap
  },
  data() {
    return {
      mapModal: false,
      config: {
        url: "/store"
      },
      //搜索字段
      searchFields: {
        storeName: "",
        userId: Cookies.get("id")
      },
      //表格配置
      tableFields: [
        {
          title: "序号",
          type: "index",
          width: 65
        },
        {
          title: "药店LOGO",
          key: "logo",
          width: 100,
          render: (h, params) => {
            return h("Avatar", {
              props: {
                shape: "square",
                size: "large",
                src: params.row.logo
              }
            });
          }
        },
        {
          title: "药店名称",
          key: "storeName",
          align: "left",
          width: 250
        },
        {
          title: "药店详细地址",
          key: "address",
          align: "left",
          ellipsis: true
        },
        {
          title: "服务电话",
          width: 150,
          key: "tel"
        },
        // {
        //   title: "药店简介",
        //   key: "descrip",
        //   align: "left",
        //   ellipsis: true
        // },
        {
          title: "操作",
          width: 200,
          align: "center",
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
        userId: Cookies.get("id"),
        state: 1,
        password: "",
        storeName: "",
        address: "",
        tel: "",
        logo: "",
        descrip: "",
        notice: "",
        distriRange: 0,
        gpsCoordinate: "",
        startSendPrice: 0,
        distriFee: "",
        distriStartTime: 0,
        distriEndTime: 0
      },
      formRule: {
        storeName: [
          {
            required: true,
            message: "药店名称不能为空"
          }
        ],
        address: [
          {
            required: true,
            message: "药店地址不能为空"
          }
        ],       
      }
    };
  },
  mounted() {
    this.getListData();
  },
  computed: {
    //对时间时分的特殊处理
    timePickerHandle() {
      return {
        distriStartTime:
          Math.floor(this.formModel["distriStartTime"] / 60) +
          ":" +
          ((this.formModel["distriStartTime"] % 60) / 100).toFixed(2).slice(-2),
        distriEndTime:
          Math.floor(this.formModel["distriEndTime"] / 60) +
          ":" +
          ((this.formModel["distriEndTime"] % 60) / 100).toFixed(2).slice(-2)
      };
    }
  },
  methods: {
    //对时间时分的特殊处理
    timePickerChange(value, key) {
      this.timePickerHandle[key] = value;
      this.formModel[key] =Number(value.split(":")[0] * 60) + Number(value.split(":")[1]);
    },   
    openMapModal() {
      this.mapModal = true;
      let pointArr = this.formModel["gpsCoordinate"].split(",");
      if (pointArr.length > 1) {
        setTimeout(() => {
          this.$refs["commonMap"].init();
          this.$refs["commonMap"].setCenter({
            pointArr: pointArr
          });
        }, 300);
      }
    },
    closeMapModal() {
      this.$refs["commonMap"].clearOverlays();
    },
    okMapModal() {
      this.mapModal = false;
      this.formModel["gpsCoordinate"] = this.$refs["commonMap"].pointArr.join(",");
      this.$refs["commonMap"].clearOverlays();
    }
  }
};
</script>