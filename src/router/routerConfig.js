const index = resolve =>{
	require.ensure(['../views/index/index'], () => {
    resolve(require('../views/index/index'))
  })  
}
const test = resolve =>{
	require.ensure(['../views/test/test'], () => {
    resolve(require('../views/test/test'))
  })  
}
const chooseAddr = resolve =>{
	require.ensure(['../views/position/chooseAddr/chooseAddr'], () => {
    resolve(require('../views/position/chooseAddr/chooseAddr'))
  })  
}
const addAddr = resolve =>{
	require.ensure(['../views/position/addAddr/addAddr'], () => {
    resolve(require('../views/position/addAddr/addAddr'))
  })  
}
const moreAddr = resolve =>{
	require.ensure(['../views/position/moreAddr/moreAddr'], () => {
    resolve(require('../views/position/moreAddr/moreAddr'))
  }) 	
}
const userSelAddr = resolve =>{
	require.ensure(['../views/position/userSelAddr/userSelAddr'], () => {
    resolve(require('../views/position/userSelAddr/userSelAddr'))
  }) 	
}
const login = resolve =>{
	require.ensure(['../views/login/login'], () => {
    resolve(require('../views/login/login'))
  }) 	
}
const whiteList = resolve =>{
	require.ensure(['../views/whiteList/whiteList'], () => {
    resolve(require('../views/whiteList/whiteList'))
  }) 	
}
const redirect = resolve =>{
	require.ensure(['../views/redirect/redirect'], () => {
    resolve(require('../views/redirect/redirect'))
  }) 	
}
const productSearch = resolve =>{
	require.ensure(['../views/product/search/search'], () => {
    resolve(require('../views/product/search/search'))
  }) 	
}
const categories = resolve =>{
	require.ensure(['../views/product/categories/categories'], () => {
    resolve(require('../views/product/categories/categories'))
  }) 	
}
const productList = resolve =>{
	require.ensure(['../views/product/list/list'], () => {
    resolve(require('../views/product/list/list'))
  }) 	
}
const productDetail = resolve =>{
	require.ensure(['../views/product/detail/detail'], () => {
    resolve(require('../views/product/detail/detail'))
  }) 	
}
const submitOrder = resolve =>{
	require.ensure(['../views/product/submit/submit'], () => {
    resolve(require('../views/product/submit/submit'))
  })
}
const selectCoupon = resolve =>{
	require.ensure(['../views/product/coupon/coupon'], () => {
    resolve(require('../views/product/coupon/coupon'))
  })
}
const orderList = resolve =>{
	require.ensure(['../views/order/list/orderList'], () => {
		resolve(require('../views/order/list/orderList'))
	})
}
const orderDetail = resolve =>{
	require.ensure(['../views/order/detail/orderDetail'], () => {
		resolve(require('../views/order/detail/orderDetail'))
	})
}
const checkDeliver = resolve =>{
	require.ensure(['../views/order/list/checkDeliver'], () => {
		resolve(require('../views/order/list/checkDeliver'))
	})
}

const packageList = resolve =>{
	require.ensure(['../views/package/list/list'], () => {
		resolve(require('../views/package/list/list'))
	})
}
const exchange = resolve =>{
	require.ensure(['../views/package/exchange/exchange'], () => {
		resolve(require('../views/package/exchange/exchange'))
	})
}
//支付
const payList = resolve =>{
	require.ensure(['../views/pay/list/list'], () => {
		resolve(require('../views/pay/list/list'))
	})
}
//user相关
const userIndex = resolve =>{
	require.ensure(['../views/user/index/index'], () => {
		resolve(require('../views/user/index/index'))
	})
}
const userInfo = resolve =>{
	require.ensure(['../views/user/info/info'], () => {
		resolve(require('../views/user/info/info'))
	})
}
const userQuestion = resolve =>{
	require.ensure(['../views/user/question/question'], () => {
		resolve(require('../views/user/question/question'))
	})
}
const userFeedback = resolve =>{
	require.ensure(['../views/user/feedback/feedback'], () => {
		resolve(require('../views/user/feedback/feedback'))
	})
}
const travelAgent = resolve =>{
	require.ensure(['../views/user/travelAgent/info'], () => {
		resolve(require('../views/user/travelAgent/info'))
	})
}
const travelAgentShareList = resolve =>{
	require.ensure(['../views/user/travelAgent/shareList'], () => {
		resolve(require('../views/user/travelAgent/shareList'))
	})
}
const travelAgentShareDetail = resolve =>{
	require.ensure(['../views/user/travelAgent/shareDetail'], () => {
		resolve(require('../views/user/travelAgent/shareDetail'))
	})
}
const singlePay = resolve =>{
	require.ensure(['../views/pay/single/single'], () => {
		resolve(require('../views/pay/single/single'))
	})
}
const payCallback = resolve =>{
	require.ensure(['../views/pay/callback/callback'], () => {
		resolve(require('../views/pay/callback/callback'))
	})
}
const userCoupon = resolve =>{
	require.ensure(['../views/user/coupon/coupon'], () => {
		resolve(require('../views/user/coupon/coupon'))
	})
}
//支付宝信用预约服务介绍
const alipayDes = resolve =>{
	require.ensure(['../views/other/alipay'], () => {
		resolve(require('../views/other/alipay'))
	})
}
//支付宝信用预约服务介绍
const updateTip = resolve =>{
	require.ensure(['../views/other/update'], () => {
		resolve(require('../views/other/update'))
	})
}
//钉钉订单统计查看
const dingOrderData = resolve =>{
	require.ensure(['../views/other/dingding/orderData'], () => {
		resolve(require('../views/other/dingding/orderData'))
	})
}
//钉钉订单统计查看
const dingFeedback = resolve =>{
	require.ensure(['../views/other/dingding/feedback'], () => {
		resolve(require('../views/other/dingding/feedback'))
	})
}
//房多多展示品类
const multipleBrokerage = resolve =>{
	require.ensure(['../views/multipleBrokerage/multipleBrokerage'], () => {
    resolve(require('../views/multipleBrokerage/multipleBrokerage'))
  })  
}
export const routes=[
	{
	    path: '/', 
	    name: 'index',
	    component: index,
	    meta: {
	      path: '/',
	      title:'旺管家商城',
	      header:false,
	      keepScroll:true,
	      tab:true
	    }
	},
	{
	    path: '/clear', 
	    name: 'test',
	    component: test,
	    meta: {
	      path: '/clear',
	      title:'旺管家商城',
	      position:false
	    }
	},	
	{
	    path: '/login', 
	    name: 'login',
	    component: login,
	    meta: {
	      path: '/login',
	      title:'快捷登录',
	      header:false,
	      position:false
	    }
	},
	{
	    path: '/whiteList', 
	    name: 'whiteList',
	    component: whiteList,
	    meta: {
	      path: '/whiteList',
	      title:'录入白名单'
	    }
	},
	{
	    path: '/redirect', 
	    name: 'redirect',
	    component: redirect,
	    meta: {
	      path: '/redirect',
	      title:'旺管家商城',
	      auth:true
	    }
	},
	// 房多多
	{
			path: '/multipleBrokerage', 
			name: 'multipleBrokerage',
			component: multipleBrokerage,
			meta: {
				path: '/multipleBrokerage',
				title:'旺管家生活服务',
				header:false
			}
	},
	/***********定位相关--start--*************/	
	{
	    path: '/position/chooseAddr', 
	    name: 'chooseAddr',
	    component: chooseAddr,
	    meta: {
	      path: '/position/chooseAddr',
	      title:'选择服务地址',
	      header:false
	    }
	},		
	{
	    path: '/position/addAddr', 
	    name: 'addAddr',
	    component: addAddr,
	    meta: {
	      path: '/position/addAddr',
	      title:'新增服务地址',
	      auth:true
	    }
	},
	{
	    path: '/position/moreAddr', 
	    name: 'moreAddr',
	    component: moreAddr,
	    meta: {
	      path: '/position/moreAddr',
	      title:'更多地址',
	      header:false
	    }
	},
	{
	    path: '/position/userSelAddr', 
	    name: 'userSelAddr',
	    component: userSelAddr,
	    meta: {
	      path: '/position/userSelAddr',
	      title:'选择地址'
	    }
	},	
	/***********定位相关--end--*************/

	/***********产品相关--start--*************/	
	{
	    path: '/product/categories', 
	    name: 'categories',
	    component: categories,
	    meta: {
	      path: '/product/categories',
	      title:'全部分类',
	      keepScroll:true,
	      tab:true
	    }
	},	
	{
	    path: '/product/search', 
	    name: 'productSearch',
	    component: productSearch,
	    meta: {
	      path: '/product/search',
	      title:'搜索',
	      header:false
	    }
	},		
	{
	    path: '/product/detail/:goodId', 
	    name: 'productDetail',
	    component: productDetail,
	    meta: {
	      path: 'product/detail',
	      title:'商品详情',
	      header:false
	    }
	},		
	{
	    path: '/product/list/:goodsTypeId', 
	    name: 'productList',
	    component: productList,
	    meta: {
	      path: '/product/list',
	      title:'商品列表',
	      keepAlive:true,
	      keepScroll:true,
	      header:false
	    }
	},
	{
	    path: '/product/submit', 
	    name: 'submitOrder',
	    component: submitOrder,
	    meta: {
	      path: 'submitOrder',
	      title:'提交订单',
	      auth:true
	    }
	},
	{
	    path: '/product/coupon', 
	    name: 'selectCoupon',
	    component: selectCoupon,
	    meta: {
	      path: 'selectCoupon',
	      title:'使用优惠券',
	      auth:true
	    }
	},	
	/***********产品相关--end--*************/
  /***********订单相关--start--*************/
	{
		path: '/order/list',
		name: 'orderList',
		component: orderList,
		meta: {
			path: '/order/list',
			keepScroll:true,
			auth: true,
			title:'我的订单',
			tab:true,
			position:false
		}
	},
	{
		path: '/order/list/checkDeliver/:deliverUrl',
		name: 'checkDeliver',
		component: checkDeliver,
		meta: {
			path: '/order/checkDeliver',
			title:'查看物流'/*,
			 auth: true*/
		}
	},
	{
		path: '/order/detail/:id',
		name: 'orderDetail',
		component: orderDetail,
		meta: {
			path: '/order/detail',
			title:'订单详情',
			auth: true,
			position:false
		}
	},
	/***********订单相关--end--*************/
	/*套餐相关*/
	{
		path: '/package/list',
		name: 'packageList',
		component: packageList,
		meta: {
			path: '/package/list',
			title:'我的套餐',
			auth: true,
			header:false
		}
	},	
	{
		path: '/package/exchange',
		name: 'exchange',
		component: exchange,
		meta: {
			path: 'package/exchange',
			title:'旺管家套餐信息',
			auth: false,
			header:false,
			position:false
		}
	},		
	{
		path: '/pay/list',
		name: 'payList',
		component: payList,
		meta: {
			path: '/pay/list',
			title:'支付订单',
			auth: true,
			header:false,
			position:false
		}
	},		
	{
		path: '/pay/single',
		name: 'singlePay',
		component: singlePay,
		meta: {
			path: 'pay/single',
			title:'支付订单',
			auth: true,
			header:false,
			position:false
		}
	},	
	{
		path: '/pay/callback',
		name: 'payCallback',
		component: payCallback,
		meta: {
			path: 'pay/callback',
			title:'支付结果',
			auth: true,
			header:false,
			position:false
		}
	},	
	{
		path: '/user/coupon/list',
		name: 'userCoupon',
		component: userCoupon,
		meta: {
			path: '/user/coupon/list',
			title:'我的优惠券',
			auth: true,
			position:false
		}
	},		
	{
		path: '/other/alipay',
		name: 'alipayDes',
		component: alipayDes,
		meta: {
			path: '/other/alipay',
			title:'信用预约介绍',
			auth: false,
			position:false
		}
	},		
	{
		path: '/dingding/orderData',
		name: 'dingOrderData',
		component: dingOrderData,
		meta: {
			path: '/dingding/orderData',
			title:'订单数据统计',
			auth: true,
			position:false,
			header:false
		}
	},
	{
		path: '/dingding/feedback',
		name: 'dingFeedback',
		component: dingFeedback,
		meta: {
			path: '/dingding/feedback',
			title:'反馈建议',
			auth: true,
			position:false,
			header:false
		}
	},	
	{
		path: '/other/update',
		name: 'update',
		component: updateTip,
		meta: {
			path: '/other/update',
			title:'版本升级提示',
			auth: false,
			header:false,
			position:false
		}
	},	

	/*user相关*/
	{
		path: '/user/index',
		name: 'userIndex',
		component: userIndex,
		meta: {
			path: '/user/index',
			title:'我的',
			position:false,
			tab:true
		}
	},
	{
		path: '/user/info',
		name: 'userInfo',
		component: userInfo,
		meta: {
			path: '/user/info',
			title:'个人信息',
			position:false,
			auth:true
		}
	},			
	{
		path: '/user/question',
		name: 'userQuestion',
		component: userQuestion,
		meta: {
			path: '/user/question',
			title:'常见问题',
			position:false
		}
	},	
	{
		path: '/user/feedback',
		name: 'userFeedback',
		component: userFeedback,
		meta: {
			path: '/user/feedback',
			title:'意见反馈',
			position:false,
			auth:true
		}
	},	
	{
		path: '/user/travelAgent',
		name: 'travelAgent',
		component: travelAgent,
		meta: {
			path: '/user/travelAgent',
			title:'代理信息',
			position:true,
			auth: true
		}
	},		
	{
		path: '/user/travelAgent/shareList',
		name: 'travelAgentShareList',
		component: travelAgentShareList,
		meta: {
			path: '/user/travelAgent/shareList',
			title:'分享列表',
			position:true,
			auth: true
		}
	},		
	{
		path: '/user/travelAgent/shareDetail',
		name: 'travelAgentShareDetail',
		component: travelAgentShareDetail,
		meta: {
			path: '/user/travelAgent/shareDetail',
			title:'分享海报',
			position:true,
			auth: false,
			header: false
		}
	},		

	{
      path: '*', 
      redirect: '/' 
    }
]
