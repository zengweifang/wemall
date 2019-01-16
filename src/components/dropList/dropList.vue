<template>
	<ul class="dropdown-list" :class="{'right':type=='right'}">
		<slot></slot>
	</ul>		
</template>
<script>
	export default{
		name:'dropdown-list',
		props:['list','type']
	}
</script>
<style lang="scss" scoped>
	.dropdown-list{
	    position: absolute;
	    width: 120px;
	    background-color: #fff;
	    top: 36px;
	    left: -18px;
		border: 1px solid #e1e1e1;

	    li{
	    	height:1.12rem;
	    	line-height: 1.12rem;
			padding-left:0.32rem;
			color:#333;
			a{
				color:#888;
				display:inline-block;
				width:100%;
				height:100%;
			}
	    }
	}
	ul:before{
	    border: 6px inset;
	    border-color: transparent transparent #ccc;
	    border-bottom-style: solid;
	    top: -12px;
	    left: 26px;
	    content: "";
	    display: block;
	    height: 0;
	    width: 0;
	    position: absolute;	    		
	}
	ul:after{
	    border: 5px inset;
	    border-color: transparent transparent #fff;
	    border-bottom-style: solid;
	    top: -10px;
	    left: 27px;
	    content: "";
	    display: block;
	    height: 0;
	    width: 0;
	    position: absolute;	    		
	}	
	.right{
		left:-90px;	
		top: 42px;	
	}	
	.right:before{
	    top: -12px;
	    left: 96px;		
	}
	.right:after{
	    top: -10px;
	    left: 97px;
		
	}	
</style>