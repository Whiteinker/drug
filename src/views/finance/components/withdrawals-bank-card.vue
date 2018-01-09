<style lang="less">
.bank-card-modal {
  .ivu-modal {
    width: 28.5% !important;
  }
  ul {
    margin-left: -10px;
    li {
      float: left;
      margin-left: 10px;
      margin-bottom: 10px;
      position: relative;
      width: 250px;
      height: 145px;
      overflow: hidden;
      border-radius: 5px;
      color: #fff;
      font-size: 14px;
      &:hover {
        .btn-group {
          opacity: 1;
        }
      }
      .bank-name {
        position: absolute;
        top: 15px;
        left: 15px;
      }
      .bank-card-type {
        position: absolute;
        bottom: 15px;
        right: 15px;
      }
      .img {
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        position: absolute;
        top: 50%;
        width: 90%;
        padding: 4px 10px;
        text-align: center;
        font-size: 14px;
        // border: 1px dashed #fff;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-top: -14px;
        left: 50%;
        margin-left: -113.5px;
        letter-spacing: 3px;
        span {
          color: #fff;
        }
      }
      .btn-group {
        opacity: 0;
        background: rgba(0, 0, 0, 0.45);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
        transition: all 0.2s;
        button,
        .ivu-poptip {
          top: 50%;
          position: relative;
        }
        .ivu-poptip:hover .btn-group {
          opacity: 1;
        }
      }
    }
  }
  .ivu-modal-footer {
    display: none;
  }
}

.page-withdrawals-modal {
  .ivu-form-item {
    width: 90%;
  }
}
</style>
<template>
	<div>	
		<Modal class='bank-card-modal' v-model="showCardListModal" width='28.5%' title="管理银行卡" @on-cancel="bankListHandle"> 
      <Spin size="large" fix v-if="tableLoading"></Spin>
			<ul v-else class='clearfix'>
				<li v-for='t in tableList'>
					<div class="bank-name">
						{{t.bankName}}
					</div>
					<div class='bank-card-type'>{{t.cardTypeName}}</div>
					<div class="img" :class='"card-is-cn-"+t.bankCode'>
						<!-- <img src="../../images/bank-card.jpg"> -->
					</div>
					<div class="text">
						<span>{{t.bankCardNumber}}</span>
					</div>
					<div class='btn-group'>
						<Poptip confirm transfer title='您确定要删除这条数据吗?' @on-ok='deleteListData({id:t.id})'>
							<Button type="error" size='small' shape="circle" icon="trash-a">删除</Button>
						</Poptip>

					</div>
				</li>
				<li>
					<Button style='width:100%;height:100%;font-size:16px;' icon='plus-round' type="dashed" @click='openFormModal'>添加银行卡</Button>
				</li>
			</ul>
		</Modal>
		<Modal class='page-withdrawals-modal' v-model="showFormModal" width='400px' title="添加银行卡" :loading='submitFormLoading' @on-ok='submitFormData' @on-cancel="closeFormModal">
			<div class='common-form-box'>
				<Spin size="large" fix v-if="formLoading"></Spin>
				<Form ref="formModel" label-position="right" :label-width="100" :model="formModel" :rules="formRule">
					<FormItem label="真实姓名：" prop="realName">
						<Input v-model="formModel.realName" placeholder="请输入真实姓名"></Input>
					</FormItem>
					<FormItem label="身份证号：" prop="idNumber">
						<Input v-model="formModel.idNumber" placeholder="请输入身份证号"></Input>
					</FormItem>
					<FormItem label="银行卡号：" prop="bankCardNumber">
						<Input v-model="formModel.bankCardNumber" placeholder="请输入银行卡号" @on-blur='bankCardHandle'></Input>
					</FormItem>
					<FormItem label="银行预留手机：" prop="thePhone">
						<Input v-model="formModel.thePhone" placeholder="请填写银行预留手机"></Input>
					</FormItem>
          <FormItem label="银行名称：" prop="bankName" class='hidden'>
						<Input v-model="formModel.bankName"></Input>
					</FormItem>
          <FormItem label="银行编号：" prop="bankCode" class='hidden'>
						<Input v-model="formModel.bankCode"></Input>
					</FormItem>
          <FormItem label="银行卡类型：" prop="cardTypeName" class='hidden'>
						<Input v-model="formModel.cardTypeName"></Input>
					</FormItem>
				</Form>
			</div>
		</Modal>
	</div>
</template>
<script>
import mixins from "@/libs/mixins.js";
import BIN from "bankcardinfo";
// import contrast from 'contrast';
// import banksDB  from 'banks-db';
// import CardInfo  from 'card-info';
import Cookies from "js-cookie";
export default {
  name: "withdrawals-bank-card",
  mixins: [mixins.tableList, mixins.form],
  components: {},
  data() {
    return {
      tableList: [
        // {
        //   bankName:'',
        //   bankCardNumber: "6228480402564890018"
        // },
        // {
        //   bankCardNumber:'6214850212331638'
        // },
        // {
        //   bankCardNumber:'6217000340000565980'
        // },
        // {
        //   bankCardNumber:'6216665000001788266'
        // },
      ],
      showCardListModal: false, //打开银行卡列表弹窗
      config: {
        url: "/bankCard",
        currentPage: 1,
        pageSize: 999
      },
      //搜索字段
      searchFields: {
        userId: Cookies.get("id")
      },
      //添加银行卡表单字段
      formModel: {
        realName: "",
        bankName: "",
        bankCode: "",
        cardTypeName: "",
        bankCardNumber: "",
        idNumber: "",
        thePhone: "",
        userId: Cookies.get("id")
      }
    };
  },
  computed: {},
  async mounted() {
    await this.getListData();
    this.bankListHandle();
  },
  methods: {
    bankListHandle(){
       this.$parent.bankList = this.tableList;
    },
    //银行卡信息处理
    bankCardHandle() {
      BIN.getBankBin(this.formModel.bankCardNumber).then(data => {
        this.formModel.bankName = data.bankName;
        this.formModel.bankCode = data.bankCode.toLowerCase();
        this.formModel.cardTypeName = data.cardTypeName;
      }).catch((err)=>{
        this.$Message.error('识别不了该银行卡');
      });
    }
  }
};
</script>