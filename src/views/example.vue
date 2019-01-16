<template>
	<div class="ex">
		
	</div>
</template>
<script>
import {config,service} from '../../common/config';
import {ajax} from '../../common/ajax';
import {utils} from '../../common/utils';	
export default{
	name:'',
	data(){
		return{

		}
	},
	components:{
		'mt-header':Header
	},
	computed:{
		...mapGetters({
			userAddressList: 'userAddressList',
			positionStatus:'positionStatus',
			useRegion:'useRegion'
		})
	},	
	methods:{
		...mapActions([
			'setUserAddressList',
			'setSelServiceRegion'
		]),
	},
	mounted(){

	}
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
@import './';	
</style>