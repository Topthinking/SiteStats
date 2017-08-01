'use strict';

class AppController {
	constructor($rootScope,$state,AccessService,toastr,$log,$http){
		//初始化angular参数	
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.AccessService = AccessService;
		this.toastr = toastr;
		this.$log = $log;
		this.$http = $http;
		
		//初始化控制器数据
		require('./app.less');
		this.data = '';

		//初始化页面逻辑
		if(typeof this.$rootScope.app_menu != "undefined" &&  this.$rootScope.app_menu.length){			
			this.data = this.$rootScope.app_menu;
			this.name = this.$rootScope.user_name;		
		}else{
			this.AccessService.getAccess().then((response)=>{
				if(response.data.status){
					this.$rootScope.app_menu = response.data.data.menu;
					this.$rootScope.user_name = response.data.data.name;
					this.$rootScope.login_state = 1;
					this.data = this.$rootScope.app_menu;
					this.name = this.$rootScope.user_name
				}else{
					this.$rootScope.login_state = 0;
					this.$state.go('login');
				}
			}.bind(this));		
		}

		if(typeof this.$rootScope.uolonline != "undefined"){
			this.show_uolonline = this.$rootScope.uolonline;
			this.show_landingPage = this.$rootScope.landingPage;
			this.cur_tracking = this.$rootScope.cur_tracking;
		}else{
			this.show_uolonline = false;
			this.show_landingPage = true;
			this.cur_tracking = "uolonline";
		}
	}

	change_tracking(type){
		if(type==1){
			this.$http.get("/api/tracking/uolonline/")
			.then(function(data) {
				data =data.data;
				if (data.status) {
					this.$rootScope.uolonline = false;
					this.$rootScope.landingPage = true;
					this.$rootScope.cur_tracking = "uolonline";
					this.$state.reload();
					this.toastr.success('tracking切换成功，当前是uolonline-tracking');
				} else {
					this.toastr.error(data.msg || '切换tracking失败');
				}
			}.bind(this)).catch(function(err) {
				this.$log.error(err);
			}.bind(this));
		}

		if(type==2){
			this.$http.get("/api/tracking/landingPage/")
			.then(function(data) {
				data =data.data;
				if (data.status) {
					this.$rootScope.uolonline = true;
					this.$rootScope.landingPage = false;
					this.$rootScope.cur_tracking = "LandingPage";
					this.$state.reload();
					this.toastr.success('tracking切换成功，当前是LandingPage-tracking');
				} else {
					this.toastr.error(data.msg || '切换tracking失败');
				}
			}.bind(this)).catch(function(err) {
				this.$log.error(err);
			}.bind(this));
		}
	}
}

export default angular
	.module('app.controller',[
		require('../../directive/navbar/navbar.directive').name
		])
	.controller('AppController',AppController);