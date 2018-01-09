<style lang="less">
.common-input-tree {
	position: relative;
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
</style>
<template>
	<div class="common-input-tree">
		<Dropdown  trigger="click" @on-visible-change='visibleChange'>
			<Input :value='model' readonly placeholder="请选择分类父级" icon="navicon"></Input>
			<DropdownMenu slot="list">
				<Spin size="large" fix v-if="treeLoading"></Spin>
				<Tree :data="treeList"></Tree>
			</DropdownMenu>
		</Dropdown>
	</div>

</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import Store from "store";
export default {
  name: "inputTree",
  mixins: [],
  components: {},
  data() {
    return {
      treeLoading: false,
      treeList: [],
      inputTreeText: "",
      //搜索字段
      // searchFields: {
      //   storeId: Store.get('cacheStore')[0].value,
      // }
    };
  },
  props: {
    //配置
    config: {
      type: Object
    },

    model: {
      type: String
    }
    //			//父组件的treeItem选项的id key
    //			idKey:{
    //				type: String
    //			}
  },

  computed: {
    //父菜单增加图标
    treeRenderContent() {
      return (h, { root, node, data }) => {
        return h(
          "span",
          {
            class: "ivu-tree-title",
            on: {
              click: () => {
                // this.treeChange(data);
              }
            }
          },
          [
            h("Icon", {
              props: {
                type: "ios-folder-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            data.title
          ]
        );
      };
    },
    //子菜单增加图标
    treeChildrenRenderContent() {
      return (h, { root, node, data }) => {
        return h(
          "span",
          {
            class: "ivu-tree-title",
            on: {
              click: () => {
                this.treeChange(data);
              }
            }
          },
          [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            data.title
          ]
        );
      };
    }
  },
  mounted() {},
  methods: {
    visibleChange(visible) {
      if (visible) {
        // if (this.treeList.length <= 0) {
          this.getTreeData();
        // }
      } else {
      }
    },
    //获取tree数据
    getTreeData() {
      this.treeLoading = true;
      return this.$ajax({
        url: this.config.url,
        method: "post",
        data: {
          currentPage: 1,
          pageSize: 99999,
          fields: this.config.searchFields
        },
        success: res => {
		  this.treeLoading = false;
		 res.data.unshift({
					title: '顶级分类',
					CategoryName: '顶级分类',
					id: 0
				});
          this.treeListHandle({
            list: res.data
          });
          this.treeList = res.data;
        },
        error: () => {
          this.treeLoading = false;
        }
      });
    },
    //递归处理添加tree组件需要的title键，和父子菜单增加图标
    treeListHandle(opt) {
      opt.list.forEach(t => {
        t.title = t[this.config.labelKey];
        if (t.children) {
          t.render = this.treeRenderContent;
          this.treeListHandle({
            list: t.children
          });
        } else {
          t.render = this.treeChildrenRenderContent;
        }
      });
    },
    //点击菜单触发
    treeChange(obj) {
      this.$emit("treeChange", obj); //触发 v-model
      document.querySelector('.ivu-input[readonly="readonly"]').click();
    }
  }
};
</script>