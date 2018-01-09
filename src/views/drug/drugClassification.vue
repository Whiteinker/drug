<style lang="less">
.page-drug-classification {
  .ivu-tree {
    ul {
      li {
        span {
          font-size: 14px;
        }
      }
    }
  }
  .ivu-form-item {
    width: 93%;
  }
  .ivu-dropdown {
    margin-left: 0px !important;
    width: 100%;
    .ivu-select-dropdown {
      padding: 0px 10px;
    }
  }
  input[readonly="readonly"] {
    cursor: pointer;
  }
}

.page-drug-classification-modal {
  .ivu-form-item {
    width: 93%;
  }
}
</style>
<template>
	<div class='page-drug-classification'>
		<Row :gutter="10">
			<Col span="7">
			<Card style='min-height:600px'>
				<div slot="title" class="common-table-title">
					<p>{{$store.getters.currentPageNameCN}}</p>
				</div>
				<div style='position: relative;'>
					<div style='margin-bottom:20px;'>
						<Select style='width:200px' transfer v-model="searchFields.storeId" placeholder="请选择药店" filterable  @on-change='treeInit'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>
					<!-- <Button type="primary" icon="search" :loading="searchLoading" @click='searchData'>搜索</Button> -->
					</div>
					<Spin size="large" fix v-if="treeLoading"></Spin>
					<Tree ref='tree' :data="treeList"></Tree>
				</div>  
			</Card>
			</Col>
			<Col span="8" class-name="padding-left-5">
			<Card style='min-height:600px'>
				<div slot="title" class="common-table-title"> 
					<p>分类操作</p>
					<div class="action">
						<Button type="success" size="small" icon="plus-round" @click='clearTreeFormData'>新增分类</Button>
					</div>
				</div>
				<div class='common-form-box'>
					<Form ref="treeEditFormModel" label-position="right" :label-width="85" :model="treeEditFormModel" :rules="formRule" inline>
						<FormItem label="分类名称：" prop="CategoryName">
							<Input v-model="treeEditFormModel.CategoryName" placeholder="请输入分类名称"></Input>
						</FormItem>
						<FormItem  label="分类父级：" prop="ParentID">
							<Dropdown  trigger="click" >
								<Input ref='dropdownMenuTreeInput'  v-model='treeEditFormModel.ParentName' readonly placeholder="请输入分类父级" icon="navicon"  ></Input>
								<DropdownMenu slot="list">
									<Tree ref='treeClone' :data="treeListClone" @on-select-change='treeEditChange'></Tree>
								</DropdownMenu>
							</Dropdown>

						</FormItem>
						<FormItem label="分类描述：" prop="Remark">
							<Input v-model="treeEditFormModel.Remark" placeholder="请输入分类描述"></Input>
						</FormItem>
						<FormItem>
							<Button :type="treeEditFormModel.id?'primary':'success'" :icon='treeEditFormModel.id?"compose":"plus-round"' :loading="treeEditFormLoading" @click="editTreeFormData">{{treeEditFormModel.id?'修改':'新增'}}</Button>
							<Poptip v-if='treeEditFormModel.id' confirm transfer title="您确认删除这个内容吗？" @on-ok="deleteTreeData">
								<Button type="error" icon="trash-a">删除</Button>
							</Poptip>
						</FormItem>
					</Form>
				</div>
			</Card>
			</Col>
		</Row>
		
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
export default {
  name: "drugClassification",
  mixins: [mixins.searchList, mixins.tree],
  components: {},
  data() {
    return {
      config: {
        url: "/storeDrugCategory",
        pageSize: 99999
      },
      //搜索字段
      searchFields: {
        // userId: Cookies.get("id"),
        storeId: Store.get("cacheStore")[0].value
      },
      //tree修改绑定的model，跟新增的form model不同
      treeEditFormModel: {
        ParentID: 0,
        ParentName: "顶级分类",
        CategoryName: "",
        Remark: "",
        storeId: ""
      },
      formRule: {
        CategoryName: [
          {
            required: true,
            message: "分类名称不能为空"
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.treeInit();
  },
  methods: {
    async treeInit() {
      await this.getTreeData();
      this.treeCloneList();
      this.treeEditFormModel.storeId = this.searchFields.storeId;
    }
  }
};
</script>