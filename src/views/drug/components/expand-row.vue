<style lang="less" scoped>
	.expand-row {
		margin-bottom: 16px;
	}
</style>
<template>
	<div>
		<Row class="expand-row">
			<Col span="8">
			<span class="expand-key">包装规格: </span>
			<span class="expand-value">{{ row.specification }}</span>
			</Col>
			<Col span="8">
			<span class="expand-key">使用剂量: </span>
			<span class="expand-value">{{ row.dosage }}</span>
			</Col>
			
		</Row>	
		
	</div>
</template>
<script>
	export default {
		name: 'expandRow',
		components: {},
		data() {
			return {
				

			};
		},
		props: ['row'],
		computed: {

		},
		methods: {

		}

	};
</script>