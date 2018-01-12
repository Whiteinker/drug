import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: 'Login - 登录'
	},
	component: resolve => {
		require(['./views/login.vue'], resolve);
	}
};

export const page404 = {
	path: '/*',
	name: 'error_404',
	meta: {
		title: '404-页面不存在'
	},
	component: resolve => {
		require(['./views/error_page/404.vue'], resolve);
	}
};

export const page401 = {
	path: '/401',
	meta: {
		title: '401-权限不足'
	},
	name: 'error_401',
	component: resolve => {
		require(['./views/error_page/401.vue'], resolve);
	}
};

export const page500 = {
	path: '/500',
	meta: {
		title: '500-服务端错误'
	},
	name: 'error_500',
	component: resolve => {
		require(['./views/error_page/500.vue'], resolve);
	}
};

export const preview = {
	path: '/preview',
	name: 'preview',
	component: resolve => {
		require(['./views/form/article-publish/preview.vue'], resolve);
	}
};

export const locking = {
	path: '/locking',
	name: 'locking',
	component: resolve => {
		require(['./views/main_components/locking-page.vue'], resolve);
	}
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	component: Main,
	children: [{
			path: 'home',
			title: {
				i18n: 'home'
			},
			name: 'home_index',
			component: resolve => {
				require(['./views/home/home.vue'], resolve);
			}
		},
		{
			path: 'ownspace',
			title: '用户信息',
			name: 'ownspace_index',
			component: resolve => {
				require(['./views/own-space/own-space.vue'], resolve);
			}
		},
		{
			path: 'editPassword',
			title: '修改密码',
			name: 'editPassword',
			component: resolve => {
				require(['./views/own-space/editPassword.vue'], resolve);
			}
		},
		{
			path: 'editWithdrawalsPassword',
			title: '修改提现密码',
			name: 'editWithdrawalsPassword',
			component: resolve => {
				require(['./views/own-space/editWithdrawalsPassword.vue'], resolve);
			}
		},
		//		{
		//			path: 'order/:order_id',
		//			title: '订单详情',
		//			name: 'order_info',
		//			component: resolve => {
		//				require(['./views/advanced-router/component/order-info.vue'], resolve);
		//			}
		//		}, // 用于展示动态路由
		{
			path: 'shopping',
			title: '购物详情',
			name: 'shopping',
			component: resolve => {
				require(['./views/advanced-router/component/shopping-info.vue'], resolve);
			}
		}, // 用于展示带参路由
		{
			path: 'message',
			title: '消息中心',
			name: 'message_index',
			component: resolve => {
				require(['./views/message/message.vue'], resolve);
			}
		}
	]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	{
			path: '/store',
			icon: 'ios-medkit', 
			name: 'store',
			title: '药店列表',
			component: Main,
			children: [{
					path: 'index',
					title: '药店列表',
					name: 'store-index',
					component: resolve => {
						require(['./views/store/store.vue'], resolve);
					}
				},
	
			]
		},
	{
		path: '/order',
		icon: 'clipboard',
		name: 'order',
		title: '订单列表',
		component: Main,
		children: [{
				path: 'index',
				title: '订单列表',
				name: 'order-index',
				component: resolve => {
					require(['./views/order/order.vue'], resolve);
				}
			},

		]
	},
	{
		path: '/drug',
		icon: 'cube',
		name: 'drug',
		title: '药品管理',
		component: Main,
		children: [{
				path: 'index',
				icon: 'ios-medkit',
				title: '药品列表',
				name: 'drug-index',
				component: resolve => {
					require(['./views/drug/drug.vue'], resolve);
				}
			},
			{
				path: 'classification',
				icon: 'ios-barcode',
				title: '药品分类',
				name: 'drug-classification',
				component: resolve => {
					require(['./views/drug/drugClassification.vue'], resolve);
				}
			},

		]
	},
	{
		path: '/distri',
		icon: 'android-bicycle',
		name: 'distri',
		title: '配送员管理',
		component: Main,
		children: [{
				path: 'user',
				icon: 'android-bicycle',
				title: '配送员列表',
				name: 'distri-user',
				component: resolve => {
					require(['./views/distri/distriUser.vue'], resolve);
				}
			},
//			{
//				path: 'record',
//				icon: 'ios-list',
//				title: '配送记录列表',
//				name: 'distri-record',
//				component: resolve => {
//					require(['./views/distri/distriRecord.vue'], resolve);
//				}
//			},

		]
	},
	// {
	// 	path: '/guest',
	// 	icon: 'ios-person',
	// 	name: 'guest',
	// 	title: '客户信息',
	// 	component: Main,
	// 	children: [{
	// 			path: 'index',
	// 			title: '客户信息列表',
	// 			name: 'guest-index',
	// 			component: resolve => {
	// 				require(['./views/guest/guest.vue'], resolve);
	// 			}
	// 		},

	// 	]
	// },
	{
		path: '/dataChart',
		icon: 'connection-bars',
		name: 'dataChart',
		title: '数据统计',
		component: Main,
		children: [{
				path: 'drugChart',
				title: '药品销售统计',
				icon: 'ios-medkit',
				name: 'drugChart',
				component: resolve => {
					require(['./views/dataChart/drugChart.vue'], resolve);
				}
			},
			{
				path: 'guestChart',
				title: '客户统计',
				icon: 'ios-person',
				name: 'guestChart',
				component: resolve => {
					require(['./views/dataChart/guestChart.vue'], resolve);
				}
			},
			{
				path: 'evaluateChart',
				title: '评价统计',
				icon: 'android-textsms',
				name: 'evaluateChart',
				component: resolve => {
					require(['./views/dataChart/evaluateChart.vue'], resolve);
				}
			},

		]
	},
	{
		path: '/finance',
		icon: 'social-yen',
		name: 'finance',
		title: '财务管理',
		component: Main,
		children: [{
				path: 'capitalFlow',
				icon: 'document-text',
				title: '资金流水',
				name: 'capitalFlow',
				component: resolve => {
					require(['./views/finance/capitalFlow.vue'], resolve);
				}
			}, {
				path: 'withdrawals',
				icon: 'card',
				title: '现金提现',
				name: 'withdrawals',
				component: resolve => {
					require(['./views/finance/withdrawals.vue'], resolve);
				}
			}

		]
	},
	{
		path: '/textNode',
		icon: 'social-yen',
		name: 'textNode',
		title: '测试node接口',
		component: Main,
		children: [{
				path: 'user',
				icon: 'document-text',
				title: '用户表',
				name: 'user',
				component: resolve => {
					require(['./views/testNode/user.vue'], resolve);
				}
			}
		]
	}
	// {
	// 	path: '/systemSetup',
	// 	icon: 'gear-a',
	// 	name: 'systemSetup',
	// 	title: '系统设置',
	// 	component: Main,
	// 	children: [{
	// 			path: 'ownspace',
	// 			icon: 'card',
	// 			title: '用户信息',
	// 			name: 'ownspace_index2',
	// 			component: resolve => {
	// 				require(['./views/own-space/own-space.vue'], resolve);
	// 			}
	// 		},
	// 		{
	// 			path: 'editPassword',
	// 			icon: 'card',
	// 			title: '修改密码',
	// 			name: 'editPassword2',
	// 			component: resolve => {
	// 				require(['./views/own-space/editPassword.vue'], resolve);
	// 			}
	// 		}

	// 	]
	// },
	//	{
	//		path: '/access',
	//		icon: 'key',
	//		name: 'access',
	//		title: '权限管理',
	//		component: Main,
	//		children: [{
	//			path: 'index',
	//			title: '权限管理',
	//			name: 'access_index',
	//			component: resolve => {
	//				require(['./views/access/access.vue'], resolve);
	//			}
	//		}]
	//	},
	//	{
	//		path: '/access-test',
	//		icon: 'lock-combination',
	//		title: '权限测试页',
	//		name: 'accesstest',
	//		access: 0,
	//		component: Main,
	//		children: [{
	//			path: 'index',
	//			title: '权限测试页',
	//			name: 'accesstest_index'
	//		}]
	//	},
	//	{
	//		path: '/international',
	//		icon: 'earth',
	//		title: {
	//			i18n: 'international'
	//		},
	//		name: 'international',
	//		component: Main,
	//		children: [{
	//			path: 'index',
	//			title: {
	//				i18n: 'international'
	//			},
	//			name: 'international_index',
	//			component: resolve => {
	//				require(['./views/international/international.vue'], resolve);
	//			}
	//		}]
	//	},
	//	{
	//		path: '/component',
	//		icon: 'social-buffer',
	//		name: 'component',
	//		title: '组件',
	//		component: Main,
	//		children: [{
	//				path: 'text-editor',
	//				icon: 'compose',
	//				name: 'text-editor',
	//				title: '富文本编辑器',
	//				component: resolve => {
	//					require(['./views/my_components/text-editor/text-editor.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'md-editor',
	//				icon: 'pound',
	//				name: 'md-editor',
	//				title: 'Markdown编辑器',
	//				component: resolve => {
	//					require(['./views/my_components/markdown-editor/markdown-editor.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'image-editor',
	//				icon: 'crop',
	//				name: 'image-editor',
	//				title: '图片预览编辑',
	//				component: resolve => {
	//					require(['./views/my_components/image-editor/image-editor.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'draggable-list',
	//				icon: 'arrow-move',
	//				name: 'draggable-list',
	//				title: '可拖拽列表',
	//				component: resolve => {
	//					require(['./views/my_components/draggable-list/draggable-list.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'area-linkage',
	//				icon: 'ios-more',
	//				name: 'area-linkage',
	//				title: '城市级联',
	//				component: resolve => {
	//					require(['./views/my_components/area-linkage/area-linkage.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'file-upload',
	//				icon: 'android-upload',
	//				name: 'file-upload',
	//				title: '文件上传',
	//				component: resolve => {
	//					require(['./views/my_components/file-upload/file-upload.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'count-to',
	//				icon: 'arrow-graph-up-right',
	//				name: 'count-to',
	//				title: '数字渐变',
	//				component: resolve => {
	//					require(['./views/my_components/count-to/count-to.vue'], resolve);
	//				}
	//			}
	//		]
	//	},
	//	{
	//		path: '/form',
	//		icon: 'android-checkbox',
	//		name: 'form',
	//		title: '表单编辑',
	//		component: Main,
	//		children: [{
	//				path: 'artical-publish',
	//				title: '文章发布',
	//				name: 'artical-publish',
	//				icon: 'compose',
	//				component: resolve => {
	//					require(['./views/form/article-publish/article-publish.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'workflow',
	//				title: '工作流',
	//				name: 'workflow',
	//				icon: 'arrow-swap',
	//				component: resolve => {
	//					require(['./views/form/work-flow/work-flow.vue'], resolve);
	//				}
	//			}
	//
	//		]
	//	},
	// {
	//     path: '/charts',
	//     icon: 'ios-analytics',
	//     name: 'charts',
	//     title: '图表',
	//     component: Main,
	//     children: [
	//         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('./views/access/access.vue') },
	//         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('./views/access/access.vue') }
	//     ]
	// },
	//	{
	//		path: '/tables',
	//		icon: 'ios-grid-view',
	//		name: 'tables',
	//		title: '表格',
	//		component: Main,
	//		children: [{
	//				path: 'dragableTable',
	//				title: '可拖拽排序',
	//				name: 'dragable-table',
	//				icon: 'arrow-move',
	//				component: resolve => {
	//					require(['./views/tables/dragable-table.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'editableTable',
	//				title: '可编辑表格',
	//				name: 'editable-table',
	//				icon: 'edit',
	//				component: resolve => {
	//					require(['./views/tables/editable-table.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'searchableTable',
	//				title: '可搜索表格',
	//				name: 'searchable-table',
	//				icon: 'search',
	//				component: resolve => {
	//					require(['./views/tables/searchable-table.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'exportableTable',
	//				title: '表格导出数据',
	//				name: 'exportable-table',
	//				icon: 'code-download',
	//				component: resolve => {
	//					require(['./views/tables/exportable-table.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'table2image',
	//				title: '表格转图片',
	//				name: 'table-to-image',
	//				icon: 'images',
	//				component: resolve => {
	//					require(['./views/tables/table-to-image.vue'], resolve);
	//				}
	//			}
	//		]
	//	},
	//	{
	//		path: '/advanced-router',
	//		icon: 'ios-infinite',
	//		name: 'advanced-router',
	//		title: '高级路由',
	//		component: Main,
	//		children: [{
	//				path: 'mutative-router',
	//				title: '动态路由',
	//				name: 'mutative-router',
	//				icon: 'link',
	//				component: resolve => {
	//					require(['./views/advanced-router/mutative-router.vue'], resolve);
	//				}
	//			},
	//			{
	//				path: 'argument-page',
	//				title: '带参页面',
	//				name: 'argument-page',
	//				icon: 'android-send',
	//				component: resolve => {
	//					require(['./views/advanced-router/argument-page.vue'], resolve);
	//				}
	//			}
	//		]
	//	},
	//	{
	//		path: '/error-page',
	//		icon: 'android-sad',
	//		title: '错误页面',
	//		name: 'errorpage',
	//		component: Main,
	//		children: [{
	//			path: 'index',
	//			title: '错误页面',
	//			name: 'errorpage_index',
	//			component: resolve => {
	//				require(['./views/error_page/error-page.vue'], resolve);
	//			}
	//		}]
	//	}
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	preview,
	locking,
	...appRouter,
	page500,
	page401,
	page404
];