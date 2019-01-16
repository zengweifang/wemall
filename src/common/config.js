var config = {},service={};
// 1xx - 临时响应
config.pvResponse=100;
// 2xx - 成功
config.successCode=200;
// 3xx - 重定向8
config.redirect=300;
// 4xx - 客户端错误
config.clientError=400;
// 5xx - 服务器错误
config.serviceError=500;
//供应商账户封停
config.statueError=510;
// 6xx - 参数验证错误
config.paramsError=600;
//微信appId
config.wxAppId='wx0eacf6431a52dadf';
//支付宝appId
config.alipayAppid="2016092101940927";
//auth的clientId和secret
config.clientId='46582ae7217343a8b252e3977e7cc421';
config.clientSecret='cgGvf5Rotv7D76m9JaArfY3YG6fDec47';
//切换本地，测试，预发布，正式环境
// var url =location.href.split('/')[2];
var url=location.hostname;
config.mode = url;
var localhost = "localhost";

var develop = "development.wang-guanjia.com";
var test = "test.wang-guanjia.com";

var pre_product_app = "p-app.wang-guanjia.com";
var pre_product_api = "p-api.wang-guanjia.com";

var product_app = "app.wang-guanjia.com";
var product_api = "api.wang-guanjia.com";
config.mode=config.mode.replace('app','api');
switch (config.mode) {
    case localhost:
        //service.common = "http://localhost:8080";
        config.wxAppId='wx94badea9f1aa0cce';
        service.common = "https://test.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain=localhost;
        service.app='https://test.wang-guanjia.com/app-background';
        service.oauth='https://test.wang-guanjia.com/oauth-service';
        service.self="http://localhost:8080/wemall";
        service.dev="https://development.wang-guanjia.com";
        service.static="https://test.wang-guanjia.com";
        service.upload="https://test.wang-guanjia.com/resource";
        service.dingding="https://development.wang-guanjia.com";
        break;
    case develop:
        config.wxAppId='wx94badea9f1aa0cce';
        service.common = "https://development.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain='.wang-guanjia.com';
        service.app='https://development.wang-guanjia.com/app-background';
        service.oauth='https://development.wang-guanjia.com/oauth-service';
        service.self="https://development.wang-guanjia.com/wemall";
        service.dev="https://development.wang-guanjia.com";
        service.static="https://test.wang-guanjia.com";
        service.upload="https://test.wang-guanjia.com/resource";
        service.dingding="https://development.wang-guanjia.com";
        break;
    case test:
        config.wxAppId='wx94badea9f1aa0cce';
        service.common = "https://test.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain='.wang-guanjia.com';
        service.app='https://test.wang-guanjia.com/app-background';
        service.oauth='https://test.wang-guanjia.com/oauth-service';
        service.self="https://test.wang-guanjia.com/wemall";
        service.dev="https://development.wang-guanjia.com";
        service.static="https://test.wang-guanjia.com";
        service.upload="https://test.wang-guanjia.com/resource";
        service.dingding="https://development.wang-guanjia.com";
        break;
    case pre_product_app:
    case pre_product_api://预发布
        service.common = "https://p-api.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain='.wang-guanjia.com';
        service.app='https://p-api.wang-guanjia.com/app-background';
        service.oauth='https://p-api.wang-guanjia.com/oauth-service';
        service.self="https://p-app.wang-guanjia.com/wemall";
        service.static="https://static.wang-guanjia.com";
        service.upload="https://static.wang-guanjia.com";
        service.dingding="https://dingding.wang-guanjia.com";
        break;        
    case product_app:
    case product_api://正式
        service.common = "https://api.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain='.wang-guanjia.com';
        service.app='https://api.wang-guanjia.com/app-background';
        service.oauth='https://api.wang-guanjia.com/oauth-service';
        service.self="https://app.wang-guanjia.com/wemall";
        service.static="https://static.wang-guanjia.com";
        service.upload="https://static.wang-guanjia.com";
        service.dingding="https://dingding.wang-guanjia.com";
        break;

    default:
        service.common = "https://api.wang-guanjia.com";
        service.www="https://www.wang-guanjia.com";
        service.domain='.wang-guanjia.com';
        service.app='https://api.wang-guanjia.com/app-background';
        service.oauth='https://api.wang-guanjia.com/oauth-service';
        service.self="https://app.wang-guanjia.com/wemall";
        service.static="https://static.wang-guanjia.com";
        service.upload="https://static.wang-guanjia.com";
        service.dingding="https://dingding.wang-guanjia.com";
        break;              
}

export {config,service};
