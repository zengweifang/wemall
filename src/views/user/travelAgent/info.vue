<template>
	<div class="travel-info">
        <div class="content">
          <ul class="input-info">
            <li>
              <div :class="{'dis-color' : isEdit}" class="item">
                <span class="key">经纪人姓名</span>
                <span v-if="!isInitStatus" class="value">{{brokerName}}</span>
                <div v-if="isInitStatus" class="value">
                  <input type="text" name="brokerName" id="brokerName" v-model="brokerName" placeholder="姓名一旦填写不可修改">
                </div>
              </div>
            </li>
            <li>
              <div :class="{'dis-color' : isEdit}" class="item">
                <span class="key">经纪人手机</span>
                <span class="value">{{phone}}</span>
              </div>
            </li>
            <li>
              <div class="item">
                <span class="key">经纪人账户</span>
                <span v-if="!isInitStatus && !isEdit" class="value">{{payAccount}}</span>
                <div v-if="isInitStatus" class="value">
                  <input type="text" name="payAccount" id="payAccount" v-model="payAccount" placeholder="支付宝帐号">
                </div>
                <div v-if="!isInitStatus && isEdit" class="value">
                  <input type="text" name="tmpAccount" id="tmpAccount" v-model="tmpAccount" placeholder="支付宝帐号">
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 提交操作 -->
        <div v-if="isInitStatus" class="operation1">
          <button class="dis-btn" :disabled="!canSubmit" :class="{'active-btn' : canSubmit}" @click="save()">提交</button>
        </div>
        <!-- 编辑资料 立即分享 操作 -->
        <div v-if="!isInitStatus && !isEdit" class="operation2">
          <button class="dis-submit-btn" @click="edit()">编辑资料</button>
          <button class="dis-submit-btn nor-edit-btn" @click="share()">立即分享</button>
        </div>
        <!-- 提交 取消 操作 -->
        <div v-if="!isInitStatus && isEdit" class="operation2">
          <button class="dis-submit-btn" :disabled="!editCanSubmit" :class="{'nor-edit-btn' : editCanSubmit}" @click="update()">提交</button>
          <button class="dis-submit-btn"  @click="cancel()">取消</button>
        </div>
    </div>
</template>
<script>
import { config, service } from "../../../common/config";
import { ajax } from "../../../common/ajax";
import { utils } from "../../../common/utils";
export default {
  name: "travelAgent",
  data() {
    return {
      brokerId: "",
      brokerName: "",
      phone: "",
      payAccount: "",
      groupContentId: "",
      tmpAccount: "",
      isInitStatus: true, // 是否为录入信息 false 为已有经纪人信息
      isEdit: false
    };
  },
  methods: {
    edit() {
      this.isEdit = true;
      this.tmpAccount = this.payAccount;
    },
    cancel() {
      this.isEdit = false;
    },
    share() {
      this.$router.push({name:'travelAgentShareList', query: {groupContentId: this.groupContentId, brokerId: this.brokerId}})
    },
    save() {
      var api = service.common + "/app-background/broker/save";
      var data = {
        brokerName: this.brokerName,
        phone: this.phone,
        payAccount: this.payAccount
      };
      this.$indicator.open({
        spinnerType: "triple-bounce"
      });
      ajax
        .post(api, data)
        .then(res => {
          this.$indicator.close();
          utils.console(res);
          if (utils.getStatusCode(res.code) == 200) {
            this.brokerId = res.data.id;
            this.groupContentId = res.data.groupContentId;
            this.$router.push({name:'travelAgentShareList',query:{isFirst:1, groupContentId: this.groupContentId, brokerId: this.brokerId}})
          } else {
            this.$toast(res.message ? res.message : "保存失败");
          }
        })
        .catch(err => {
          this.$indicator.close();
          this.$toast("网络连接失败，请重试");
        });
    },
    update() {
      var api = service.common + "/app-background/broker/update";
      var data = {
        brokerName: this.brokerName,
        phone: this.phone,
        payAccount: this.tmpAccount
      };
      this.$indicator.open({
        spinnerType: "triple-bounce"
      });
      ajax
        .post(api, data)
        .then(res => {
          this.$indicator.close();
          utils.console(res);
          if (utils.getStatusCode(res.code) == 200) {
            this.$toast(res.message ? res.message : "更新成功");
            this.isEdit = false;
            this.getAgentInfo();
          } else {
            this.$toast(res.message);
          }
        })
        .catch(err => {
          this.$indicator.close();
          this.$toast("网络连接失败，请重试");
        });
    },
    getAgentInfo() {
      this.phone = utils.getCookie("phone");
      var api = service.common + "/app-background/broker/getBroker?phone=" + this.phone;
      this.$indicator.open({
        spinnerType: "triple-bounce"
      });
      var _self = this;
      ajax
        .get(api)
        .then(res => {
          this.$indicator.close();
          if (utils.getStatusCode(res.code) == 200) {
            this.brokerId = res.data.id;
            this.brokerName = res.data.brokerName;
            this.phone = res.data.phone;
            this.payAccount = res.data.payAccount;
            this.groupContentId = res.data.groupContentId;
            this.isInitStatus = false;
          } else if (utils.getStatusCode(res.code) == 404) {
            this.brokerName = "";
            this.payAccount = "";
            this.isInitStatus = true;
          } else {
            _self.$toast(res.message);
          }
        })
        .catch(err => {
          _self.$indicator.close();
          _self.$toast("网络连接失败");
        });
    },
    goBack() {
      utils.goBack();
    }
  },
  watch: {
    brokerName: function(newValue) {
      if (newValue && newValue.length > 30) {
          this.brokerName = newValue.substr(0, 30);
      }
    },
    payAccount: function(newValue) {
      if (newValue && newValue.length > 30) {
          this.payAccount = newValue.substr(0, 30);
      }
    },
    tmpAccount: function(newValue) {
      if (newValue && newValue.length > 30) {
          this.tmpAccount = newValue.substr(0, 30);
      }
    },
  },
  computed: {
    canSubmit() {
      return (
        this.phone &&
        this.brokerName &&
        this.payAccount.length > 3
      );
    },
    editCanSubmit() {
      return this.phone && this.brokerName && this.tmpAccount;
    }
  },
  mounted() {
    this.getAgentInfo();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables.scss";
@import "./info";
</style>