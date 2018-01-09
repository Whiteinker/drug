<style lang="less" scoped>
	#allmap {
		width: 100%;
		height: 500px;
		overflow: hidden;
		margin: 0;
		font-family: "微软雅黑";
	}
</style>
<template>
	<div class="gps-map">
		<div style='margin-bottom:15px;'>
			<Input v-model="search" placeholder="'请输入关键字" style='width:200px'></Input>
			<Button type="primary" icon="search" @click='searchData'>搜索</Button>
		</div>
		<div id="allmap"></div>
	</div>
</template>

<script>
	export default {
		name: 'commonMap',
		components: {},
		data() {
			return {
				search: '',
				point: {},//point实例
				local:{},//搜索实例
				pointArr: [],
				map: {} //地图实例

			};
		},
		props: ['config', 'formModel'],
		mounted() {
			this.init();
		},
		computed: {},
		methods: {
			init() {
				var self = this;
				let geolocation = new BMap.Geolocation();
				// 百度地图API功能
				this.map = new BMap.Map("allmap");
				this.map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
				this.map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
				this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
//				geolocation.getCurrentPosition(function(r) {
//					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
//						self.map.panTo(r.point);
//					}
//				});
				//添加搜索控件
				this.local = new BMap.LocalSearch(this.map, {
					renderOptions: {
						map: this.map
					}
				});
				//添加定位控件
				var navigationControl = new BMap.NavigationControl({
					// 靠左上角位置
					anchor: BMAP_ANCHOR_TOP_LEFT,
					// LARGE类型
					type: BMAP_NAVIGATION_CONTROL_LARGE,
				});
				this.map.addControl(navigationControl);
				//绑定点击事件
				this.map.addEventListener("click", (e) => {
					this.map.clearOverlays();
					this.pointArr = [e.point.lng, e.point.lat];
					this.point=new BMap.Point(e.point.lng, e.point.lat)
					this.addMarker({
						point: this.point
					});
				});
			},
			//搜索
			searchData() {
				this.local.search(this.search);
			},
			//添加点
			addMarker(opt) {
				var marker = new BMap.Marker(opt.point); // 创建标注
				var label = new BMap.Label(this.formModel['storeName'], {
					offset: new BMap.Size(20, -10)
				});
				marker.setLabel(label);
//				marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				this.map.addOverlay(marker); // 将标注添加到地图中		
			},
			setCenter(opt) {
				let arr = opt.pointArr
				this.point = new BMap.Point(arr[0], arr[1])
				this.map.panTo(this.point);
				this.addMarker({
					point: this.point
				});
			},
			//删除全部覆盖物,
			clearOverlays() {
				this.search = '';
				this.pointArr = [];
				this.map.clearOverlays();
			}

		}

	};
</script>