<style lang="less">
.page-withdrawals {
  .bank-card-item {
    .ivu-alert {
      cursor: pointer;
      .ivu-alert-icon {
        img {
          width: 20px;
          height: 20px;
          margin-left: -4px;
          margin-top: -3px;
        }
      }
    }
    .ivu-select-dropdown {
      .ivu-dropdown-item {
        border-bottom: 1px dashed #dddee1;
        &:last-child {
          border: none;
        }
        .ivu-avatar {
          vertical-align: -12px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
<template>
	<div class='page-withdrawals'>
		<Row>
			<Col span="24">
			<Card>
				<div slot="title" class="common-table-title">
					<p>提现操作</p>
					<div class="action">
					</div>
				</div>
				<Alert type="warning" show-icon closable>
					注意事项：
					<template slot="desc">
						1.请认真填写打款信息，如有修改，请联系工作人员。<br /> 2.每月的1、2、16、17号为申请打款时间，15号、月尾日为打款时间，确保用户有半个月的追诉期。
					</template>
				</Alert>
				<div class='common-form-box'>
					<Form class='withdrawals' ref="formModel" :model="formModel" :rules="formRule" :label-width="95">
						<FormItem label="账户余额：" style='width:230px;'>
              	<Spin size="large" fix v-if="getRemainMoneyLoading"></Spin>
							<span v-else class='balance'>{{remainMoney}}</span> 元
						</FormItem>
						<FormItem class='bank-card-item' label="选择银行卡：" prop="bankCardNumber" style='width:580px;'>							
              <Select style='width:300px;' transfer v-model='formModel.bankCardNumber' placeholder="请选择银行" filterable clearable>  
							  <Option v-for="t in bankList" :value="t.bankCardNumber">
                  <span :class='"card-is-cn-"+t.bankCode' style='width: 10px;    height: 10px;    border-radius: 100%;    display: inline-block;    margin-right: 5px;'></span>
                  <span>{{t.bankName}}/</span>{{t.bankCardNumber}}
                  </Option>
			      	</Select>
							<Button icon='card' type="dashed" @click='openBankCardListModel'>管理</Button>
						</FormItem>
						<FormItem label="提现金额：" prop="withdrawalsMoney" style='width:200px;'>
              <InputNumber style='width:75%' :max="10000" :min="1" v-model="formModel.withdrawalsMoney"  placeholder="请输入提现金额"></InputNumber>							
							<span style='margin-left:5px;'> 元</span>
							</Input>
						</FormItem>
            <FormItem label="提现密码：" prop="withdrawalsPassword" style='width:300px;'>
						<Input v-model="formModel.withdrawalsPassword" type='password' placeholder="请输入提现密码"></Input>
					</FormItem>
						<FormItem>
							<Button :loading='submitFormLoading' type="primary" @click='submitFormData'>提现</Button>
						</FormItem>
					</Form>
				</div>
			</Card>
			</Col>
		</Row>
    <withdrawalsBankCard ref='withdrawalsBankCard'></withdrawalsBankCard>
		<Row class='margin-top-10'>
			<Col span="24">
			<withdrawalsRecord ref='withdrawalsRecord'></withdrawalsRecord>
			</Col>
		</Row>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import Cookies from "js-cookie";
import withdrawalsBankCard from "@/views/finance/components/withdrawals-bank-card.vue";
import withdrawalsRecord from "@/views/finance/components/withdrawals-record.vue";
export default {
  name: "withdrawals",
  mixins: [mixins.tableList, mixins.form],
  components: {
    withdrawalsRecord,
    withdrawalsBankCard
  },
  data() {
    return {
      submitFormLoading:false,
      remainMoney: "", //账户余额
      getRemainMoneyLoading: false,
      bankList: [], //银行卡列表 ,从withdrawalsBankCard组件中获取
      config: {
        url: "/cashManagement",
        currentPage: 1,
        pageSize: 999
      },
      //搜索字段
      searchFields: {
        userId: Cookies.get("id")
      },
      //添加银行卡表单字段
      formModel: {
        bankCardNumber: "",
        withdrawalsMoney: 1,
        withdrawalsPassword: "",
        userId: Cookies.get("id")
      },
      formRule: {
        bankCardNumber: [
          {
            required: true,
            message: "银行卡号不能为空"
          }
        ],
        withdrawalsMoney: [
          {
            required: true,
            message: "提现金额不能为空"
          }
        ],
        withdrawalsPassword: [
          {
            required: true,
            message: "提现密码不能为空"
          },
          {
            min: 6,
            max: 14,
            message: "必须是6-14位"
          },
          {
            pattern: /^\w+$/,
            message: "必须是数字/字母/下划线"
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.getRemainMoney();
  },

  methods: {
    //获取余额
    getRemainMoney() {
      this.getRemainMoneyLoading = true;
      this.$ajax({
        url: "/user/" + this.searchFields.userId,
        method: "get",
        data: {},
        success: res => {
          this.getRemainMoneyLoading = false;
          this.remainMoney = res.data.money;
        },
        error: res => {
          this.getRemainMoneyLoading = false;
        }
      });
    },
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
              this.$Message.success("提交成功");
              this.closeFormModal();
              this.$refs["withdrawalsRecord"].getListData();
              this.remainMoney = res.data.money;
            },
            error: res => {
              this.submitFormLoading = false;
            }
          });
        }
      });
    },
    //打开银行卡列表弹窗
    openBankCardListModel() {
      this.$refs["withdrawalsBankCard"].showCardListModal = true;
    }
  }
};
</script>