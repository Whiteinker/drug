<style lang="less">

</style>
<template>
	<div>
		<Card>
			<p slot="title">
				{{$store.getters.currentPageNameCN}}
			</p>
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>				
				<Form ref="formModel" label-position="right" :model="formModel" :rules="formRule" :label-width="100" inline>
					<FormItem label="账号：" prop="mobile">
						<span>{{formModel.mobile}}</span>
					</FormItem>
					<FormItem label="用户头像：" prop="headerPhoto" class='common-file-base64' style='display: block;'>
						<Avatar icon="upload" shape='square' size="large" :src='formModel.headerPhoto'></Avatar>
						<input type="file" title='选择上传文件' @change='changeFile($event,"headerPhoto")' />
					</FormItem>
					<FormItem label="用户姓名：" prop="storeName" style='width:300px;'>
						<Input v-model="formModel.userName" placeholder="请输入用户姓名："></Input>
					</FormItem>					
					<FormItem style='display:block'>
						<Button type="primary" :loading="submitFormLoading" @click="submitFormData">保存</Button>
					</FormItem>
				</Form>
			</div>
		</Card>		
	</div>
</template>

<script>
import Cookies from "js-cookie";
import mixins from "@/libs/mixins.js";
export default {
  name: "ownSpace",
  mixins: [mixins.form],
  components: {},
  data() {
    return {
       submitFormLoading:false,
      mapModal: false,
      config: {
        url: "/user"
      },
      //表单数据字段
      formModel: {
        headerPhoto: "",
        mobile: "",
        userName: ""
      }
    };
  },
  mounted() {
    this.getFormData({
      id: Cookies.get("id")
    });
  },
  computed: {},
  methods: {
    //提交表单
    submitFormData() {
      this.$refs["formModel"].validate(valid => {
        if (valid) {
          this.submitFormLoading = true;
         this.$ajax({
            url: this.config.url,
            method: "put",
            data: this.formModel,
            success: res => {
              this.submitFormLoading = false;
              this.$Message.success("修改成功");
              this.getFormData({
            id: Cookies.get("id")
          });
          Cookies.set("user", this.formModel.userName);
          this.$store.commit("setAvator", this.formModel.headerPhoto);
            },
            error: res => {
              this.submitFormLoading = false;
            }
          });
          
        }
      });
    }
  }
};
</script>