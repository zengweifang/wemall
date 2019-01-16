<template>
	<div class="travel-share-deatil">
        <div class="share-tips" v-if="isWeChat">
          <img src="../../../assets/imgs/share-tips.png" alt="分享" width="90rem" height="31rem">
        </div>
        <div class="container">
          <div class="content" v-if="goodDetail">
            <div class="img-box" @click="toDetail()">
              <img :src="goodDetail.imageurl">
            </div>
            <p class="good-name">{{goodDetail.name}}</p>
            <div class="price-section">
              <span class="price">￥{{goodDetail.price}} <span v-if="goodDetail.prickle">{{goodDetail.prickle}}</span> </span>
              <span class="org-price">￥{{goodDetail.originalPrice}}</span>
            </div>
            <div class="bottom">
              <div class="logo"><img src="../../../assets/imgs/travel-logo.png" width="128rem" height="60rem"></div>
              <div class="qr">
                <p class="tips">扫码查看详情</p>
                <div class="qrcode-box">
                  <div class="inner-box">
                    <img :src="qrcodeURLImageURL" class="qrcode">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { config, service } from "../../../common/config";
import { ajax } from "../../../common/ajax";
import { utils } from "../../../common/utils";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "travelAgentShareDetail",
  data() {
    return {
      goodsid: "",
      storeId: "",
      userId: "",
      appId: "",
      ADTAG: "",
      brokerId: "",
      goodDetail: null,
      goodsDetailURL: "",
      qrcodeURLImageURL: "",
      townCode: "",
      isWeChat: false
    };
  },
  methods: {
    toDetail() {
      if (this.goodsDetailURL) {
        this.$router.push({
          name: "productDetail",
          params: {
            goodId: this.goodsid,
          },
          query: {
            storeId: this.storeId,
            brokerId: this.brokerId
          }
        });
      }
    },
    getQrcode(url) {
      var api = service.upload + "/qrcode/create";
      var data = {
        content: url,
        access_key:
          this.brokerId +
          this.goodsid +
          this.storeId +
          this.appId +
          location.host +
          "2"
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
            this.qrcodeURLImageURL = service.static + "/" + res.data.url;
          } else {
            this.$toast(res.message);
          }
        })
        .catch(err => {
          this.$indicator.close();
          this.$toast("加载二维码失败，请重试");
        });
    },
    getShortURL(url) {
      var api = `${service.common}/app-background/shortUrl/get`;
      var _self = this;
      ajax
        .get(api, {
          params: {
            longUrl: url
          }
        })
        .then(res => {
          if (utils.getStatusCode(res.code) == 200) {
            this.getQrcode(res.data);
          } else {
            _self.$toast(res.message);
          }
        })
        .catch(err => {
          _self.$toast("网络连接失败");
        });
    },
    getGoodsDetail() {
      var api = `${service.common}/app-background/goods/gooddetail.api`;
      this.$indicator.open({
        spinnerType: "triple-bounce"
      });
      var _self = this;
      ajax
        .get(api, {
          headers: {
            "Wgj-Position": this.townCode
          },
          params: {
            groupNumber: "11",
            goodId: this.goodsid,
            storeId: this.storeId,
            appId: this.appId,
            userId: this.userId
          }
        })
        .then(res => {
          this.$indicator.close();
          if (utils.getStatusCode(res.code) == 200) {
            this.goodDetail = res.data;
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
  computed: {
    ...mapGetters({
      selServiceRegion: "selServiceRegion",
      autoRegion: "autoRegion",
      useRegion: "useRegion",
      pos: "pos",
      positionStatus: "positionStatus"
    })
  },
  mounted() {
    this.goodsid = this.$route.query.goodsid;
    this.storeId = this.$route.query.storeId;
    this.appId = this.$route.query.we_appId;
    this.ADTAG = this.$route.query.ADTAG;
    this.userId = utils.getCookie("userId");
    this.isWeChat = utils.isWeixin();
    this.brokerId = this.$route.query.brokerId;
    this.goodsDetailURL = `${location.origin}/wemall/product/detail/${
      this.goodsid
    }?storeId=${this.storeId}&brokerId=${this.brokerId}&we_appId=${this.appId}`;
    this.getShortURL(this.goodsDetailURL);
    utils.requireParam(this, "useRegion.townCode", () => {
      this.townCode = this.useRegion.townCode;
      this.getGoodsDetail();
    });
    // this.testurl = 'http://dwz.cn/7EpPG8';
    // this.qrcodeURLImageURL = `http://pan.baidu.com/share/qrcode?w=214&h=214&url=${this.goodsDetailURL}`
    // this.getQrcode(this.goodsDetailURL);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables.scss";
@import "./shareDetail";
</style>