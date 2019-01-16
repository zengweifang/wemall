<template>
	<div class="travel-list">
        <div class="top">
						<img  v-if="isFirst" src="../../../assets/imgs/share-success.png" width="37px" height="37px">
            <p  v-if="isFirst" class="tips">信息关联成功!</p>
            <h2 class="pick-tips">您可以选择一个商品分享链接或者二维码</h2>
        </div>
        <div class="list">
          <!-- <p class="empty-tips" v-if="isEmpty">没有可分享的商品</p> -->
          <ul class="good-list"
			v-infinite-scroll="getGoodsList" 
			:infinite-scroll-disabled="loadStatus.disabled" 
			infinite-scroll-distance="10">
            <li  class="item" v-for="item in goodlist" @click="share(item)">
              <div class="img-box"><img :src="item.goodsimgurl"></div>
              <p class="item-name">{{item.goodsname}}</p>
              <div class="item-bottom">
                <span class="price">￥{{item.channelPrice}}</span><span class="original-price">￥{{item.price}} <span v-if="item.prickle">/{{item.prickle}}</span></span>
                <button class="share-btn" @click="share(item)">分享</button>
              </div>
            </li>
          </ul>
          <p class="load-tip" @click="getGoodsList()">
              {{loadStatus.text}}
            </p>	
        </div>
    </div>
</template>
<script>
import { config, service } from "../../../common/config";
import { ajax } from "../../../common/ajax";
import { mapActions, mapGetters } from "vuex";
import { utils } from "../../../common/utils";
export default {
  name: "travelAgentShareList",
  data() {
    return {
      brokerId: "",
      brokerName: "",
      phone: "",
      payAccount: "",
      groupContentId: "",
      isFirst: false,
      appId: "",
      townCode: "",
      page: {
        pageSize: 10,
        currentPage: 1
      },
      loadStatus: {
        text: "正在加载中...",
        isError: false,
        disabled: false
      },
      isEmpty: false,
      goodlist: []
    };
  },
  methods: {
    share(item) {
      this.$router.push({
        name: "travelAgentShareDetail",
        query: {
          goodsid: item.goodsid,
          storeId: item.storeId,
          brokerId: this.brokerId
        }
      });
    },
    getGoodsList(reset) {
      if (reset) {
        this.page.currentPage = 1;
        this.loadStatus = {
          text: "正在加载中...",
          isError: false,
          disabled: false
        };
        this.isEmpty = false;
      }
      var api = service.common + "/app-background/home/getContentGroupInfo";
      ajax
        .post(api, {
          page: this.page,
          appId: this.appId,
          townCode: this.townCode,
          contentGroupId: this.groupContentId,
          orderBy: "composite",
        })
        .then(res => {
          if (utils.getStatusCode(res.code) == 200) {
            this.page.currentPage++;
            if (res.data.length > 0) {
              this.goodlist = this.goodlist.concat(res.data);
              if (res.data.length < this.page.pageSize) {
                this.loadStatus.text = "已经到底了";
                this.loadStatus.disabled = true;
              }
            } else {
              if (this.goodlist.length == 0) {
                this.isEmpty = true;
                this.loadStatus.text = "没有商品";
                this.loadStatus.disabled = true;
                return;
              }
              this.loadStatus.text = "已经到底了";
              this.loadStatus.disabled = true;
            }
          } else {
            this.loadStatus.text = "加载出错了,点我重试";
          }
        })
        .catch(err => {
          this.loadStatus.disabled = false;
          this.loadStatus.text = "加载出错了,点我重试";
        });
    },

    goBack() {
      utils.goBack();
    }
  },
  computed: {
    ...mapGetters({
      userAddressList: "userAddressList",
      positionStatus: "positionStatus",
      useRegion: "useRegion"
    })
  },
  mounted() {
    this.isFirst = this.$route.query.isFirst;
    this.brokerId = this.$route.query.brokerId;
    this.groupContentId = this.$route.query.groupContentId;
    this.appId = this.$route.query.we_appId;
    this.townCode = this.useRegion.townCode;

    utils.requireParam(this, "useRegion.townCode", () => {
      this.getGoodsList();
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/variables.scss";
@import "./shareList";
</style>