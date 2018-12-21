<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-image: url("../images/login_bg3.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  &-con {
    position: absolute;
    //      right: 160px;
    right: 50%;
    margin-right: -150px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
  .ivu-card {
    background: rgba(255, 255, 255, 0.95);
    .ivu-input {
      background-color: rgba(255, 255, 255, 0);
    }
  }
}
</style>

<template>
  <div class="login"
       @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          药品配送平台
        </p>
        <div class="form-con">
          <Form ref="loginForm"
                :model="form"
                :rules="rules">
            <FormItem prop="mobile">
              <Input v-model="form.mobile"
                     placeholder="请输入手机号">
              <span slot="prepend">
                <Icon :size="16"
                      type="ios-telephone"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password"
                     v-model="form.password"
                     placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14"
                      type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit"
                      :loading='loading'
                      type="primary"
                      long>登录</Button>
            </FormItem>
          </Form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import Store from "store";
export default {
  data () {
    return {
      loading: false,
      form: {
        mobile: "",
        password: ""
      },
      rules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$ajax({
            url: "/login",
            method: "post",
            data: this.form,
            success: res => {
              this.loading = false;
              Cookies.set("password", this.form.password);
              Cookies.set("user", res.data.userName);
              Cookies.set("id", res.data.id); //账户的id
              Cookies.set("money", res.data.money); //账户的余额
              this.$store.commit("setAvator", res.data.headerPhoto);
              if (this.form.userName === "iview_admin") {
                Cookies.set("access", 0);
              } else {
                Cookies.set("access", 1);
              }
              this.$store.commit("updateMenulist");
              this.cacheStore();
              this.$router.push({
                name: "home_index"
              });
            },
            error: () => {
              this.loading = false;
            }
          });
        }
      });
    },
    //药店localStorage缓存
    cacheStore () {
      return this.$ajax({
        url: "/store",
        method: "post",
        data: {
          currentPage: 1,
          pageSize: 99999,
          fields: {
            userId: Cookies.get("id")
          }
        },
        success: res => {
          res.data = res.data.map(t => {
            return {
              value: t.id,
              label: t.storeName
            };
          });
          Store.set("cacheStore", res.data);
        }
      });
    }
  }
};
</script>

<style>
</style>