<template>
	<ul class="goods-list-rank">
		<li v-for="item in listData">
			<div class="content">
				<router-link :to="{name:'productDetail',query:{storeId:item.storeId},params:{goodId:item.goodsid}}">
					<div class="img-area">
					<!-- 	<div class="img" :style="{'background':'url('+item.goodsimgurl+') center center no-repeat','background-size':'auto 100%'}"> -->
							<st-img v-lazy="item.goodsimgurl"></st-img>
						<!-- </div> -->
						<div class="tags">
							<span v-for="tItem in item.goodtag" class="tag" :class="{'new':tItem.type==3,'own':tItem.type!=3}">
								{{tItem.tag}}
							</span>
						</div>
						<div class="status" :class="{'sold-out':item.quantity<=0}"></div>
					</div>
					<div class="info">
						<div class="good-name">						
							<p>{{item.goodsname}}</p>
							<p class="prickle-quantity"><span v-if="item.prickle">{{item.prickle}}</span><span>{{item.quantity>10?'有货':'小于10件'}}</span></p>
						</div>
						<p class="good-price"><span class="price">&yen;{{item.channelPrice}}</span><span class="del-price" v-if="item.channelPrice<item.originalprice">&yen;{{item.originalprice}}</span></p>
					</div>				
				</router-link>
			</div>
		</li>
	</ul>
</template>
<script>
import stImg from '../../../components/img/img';
export default{
	name:'goodListRank',
	data(){
		return {

		}
	},
	props:['listData'],
	components:{
		stImg
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/common.scss';
@import './goodListRank'	
</style>