'use strict';

let path = require('path');

class LoginController{
	constructor($state,$rootScope,AccessService){
		//初始化angular参数	
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.AccessService = AccessService;

		//初始化控制器数据
		require('./login.less');
		this.error = '';
		this.show_error = false;

		//初始化页面逻辑
		this.AccessService.getAccess().then((response)=>{
			if(response.data.status){
				this.$rootScope.app_menu = response.data.data.menu;
				this.$rootScope.login_state = 1;
				this.$state.go('app.source');
			}else{
				this.$rootScope.login_state = 0;
				this.$state.go('login');
			}
		});
	}
	login(){
		this.AccessService.login(this.name,this.password)
			.then((response)=>{
				if(response.data.status){
					this.$rootScope.app_menu = response.data.data.menu;
					this.$rootScope.user_name = response.data.data.name;
					this.$rootScope.login_state = 1;
					this.$state.go('app.source');
				}else{
					this.error = response.data.msg;
					this.show_error = true;
				}
			});
	}
}

export default angular
	.module('login.controller',[])
	.controller('LoginController',LoginController);