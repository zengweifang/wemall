<template>
	<div class="categories">
		<div class="second-list fl">
			<ul>
				<li><p>分类1</p></li>
				<li class="active"><p>分类2</p></li>
			</ul>
		</div>
		<div class="third-list fl">
			<div class="all">
				<hr class="fl">
				<p class="fl">全部分类</p>
				<hr class="fl">
			</div>
			<ul>
				<li>
					<img src="https://happylife-dev.oss-cn-shanghai.aliyuncs.com/static/img/af74664a-a83a-4acc-ad62-8ab45b35cec8.png" alt="">
					<p>家电清洗</p>
				</li>
				<li>
					<img src="https://happylife-dev.oss-cn-shanghai.aliyuncs.com/static/img/af74664a-a83a-4acc-ad62-8ab45b35cec8.png" alt="">
					<p>家电清洗</p>
				</li>
				<li>
					<img src="https://happylife-dev.oss-cn-shanghai.aliyuncs.com/static/img/af74664a-a83a-4acc-ad62-8ab45b35cec8.png" alt="">
					<p>家电清洗</p>
				</li>
				<li>
					<img src="https://happylife-dev.oss-cn-shanghai.aliyuncs.com/static/img/af74664a-a83a-4acc-ad62-8ab45b35cec8.png" alt="">
					<p>家电清洗</p>
				</li>												
			</ul>
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';	
</script>
<style lang="scss" scoped>
@import './categories';
</style>