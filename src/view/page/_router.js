"use strict";

function PageRouter($stateProvider){
	$stateProvider
	.state('app.page',{
		url:'/page',
		templateProvider:($q)=>{
			let deferred = $q.defer();
			require.ensure([],()=>{
				let template = require('./page.html');
				deferred.resolve(template);
			},'page.tpl');
			return deferred.promise;
		},
		controller:"PageController as vm",
		resolve:{
			loadController:($q,$ocLazyLoad)=>{
				return $q((resolve)=>{
					require.ensure([],()=>{
						let module = require('./page.controller');
						$ocLazyLoad.load({name:module.name});
						resolve(module.controller);
					},'page.ctrl');
				});
			}
		}
	});
}

export default angular
	.module('page.router',[])
	.config(PageRouter);