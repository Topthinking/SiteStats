'use strict';

function ViewRouter($stateProvider,$urlRouterProvider,$qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
  $urlRouterProvider.otherwise('/app/source');

  $stateProvider
  .state('logout',{
    url:"/logout",
    template:"<div></div>",
    controller:function($http,$state,$log,$rootScope){
      $http.post("/api/access/logout/")
           .then(function(data){
            data = data.data;
              if(data.status){
                $rootScope.login_data = [];
                $rootScope.login_state = 0;
                $rootScope.user_name = '';
                $state.go("login");
              }
           })
           .catch(function(err){
              $log.info(err);
           });
    }
  });
}

function toastrConfig(toastrConfig) {
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = false;
  toastrConfig.progressBar = true;
}

function httpProvider($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
  $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
  $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  

  var param = function (obj) {  
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;  

      for (name in obj) {  
          value = obj[name];  

          if (value instanceof Array) {  
              for (i = 0; i < value.length; ++i) {  
                  subValue = value[i];  
                  fullSubName = name + '[' + i + ']';  
                  innerObj = {};  
                  innerObj[fullSubName] = subValue;  
                  query += param(innerObj) + '&';  
              }  
          }  
          else if (value instanceof Object) {  
              for (subName in value) {  
                  subValue = value[subName];  
                  fullSubName = name + '[' + subName + ']';  
                  innerObj = {};  
                  innerObj[fullSubName] = subValue;  
                  query += param(innerObj) + '&';  
              }  
          }  
          else if (value !== undefined && value !== null)  
              query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';  
      }  

      return query.length ? query.substr(0, query.length - 1) : query;  
  };  

  $httpProvider.defaults.transformRequest = [function (data) {  
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;  
  }];  
}

let path = require('path');

export default angular
  .module('view.router',(()=>{
  	let router_list=[];
  	[
      'app',
      'access/login',
      'source',
      'page',
      'label_source',
      'label_page',
      'visitor'
    ].forEach((value)=>{
  		router_list.push(require('./'+value+'/_router').name);
  	});
  	return router_list;
  })())
  .value("url_param",{
    "user_state":"/api/access/login_state/",
    "login":"/api/access/login/",
  })
  .config(ViewRouter)
  .config(toastrConfig)
  .config(httpProvider);