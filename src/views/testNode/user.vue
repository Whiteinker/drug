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
        // CategoryName:'',
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
      var self = this;
      var zNodes = [];
      var setting = {
        view: {
          // expandSpeed: "",
          addHoverDom: (treeId, treeNode) => {
            var self = this;
            var sObj = $("#" + treeNode.tId + "_span");
            if (
              treeNode.editNameFlag ||
              $("#addBtn_" + treeNode.tId).length > 0
            )
              return;
            var addStr =
              "<span class='button add' id='addBtn_" +
              treeNode.tId +
              "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_" + treeNode.tId);
            if (btn) {
              btn.bind("click", function() {
                if (treeNode.level < 2) {
                  var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                  self.addForm.ParentID = treeNode.id;
                  self.$ajax({
                    url: self.config.url,
                    method: "put",
                    data: self.addForm,
                    success: res => {
                      self.$Message.success("新增成功");
                      zTree.addNodes(treeNode, {
                        id: res.data.ID,
                        pId: treeNode.id,
                        name: self.addForm.CategoryName
                      });
                    }
                  });
                  return false;
                } else {
                  self.$Message.warning("不能添加四级分类");
                }
              });
            }
          },
          removeHoverDom: removeHoverDom,
          selectedMulti: false
        },
        edit: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeRemove: async (treeId, treeNode) => {
            let result = false;
            // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            // zTree.selectNode(treeNode);
            await this.$ajax({
              url: this.config.url + "/" + treeNode.id,
              method: "delete",
              success: res => {
                this.treeLoading = false;
                this.$Message.success("删除成功");
                result = true;
              },
              error: () => {
                this.treeLoading = false;
              }
            });
            return result;
          },
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
          onDrop: zTreeOnDrop,
          beforeDrop: async (treeId, treeNodes, targetNode, moveType) => {
            let dropSuccess = false;
            this.editForm.id = treeNodes[0].id;
            if (targetNode && moveType == "inner") {
              this.editForm.ParentID = targetNode.id;
            } else {
              this.editForm.ParentID = 0; //treeNodes[0].ParentID
            }
            await this.$ajax({
              url: this.config.url,
              method: "put",
              data: this.editForm,
              success: res => {
                this.$Message.success("修改成功");
                dropSuccess = true;
              }
            });
            return dropSuccess;
          }
        }
      };
      function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
        self.editForm.id = treeNodes[0].id;
        if (targetNode && moveType == "inner") {
          self.editForm.ParentID = targetNode.id;
        } else {
          self.editForm.ParentID = 0; //treeNodes[0].ParentID
        }
        return self.editTreeData();
      }
      function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {}
      function beforeRemove(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
      }
      function beforeRename(treeId, treeNode, newName) {
        if (newName.length == 0) {
          setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
          }, 0);
          return false;
        }
        return true;
      }

      var newCount = 1;
      function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
          return;
        var addStr =
          "<span class='button add' id='addBtn_" +
          treeNode.tId +
          "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn)
          btn.bind("click", function() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.addNodes(treeNode, {
              id: 100 + newCount,
              pId: treeNode.id,
              name: "new node" + newCount++
            });
            return false;
          });
      }
      function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId)
          .unbind()
          .remove();
      }
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
          this.treeListHandle({
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
    treeListHandle(opt) {
      opt.list.forEach(t => {
        t.name = t.CategoryName;
        t.pId = t.ParentID;
        t.open = true;
        if (t.children) {
          this.treeListHandle({
            list: t.children
          });
        }
      });
    },
    async treeInit() {
      await this.getTreeData();
      // zNodes=this.treeList
      $.fn.zTree.init($("#treeDemo"), this.setting, this.treeList);
    }
  }
};
</script>