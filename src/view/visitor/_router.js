"use strict";

function VisitorRouter($stateProvider){
	$stateProvider
	.state('app.visitor',{
		url:'/visitor',
		templateProvider:($q)=>{
			let deferred = $q.defer();
			require.ensure([],()=>{
				let template = require('./visitor.html');
				deferred.resolve(template);
			},'visitor.tpl');
			return deferred.promise;
		},
		controller:"VisitorController as vm",
		resolve:{
			loadController:($q,$ocLazyLoad)=>{
				return $q((resolve)=>{
					require.ensure([],()=>{
						let module = require('./visitor.controller');
						$ocLazyLoad.load({name:module.name});
						resolve(module.controller);
					},'visitor.ctrl');
				});
			}
		}
	});
}

export default angular
	.module('visitor.router',[])
	.config(VisitorRouter);