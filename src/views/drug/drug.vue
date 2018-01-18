<style lang="less">
.page-drug {
  .drug-card {
    text-align: left;
    .ivu-card {
      width: 11%;
      display: inline-block;
      margin-left: 24px;
      margin-bottom: 24px;
      &:hover {
        .btn-group {
          opacity: 1;
        }
      }
      .ivu-card-body {
        padding: 0;
        .img {
          width: 180px;
          height: 180px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          padding: 10px;
          padding-top: 0px;
          h3 {
            margin: 5px 0px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          span.inventoryNum {
            float: right;
            margin-top: 3px;
            font-size: 12px;
          }
          p.manufacturer {
            font-size: 12px;
            color: rgb(22, 117, 212);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .unit {
            color: red;
            font-size: 16px;
          }
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
  .drug-tag {
    position: absolute;
    right: -4px;
    top: -2px;
  }
}
.page-drug-from-library-modal {
  .ivu-modal-footer {
    display: none;
  }
}
</style>
<template>
	<div class='page-drug'>
		<Card>
			<div slot="title" class="common-table-title">
				<p>{{$store.getters.currentPageNameCN}}</p>
				<div class="action">
					<Button type="warning" size="small" icon="archive" @click="openDrugFromLibraryModal">药品库</Button>
					<Button type="success" size="small" icon="plus-round" @click="openFormModal">增加</Button>
					<Button type="info" size="small" icon="loop" @click='getListData'>刷新</Button>
				</div>
			</div>
			<div class="common-search-box">
				<Select ref='asyncSelectStore' transfer v-model="searchFields.storeId" placeholder="请选择药店" filterable  @on-change='storeChange'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
				</Select>				
				<inputTree style='display:inline-block' ref='inputTree2' :config='treeConfig' :model='searchFields.categoryName' @treeChange='inputTreeChange2'></inputTree>
				<Input v-model="searchFields.drugName" placeholder="请输入药品名称"></Input>
				<Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button>
				<div class="operation">
					<Button :type="listStyle=='grid'?'primary':'ghost'" size="small" icon="grid" @click='switchListStyle("grid")'></Button>
					<Button :type="listStyle=='navicon'?'primary':'ghost'" size="small" icon="navicon" @click='switchListStyle("navicon")'></Button>
				</div>
			</div>
			<Table v-if="listStyle=='navicon'" border class="margin-top-10" :loading="tableLoading" :columns="tableFields" :data="tableList" @on-selection-change='tableSelectionChange'></Table>
			<div v-if="listStyle=='grid'" class="margin-top-10 card-list-box drug-card" style='margin-left:-24px;'>
				<Spin size="large" fix v-if="tableLoading"></Spin>
				<Card v-for='(t,i) in tableList'>
					<Tag :color="t.state==1?'blue':'default'" class='drug-tag'>
						{{$store.getters.dictionaries.drugState[t.state]}}
					</Tag>
					<div class="img">
						<img :src="t.photo">
					</div>
					<div class="text">
						<p>
							<b class='unit'>￥{{t.unit}}</b>
							<span class='inventoryNum' style=''>库存：{{t.inventoryNum}}</span>
						</p>
						<h3>{{t.drugName}}</h3>
						<p class='manufacturer'>{{t.manufacturer}}</p>
					</div>
					<div class='btn-group'>
						<Button type="primary" shape="circle" size='small' icon="compose" @click='openFormModal({id:t.id})'>编辑</Button>
						<Poptip confirm transfer title='您确定要删除这条数据吗?' @on-ok='deleteListData({id:t.id})'>
							<Button type="error" size='small' shape="circle" icon="trash-a">删除</Button>
						</Poptip>

					</div>
				</Card>
			</div>
			<div class="common-page-box">
				<Poptip class='fl' confirm transfer title="您确认删除这些内容吗？" @on-ok="deleteAllListData" >
					<Button v-if="listStyle=='navicon'"  type="error" icon="trash-a">批量删除</Button>
				</Poptip>
				<Page show-sizer show-elevator :page-size-opts="config.pageSizeOpts" :page-size="config.pageSize" :total="config.total" :current="config.currentPage" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
			</div>
		</Card>
		<Modal v-model="showFormModal" width='50%' title="药品详情" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeHasInputTreeModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="right" :label-width="85" :model="formModel" :rules="formRule" inline>
					<FormItem label="药品图片：" prop="photo" class='common-file-base64' style='display: block;'>
						<Avatar icon="upload" shape='square' size="large" :src='formModel.photo'></Avatar>
						<input type="file" title='选择上传文件' @change='changeFile($event,"photo")' />
					</FormItem>
					<FormItem label="药品名称：" prop="drugName">
						<Input v-model="formModel.drugName" placeholder="请输入药品名称"></Input>
					</FormItem>
          	<FormItem label="药店名称：" prop="storeId">
						<Select transfer v-model="formModel.storeId" placeholder="请选择药店">
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>
					</FormItem>
					<FormItem label="药品分类：" prop="categoryName">
						<inputTree ref='inputTree' :config='treeConfig' :model='formModel.categoryName' @treeChange='inputTreeChange'></inputTree>
					</FormItem>
					<FormItem label="药品分类id：" prop="categoryId"  class='hidden'>
						<Input v-model="formModel.categoryId" placeholder="请输入药品分类id"></Input>
					</FormItem>
					<FormItem label="生产商：" prop="manufacturer">
						<Input v-model="formModel.manufacturer" placeholder="请输入生产商"></Input>
					</FormItem>
					<FormItem label="包装规格：" prop="specification">
						<Input v-model="formModel.specification" placeholder="请输入包装规格"></Input>
					</FormItem>
					<FormItem label="使用剂量：" prop="dosage">
						<Input v-model="formModel.dosage" placeholder="请输入使用剂量"></Input>
					</FormItem>
					<FormItem label="库存数量：" prop="inventoryNum" >
						<InputNumber :max="9999" :min="1" v-model="formModel.inventoryNum" placeholder="请输入库存数量"> </InputNumber>
					</FormItem>
					<FormItem label="单价：" prop="unitPrice" >
						<Input v-model="formModel.unitPrice" placeholder="请输入单价"></Input>
					</FormItem>
					<FormItem label="药品状态：" prop="state">
						<Select transfer v-model="formModel.state" placeholder="请输入药品状态">
							<Option v-for="t in $store.state.dictionaries.drugState" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>
					</FormItem>
				</Form>
			</div>
		</Modal>
		<Modal class='page-drug-from-library-modal' v-model="showdrugFromLibraryModal" width='50%' title="药品库列表"  @on-cancel="">
			<drugFromLibrary ref='drugFromLibrary'></drugFromLibrary>		
		</Modal>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
import drugFromLibrary from "@/views/drug/components/drug-from-library.vue";
import inputTree from "@/components/inputTree.vue";
export default {
  name: "drug",
  mixins: [mixins.searchList, mixins.tableList, mixins.page, mixins.form],
  components: {
    drugFromLibrary,
    inputTree
  },
  data() {
    return {
      treeConfig: {
        url: "/storeDrugCategory",
        labelKey: "CategoryName", //tree的title赋值字段
        searchFields:{
          storeId: Store.get('cacheStore')[0].value,
        }
      },
      showdrugFromLibraryModal: false, //药品库弹窗
      config: {
        url: "/storeDrug",
        pageSize: 16,
        pageSizeOpts: [16, 32, 64]
      },
      //搜索字段
      searchFields:{
        categoryName: "顶级分类",
        categoryId: "0",
        drugName: "",
        storeId: Store.get('cacheStore')[0].value,
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
        
        },
        {
          title: "生产商",
          key: "manufacturer",
          align: "left"
        },
        {
          title: "包装规格",
          key: "specification",
          align: "left",
         width: 120,
        },
        // {
        //   title: "使用剂量",
        //   key: "dosage",
        //   align: "left"
        // },
        {
          title: "药品状态",
          key: "state",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "Tag",
              {
                props: {
                  color: params.row.state == 1 ? "blue" : "default"
                }
              },
              this.$store.getters.dictionaries.drugState[params.row.state]
            );
          }
        },
        {
          title: "库存数量",
          width: 90,
          key: "inventoryNum"
        },
        {
          title: "单价（元）",
          width: 100,
          key: "unitPrice"
        },
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
        categoryName: "",
        categoryId: 0,
        barCode: "",
        drugName: "",
        manufacturer: "",
        dosage: "",
        unitPrice: "",
        specification: "",
        storeId: Store.get("cacheStore")[0].value,
        userId: Cookies.get("id"),
        state: 1,
        inventoryNum: 0,
        photo: ""
      },
       formRule: {
        drugName: [
          {
            required: true,
            message: "药品名称不能为空"
          }
        ],
         storeId: [
          {
            required: true,
            message: "药店名称不能为空"
          }
        ],
        categoryName: [
          {
            required: true,
            message: "药品分类不能为空"
          }
        ], 
        unitPrice: [
          {
            required: true,
            message: "单价不能为空"
          }
        ],      
      }
    };
  },
   computed: {
  
  },
  mounted() {
    this.getListData();
  }, 
  methods: {
    closeHasInputTreeModal() {
      this.$refs["inputTree"].treeList = []; //清除treeList，下次打开modal  inputTree重新获取数据
      this.closeFormModal();
    },
    inputTreeChange(obj) {
      this.formModel.categoryName = obj.CategoryName;
      this.formModel.categoryId = obj.id;
    },
    inputTreeChange2(obj) {
      this.searchFields.categoryName = obj.CategoryName;
      this.searchFields.categoryId = obj.id;
    },
    openDrugFromLibraryModal() {
      this.showdrugFromLibraryModal = true;
      this.$refs["drugFromLibrary"].getListData();
    },
    resetSearchFields(){
      this.treeConfig.searchFields.storeId=this.searchFields.storeId;
       this.searchFields.categoryName ='顶级分类';
       this.searchFields.categoryId = '0';
    },
    storeChange(){
       this.getListData();
       this.resetSearchFields();
    }
  }
};
</script>