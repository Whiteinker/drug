import lrz from 'lrz' //图片压缩插件	
import util from '@/libs/util.js';
import Cookies from "js-cookie";
import Store from 'store';
export default {
	//搜索列表
	searchList: {
		data() {
			return {
				searchDaterange: '', //时间段value
				// searchFields: {}, //搜索条件对象
				searchLoading: false, //搜索loading
				searchDaterangeOptions: { //时间段拓展对象
					shortcuts: [{
							text: '一星期前',
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								return [start, end];
							}
						},
						{
							text: '一个月前',
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								return [start, end];
							}
						},
						{
							text: '三个月前',
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								return [start, end];
							}
						}
					]
				}
			}
		},
		computed: {},
		watch: {
			//监听日期选择器的变化
			'searchDaterange' (date) {
				this.searchFields['startDate'] = util.dateFormat(date[0]).split(' ')[0]
				this.searchFields['endDate'] = util.dateFormat(date[1]).split(' ')[0]
			}
		},
		methods: {
			//搜索数据
			async searchData() {
				this.searchLoading = true;
				await this.getListData();
				this.searchLoading = false;
			},
		}
	},
	//表格列表
	tableList: {
		data() {
			return {
				config: {
					url: '', //接口名				
				},
				tableFields: [], //表格配置
				tableLoading: false, //列表loading
				tableList: [], //表格数据
				listStyle: 'navicon', //切换表格，卡片样式   grid卡片|navicon表格
				tableSelection: [] //多选状态下选中的对象数组。
			}
		},
		mounted() {
			//			this.getListData();
		},
		computed: {
			cacheStore(){
				return Store.get('cacheStore');
			  },
		},
		methods: {
			//获取表格数据
			getListData() {
				this.tableLoading = true;
				return this.$ajax({
					url: this.config.url,
					method: 'post',
					data: {
						currentPage: this.config.currentPage,
						pageSize: this.config.pageSize,
						fields: this.searchFields,
					},
					success: (res) => {
						this.tableLoading = false;
						this.tableList = res.data;
						this.config.total = res.total;
						//对药店的特殊处理，每次请求都更新store；
						if (this.config.url == '/store') {
							res.data = res.data.map(t => {
								return {
								  value: t.id,
								  label: t.storeName
								};
							  });
							  Store.set("cacheStore", res.data);
						};
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
					url: this.config.url + '/' + opt.id,
					method: 'delete',
					success: (res) => {
						this.tableLoading = false;
						this.$Message.success('删除成功');
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
			//批量删除表格数据
			async deleteAllListData() {
				if (this.tableSelection.length > 0) {
					this.tableLoading = true;
					for (let i = 0; i < this.tableSelection.length; i++) {
						await this.$ajax({
							url: this.config.url + '/' + this.tableSelection[i].id,
							method: 'delete',
							success: (res) => {},
							error: (res) => {
								this.tableLoading = false;
							}
						});
					};
					this.tableLoading = false;
					this.$Message.success('删除成功');
					if (this.currentPageState) {
						this.config.currentPage = this.config.currentPage - 1;
					}
					this.getListData();
				} else {
					this.$Message.warning('未选择');
				}
			},
			//切换表格，卡片样式
			switchListStyle(style) {
				this.listStyle = style
			},
			//表格多选发生变化时就会触发
			tableSelectionChange(selection) {
				this.tableSelection = selection;
			}
		}
	},
	//分页
	page: {
		data() {
			return {
				config: {
					currentPage: 1, //当前页
					pageSize: 10, //一页显示个数
					total: 0 //总个数
				},
			}
		},
		computed: {
			//删除后当前页切换，判断当前页面是否有数据，没有就跳上一页，第一页不跳。 返回布尔值
			currentPageState() {
				return this.config.total / this.config.pageSize < this.config.currentPage && this.config.currentPage != 1
			}
		},
		methods: {
			//切换页数
			changePage(currentPage) {
				this.config.currentPage = currentPage;
				this.getListData();
			},
			//切换页数显示个数
			changePageSize(pageSize) {
				this.config.pageSize = pageSize;
				this.getListData();
			}
		},
	},
	//表单
	form: {
		data() {
			return {
				formRule: {}, //表单规则
				showSeeFormModal: false, //查看弹窗打开
				showFormModal: false, //弹窗打开
				formLoading: false, //表单loading
				submitFormLoading: true, //表单提交loading
			}
		},
		computed: {},
		methods: {
			//获取数据
			getFormData(opt) {
				this.formLoading = true;
				return this.$ajax({
					url: this.config.url + '/' + opt.id,
					method: 'get',
					success: (res) => {
						this.formLoading = false;
						for (let attr in this.formModel) {
							this.formModel[attr] = res.data[attr]
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
				this.$refs['formModel'].validate((valid) => {
					if (valid) {
						this.submitFormLoading = true;
						this.$ajax({
							url: this.config.url,
							method: 'put',
							data: this.formModel,
							success: (res) => {
								this.showFormModal = false;
								this.submitFormLoading = false;
								setTimeout(() => {
									this.submitFormLoading = true;
								}, 0)
								this.$Message.success(this.formModel.id ? '修改成功' : '新增成功');
								this.closeFormModal();
								this.getListData();
							},
							error: (res) => {
								this.submitFormLoading = false;
								setTimeout(() => {
									this.submitFormLoading = true;
								}, 0)
							}
						});
					} else {
						this.submitFormLoading = false;
						setTimeout(() => {
							this.submitFormLoading = true;
						}, 0)
					}
				})
			},
			//打开表单弹窗
			openFormModal(opt) {
				this.showFormModal = true;
				if (opt && opt.id) {
					this.getFormData({
						id: opt.id
					});
				}
			},
			//打开查看表单弹窗
			openSeeFormModal(opt) {
				this.showSeeFormModal = true;
				if (opt && opt.id) {
					this.getFormData({
						id: opt.id
					});
				}
			},
			//关闭表单弹窗
			closeFormModal() {
				this.showFormModal = false;
				this.$refs['formModel'].resetFields();
				if (this.formModel.id) {
					delete this.formModel.id
				};
			},
			//图片字段base64的处理
			changeFile(e, key) {	
				lrz(e.target.files[0], {
					width: 300,
					height: 300,
					quality: 1
				}).then((res) => {
					this.formModel[key] = res.base64;					
					e.target.setAttribute('type','text')//处理第二次change失效
					e.target.setAttribute('type','file')
				})
			},

		},
	},
	tree: {
		data() {
			return {
				config: {
					url: '', //接口名	
					currentPage: 1, //当前页
					pageSize: 10, //一页显示个数
					total: 0 //总个数
				},
				treeLoading: false, //树loading
				treeEditFormLoading: false,
				treeDropdownVisible: false, //下拉树
				treeList: [], //tree数据
				treeListClone: [], //复制出来的树，用来修改表单里下拉树使用
				treeEditFormModel: {}, //tree修改绑定的model，跟新增的form model不同
			}
		},
		computed: {
			cacheStore(){
				return Store.get('cacheStore');
			  },
			//父菜单增加图标
			treeRenderContent() {
				return (h, {
					root,
					node,
					data
				}) => {
					return h('span', {
						class: 'ivu-tree-title',
						on: {
							click: () => {
								this.treeChange(data);
							}
						}
					}, [
						h('Icon', {
							props: {
								type: 'ios-folder-outline'
							},
							style: {
								marginRight: '8px'
							},

						}), data.title
					]);
				}
			},
			//子菜单增加图标
			treeChildrenRenderContent() {
				return (h, {
					root,
					node,
					data
				}) => {
					return h('span', {
						class: 'ivu-tree-title',
						on: {
							click: () => {
								this.treeChange(data);
							}
						}
					}, [
						h('Icon', {
							props: {
								type: 'ios-paper-outline'
							},
							style: {
								marginRight: '8px'
							}
						}),
						data.title
					]);
				}
			},
			//clone父菜单增加图标
			treeCloneRenderContent() {
				return (h, {
					root,
					node,
					data
				}) => {
					return h('span', {
						class: 'ivu-tree-title',
						on: {
							click: () => {
								this.treeEditChange(data);
							}
						}
					}, [
						h('Icon', {
							props: {
								type: 'ios-folder-outline'
							},
							style: {
								marginRight: '8px'
							},

						}), data.title
					]);
				}
			},
			//clone子菜单增加图标
			treeCloneChildrenRenderContent() {
				return (h, {
					root,
					node,
					data
				}) => {
					return h('span', {
						class: 'ivu-tree-title',
						on: {
							click: () => {
								this.treeEditChange(data);
							}
						}
					}, [
						h('Icon', {
							props: {
								type: 'ios-paper-outline'
							},
							style: {
								marginRight: '8px'
							}
						}),
						data.title
					]);
				}
			},
		},
		mounted() {
			
		},
		methods: {
			
			//获取tree数据
			getTreeData() {
				this.treeLoading = true;
				return this.$ajax({
					url: this.config.url,
					method: 'post',
					data: {
						currentPage: this.config.currentPage,
						pageSize: this.config.pageSize,
						fields: this.searchFields,
					},
					success: (res) => {
						this.treeLoading = false;
						this.treeListHandle({
							list: res.data
						});
						this.treeList = res.data;

						//默认点击一下第一个分类，让右侧内容填充
						//						this.treeChange(res.data[0]);
						this.config.total = res.total;

					},
					error: () => {
						this.treeLoading = false;
					}
				});
			},
			//清除tree表单数据
			clearTreeFormData() {
				this.$refs['treeEditFormModel'].resetFields();
				delete this.treeEditFormModel.id;
				this.treeEditFormModel.ParentName = '顶级分类'
				this.treeCloneList();
			},
			//删除tree数据
			deleteTreeData() {
				this.treeLoading = true;
				this.$ajax({
					url: this.config.url + '/' + this.treeEditFormModel.id,
					method: 'delete',
					success: (res) => {
						this.treeLoading = false;
						this.$Message.success('删除成功');
						this.clearTreeFormData();
						this.getTreeData();
					},
					error: () => {
						this.treeLoading = false;
					}
				});
			},
			//提交修改表单
			editTreeFormData() {
				this.$refs['treeEditFormModel'].validate((valid) => {
					if (valid) {
						if (this.treeEditFormModel.id != this.treeEditFormModel.ParentID) {
							this.treeEditFormLoading = true;
							this.$ajax({
								url: this.config.url,
								method: 'put',
								data: this.treeEditFormModel,
								success: (res) => {
									this.treeEditFormLoading = false;
									this.$Message.success(this.treeEditFormModel.id ? '修改成功' : '新增成功');
									this.getTreeData();
									// this.treeExpandHandle({
									// 	list: this.treeList,
									// 	id: res.data.ID
									// });
									this.clearTreeFormData();

								},
								error: (res) => {
									this.treeEditFormLoading = false;
								}
							});
						} else {
							this.$Message.error('父级分类不能是自己');
						}
					}
				})
			},
			//处理复制出来的树；
			treeCloneList() {
				let cloneList = JSON.parse(JSON.stringify(this.treeList));
				cloneList.unshift({
					title: '顶级分类',
					CategoryName: '顶级分类',
					id: 0
				})
				this.treeCloneListHandle({
					list: cloneList
				});
				this.treeRemoveCloneListHandle({
					list: cloneList
				});
				this.treeListClone = cloneList;
			},
			//点击菜单触发
			treeChange(obj) {
				this.treeEditFormModel.id = obj.id
				for (let attr in this.treeEditFormModel) {
					this.treeEditFormModel[attr] = obj[attr];
				};
				this.treeCloneList();
				//增加一个默认的顶级分类选项
				if (obj.ParentID == 0) {
					this.treeEditFormModel.ParentName = '顶级分类'
				} else {
					this.treeParentNameHandle({
						list: this.treeList,
						parentId: this.treeEditFormModel.ParentID
					});
				}
			},
			//修改下拉框树change的时候
			treeEditChange(obj) {
				this.treeEditFormModel.ParentID = obj.id;
				if (obj.id == 0) {
					this.treeEditFormModel.ParentName = obj.title;
				} else {
					this.treeParentNameHandle({
						list: this.treeListClone,
						parentId: this.treeEditFormModel.ParentID
					});
				}
				document.querySelector('.ivu-input[readonly="readonly"]').click();

			},
			//处理新增修改完，主体树的修改项展开状态；
			treeExpandHandle(opt) {
				for (let i = 0; i < opt.list.length; i++) {
					if (opt.list[i].id == opt.id) {
						opt.list[i].expand = false; //true为全展开，false全收起
						return false
					}
					if (opt.list[i].children) {
						this.treeExpandHandle({
							list: opt.list[i].children,
							id: opt.id
						})
					}
				}
			},
			//递归获取父级name
			treeParentNameHandle(opt) {
				for (let i = 0; i < opt.list.length; i++) {
					if (opt.list[i].id == opt.parentId) {
						this.treeEditFormModel.ParentName = opt.list[i].CategoryName
						return false
					}
					if (opt.list[i].children) {
						this.treeParentNameHandle({
							list: opt.list[i].children,
							parentId: this.treeEditFormModel.ParentID
						})
					}
				}
			},
			//递归处理添加tree组件需要的title键，和父子菜单增加图标
			treeListHandle(opt) {
				opt.list.forEach((t) => {
					t.title = t.CategoryName;
					t.expand = false; //true为全展开，false全收起
					if (t.children) {
						t.render = this.treeRenderContent;
						this.treeListHandle({
							list: t.children
						})
					} else {
						t.render = this.treeChildrenRenderContent;
					}
				})
			},
			//递归处理clone添加tree组件需要的title键，和父子菜单增加图标
			treeCloneListHandle(opt) {
				opt.list.forEach((t, i) => {
					t.title = t.CategoryName;
					if (t.children) {
						t.render = this.treeCloneRenderContent;
						this.treeCloneListHandle({
							list: t.children
						})
					} else {
						t.render = this.treeCloneChildrenRenderContent;
					}
				})
			},
			//递归处理clone添加tree组件   删除当前选中的分类，不让他选自己和自己下面的分类作为父级
			treeRemoveCloneListHandle(opt) {
				opt.list.forEach((t, i) => {
					if (t.id == this.treeEditFormModel.id) {
						opt.list.splice(i, 1)
					};
					if (t.children) {
						this.treeRemoveCloneListHandle({
							list: t.children
						})
					}
				});
			},

		},
	}

}