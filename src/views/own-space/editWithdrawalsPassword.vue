<style lang="less">
.page-edit-withdrawals-password{
	.ivu-form-item{
		width: 300px;
	}
}
</style>

<template>
	<div class='page-edit-withdrawals-password'>
		<Card>
			<p slot="title">
				{{$store.getters.currentPageNameCN}}
			</p>
			<div class="common-form-box" style='padding:0'>
				<Form ref="formModel" label-position="right" :model="formModel" :rules="formRule" :label-width="100">
					<FormItem label="旧密码：" prop="oldPassword">
						<Input v-model="formModel.oldPassword" type='password' placeholder="请输入旧密码"></Input>
					</FormItem>
					<FormItem label="新密码：" prop="newPassword">
						<Input v-model="formModel.newPassword" type='password' placeholder="请输入新密码"></Input>
					</FormItem>
					<FormItem label="确认密码：" prop="newPassword2">
						<Input v-model="formModel.newPassword2" type='password' placeholder="请输入确认密码"></Input>
					</FormItem>
					<FormItem>
						<Button type="primary" :loading="submitFormLoading" @click="submitFormData">修改</Button>
					</FormItem>
				</Form>
			</div>
		</Card>
	</div>
</template>

<script>
	import Cookies from 'js-cookie';
	import mixins from '@/libs/mixins.js'
	export default {
		name: 'editWithdrawalsPassword',
		components: {},
		mixins: [mixins.form],
		data() {
			//密码验证器
			const valideRePassword = (rule, value, callback) => {
				if(value !== this.formModel.newPassword) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};
			return {
				 submitFormLoading:false,
				config: {
					url: '/withdrawalsPassword',
				},
				formRule: {
					oldPassword: [{
						required: true,
						message: '请输入旧密码'
					}],
					newPassword: [{
							required: true,
							message: '请输入新密码'
						},
						{
							min: 6,
							message: '请至少输入6个字符'
						},
						{
							max: 32,
							message: '最多输入32个字符'
						}
					],
					newPassword2: [{
							required: true,
							message: '请再次输入新密码'
						},
						{
							validator: valideRePassword
						}
					]
				},
				formModel: {
					oldPassword: '',
					newPassword: '',
					newPassword2: ''
				},
			}
		},
		mounted() {},
		computed: {},
		methods: {
			//提交表单
			submitFormData() {
				this.$refs['formModel'].validate((valid) => {
					if(valid) {
						this.submitFormLoading = true;
						this.$ajax({
							url: this.config.url,
							method: 'put',
							data: {
								id: Cookies.get('id'),
								oldPassword: this.formModel.oldPassword,
								newPassword: this.formModel.newPassword,
							},
							success: (res) => {
								this.submitFormLoading = false;
								this.$Message.success('修改成功');
								this.$refs['formModel'].resetFields();
							},
							error: (res) => {
								this.submitFormLoading = false;
							}
						});
					}
				})
			}
		}
	};
</script>