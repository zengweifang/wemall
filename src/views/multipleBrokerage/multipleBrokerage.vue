<template>
	<div class="multipleBrokerage">
        <!--头部标题-->
		<mt-header  title="旺管家生活服务">
		</mt-header>	
		<ul>
            <li @click="goPage(1)">
                <img src="../../assets/imgs/multiplebrokerage_01.jpg" alt="保洁服务">
            </li>
            <li @click="goPage(2)">
                <img src="../../assets/imgs/multiplebrokerage_03.jpg" alt="换锁">
            </li>
            <li @click="goPage(3)">
                <img src="../../assets/imgs/multiplebrokerage_02.jpg" alt="搬家">
            </li>
        </ul>
	</div>
</template>
<script>
export default{
	name: "multipleBrokerage",
	methods:{
		goPage(param){
            switch(param){
                case 1: 
                    this.$router.push({name:'productDetail',params:{goodId:'ff155375-4c15-42b1-be85-2de9c926d83d'},query:{storeId:"e48c104c-7c6b-4bab-8c10-4c7c6b8bab35"}});
                    break;
                case 2: 
                    this.$router.push({name:'productDetail',params:{goodId:'4fbdebd8-bdf1-44fe-8c57-1b8595a8babb'},query:{storeId:"2c1bf22d-087b-4851-9bf2-2d087b7851fd"}});
                    break;
                case 3: 
                    this.$router.push({name:'productList',params:{goodsTypeId:'C2CAC229-E5AC-964C-832C-38A57B66560F'},query:{from: 'multipleBrokerage'}});
                    break;
            }
        }
		
	}	
}
</script>
<style lang="scss" scoped>
.multipleBrokerage{
    width: 100%;
    height: 100%;
    ul{
        width: 100%;
        li{
            width: 100%;
            height: 5.333333rem;
            margin-bottom: .2rem;
            img{
                width: 100%;
                height: 5.333333rem;
            }
        }
    }
}
</style>