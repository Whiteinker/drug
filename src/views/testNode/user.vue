<style lang="less">
.ztree * {
  font-size: 14px !important;
}
span.tmpzTreeMove_arrow {
  z-index: 1;
}
.ztree li span.button.add {
  margin-left: 2px;
  margin-right: -1px;
  background-position: -144px 0;
  vertical-align: top;
  *vertical-align: middle;
}
</style>
<template>
	<div class='page-zTree'>    
		<Row :gutter="18">
			<Col span="24">
			<Card style='min-height:600px'>
				<div slot="title" class="common-table-title">
					<p>{{$store.getters.currentPageNameCN}}</p>
				</div>
				<div style='position: relative;'>
					<div style='margin-bottom:20px;'>
						<Select style='width:200px' transfer v-model="searchFields.storeId" placeholder="请选择药店" filterable  @on-change='treeInit'>  
							<Option v-for="t in cacheStore" :value="t.value" :key='t.value'>{{t.label }}</Option>
						</Select>	
             <Button  type="primary" icon="plus-round" :loading='addTreeLoading' @click='addTreeRootNode'>添加顶级分类</Button>		
					</div>
					<Spin size="large" fix v-if="treeLoading"></Spin>
          <div id='treeDemo' class='ztree'></div>
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
  name: "user",
  mixins: [mixins.searchList],
  components: {},
  data() {
    return {
      addTreeLoading: false,
      setting: {}, //ztree的配置对象
      config: {
        url: "/storeDrugCategory"
      },
      treeLoading: false,
      searchFields: {
        storeId: Store.get("cacheStore")[0].value
      },
      editForm: {
        ParentID: "",
        storeId: Store.get("cacheStore")[0].value,
        id: ""
      },
      addForm: {
        ParentID: "",
        storeId: Store.get("cacheStore")[0].value,
        CategoryName: "新分类名称"
      }
    };
  },
  computed: {
    cacheStore() {
      return Store.get("cacheStore");
    }
  },
  mounted() {
    this.zTreeInit();
    this.treeInit();
  },
  methods: {
    zTreeInit() {
      var zNodes = [];
      var setting = {
        view: {
          addHoverDom: (treeId, treeNode) => {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var sObj = $("#" + treeNode.tId + "_span");
            if (
              treeNode.editNameFlag ||
              $("#addBtn_" + treeNode.tId).length > 0
            )
              return;
            var addStr =
              "<span class='button add' id='addBtn_" +
              treeNode.tId +
              "' title='add node' onfocus='this.blur()'></span>";
            var removeStr =
              "<span class='button remove' id='removeBtn_" +
              treeNode.tId +
              "' title='add node' onfocus='this.blur();' style='float:right'></span>";
            sObj.after(removeStr);
            sObj.after(addStr);
            var addBtn = $("#addBtn_" + treeNode.tId);
            var removeBtn = $("#removeBtn_" + treeNode.tId);
            if (addBtn) {
              addBtn.bind("click", () => {
                if (treeNode.level >= 2) {
                  this.$Message.warning("不能添加四级分类");
                  return false;
                }
                this.addForm.ParentID = treeNode.id;
                this.$ajax({
                  url: this.config.url,
                  method: "put",
                  data: this.addForm,
                  success: res => {
                    this.$Message.success("新增成功");
                    zTree.addNodes(treeNode, {
                      id: res.data.ID,
                      pId: treeNode.id,
                      name: this.addForm.CategoryName
                    });
                  }
                });
              });
              removeBtn.bind("click", () => {
                if (treeNode.children) {
                  this.$Message.warning("有子集，不能删除");
                  return false;
                }
                this.$ajax({
                  url: this.config.url + "/" + treeNode.id,
                  method: "delete",
                  success: res => {
                    this.$Message.success("删除成功");
                    zTree.removeNode(treeNode);
                  }
                });
              });
            }
          },
          removeHoverDom: (treeId, treeNode) => {
            $("#addBtn_" + treeNode.tId)
              .unbind()
              .remove();
            $("#removeBtn_" + treeNode.tId)
              .unbind()
              .remove();
          },
          selectedMulti: false
        },
        edit: {
          enable: true,
          showRemoveBtn: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeRemove: (treeId, treeNode) => {},
          beforeRename: async (treeId, treeNode, newName) => {
            if (newName.length == 0) {
              setTimeout(() => {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.cancelEditName();
                this.$Message.warning("节点名称不能为空");
              }, 0);
              return false;
            } else {
              this.editForm.id = treeNode.id;
              this.editForm.ParentID = treeNode.ParentID;
              this.editForm.CategoryName = newName;
              await this.$ajax({
                url: this.config.url,
                method: "put",
                data: this.editForm,
                success: res => {
                  this.$Message.success("修改成功");
                  return true;
                }
              });
            }
          },
          beforeDrop: (treeId, treeNodes, targetNode, moveType) => {
            if (moveType != "inner") {
              return false;
            }
            if (targetNode.level >= 2) {
              this.$Message.warning("不能移动到三级分类下");
              return false;
            }
            if (treeNodes[0].children) {
              this.$Message.warning("有子集，不能移动");
              return false;
            }
            this.editForm.id = treeNodes[0].id;
            this.editForm.ParentID = targetNode ? targetNode.id : 0;
            this.$ajax({
              url: this.config.url,
              method: "put",
              data: this.editForm,
              success: res => {
                this.$Message.success("修改成功");
              }
            });
            return true;
          }
        }
      };
      this.setting = setting;
    },
    getTreeData() {
      this.treeLoading = true;
      return this.$ajax({
        url: this.config.url,
        method: "post",
        data: {
          currentPage: 1,
          pageSize: 9999,
          fields: this.searchFields
        },
        success: res => {
          this.treeLoading = false;
          this.a({
            list: res.data
          });
          this.treeList = res.data;
          this.editForm.storeId = this.searchFields.storeId;
          this.addForm.storeId = this.searchFields.storeId;
        },
        error: () => {
          this.treeLoading = false;
        }
      });
    },
    editTreeData() {
      this.$ajax({
        url: "aa",
        method: "put",
        data: this.editForm,
        success: res => {
          // this.treeEditFormLoading = false;
          this.$Message.success("修改成功");
          this.getTreeData();
          return true;
          // this.getTreeData();
          // this.treeExpandHandle({
          // 	list: this.treeList,
          // 	id: res.data.ID
          // });
          // this.clearTreeFormData();   
        },
        error: () => {
          return false;
        }
      });
    },
    a(opt) {
      opt.list.forEach(t => {
        t.name = t.CategoryName;
        t.pId = t.ParentID;
        t.open = true;
        if (t.children) {
          this.a({
            list: t.children
          });
        }
      });
    },
    async treeInit() {
      await this.getTreeData();
      // zNodes=this.treeList
      $.fn.zTree.init($("#treeDemo"), this.setting, this.treeList);
    },
    addTreeRootNode() {
      this.addTreeLoading = true;
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      this.addForm.ParentID = 0;
      this.$ajax({
        url: this.config.url,
        method: "put",
        data: this.addForm,
        success: res => {
          this.addTreeLoading = false;
          this.$Message.success("新增成功");
          zTree.addNodes(null, {
            id: res.data.ID,
            name: this.addForm.CategoryName
          });
        },
        error: () => {
          this.addTreeLoading = false;
        }
      });
    }
  }
};
</script>