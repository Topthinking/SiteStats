"use strict";

function city(){
	require('./city.less');
	return {
		scope:{
			cityData:"=",
			cityControl:"=",
			onSelect:"&",
			cityPath:"=",
			cityList:"=",
			cityParam:"="
		},
		restrict:"E",
		template:require('./city.html'),
		replace:true,
		link:function(scope,element,attrs){
			var on_city_change,province_id,city_id,cy_id;

			scope.provinces = [];
			scope.citys = [];
			scope.city_detail = false;
			scope.cy_detail = false;
			scope.tree_site = '';

			scope.reset_site = function(){
				if($(window).height() - ($('.btn-area').offset().top - document.body.scrollTop) > 430)
				{
					scope.tree_site = " ";
				}
				else
				{
					scope.tree_site = "tree_site";
				}					
			};

			scope.select_city = function(cityId){
				return scope.onSelect({
              		cityId:cityId
            	});
			};

			scope.enter_province = function(provinceId){
				angular.forEach(scope.cityData,function(v1){
					if(v1.id==provinceId){
						scope.provinces = v1.sub;
					}
				});
				province_id = provinceId;
				city_id = scope.provinces.length ? scope.provinces[0].id : '';					
				if(scope.provinces.length){
					scope.enter_city(city_id);
					scope.city_detail = true;						
				}else{
					scope.cy_detail = false;
					scope.city_detail = false;
				}
			};

			scope.active_province = function(id){
				if(id==province_id){
					return "active";
				}else{
					return "";
				}
			};

			scope.active_city = function(id){
				if(id==city_id){
					return "active";
				}else{
					return "";
				}
			};

			scope.active_cy = function(id){
				if(id==cy_id){
					return "active";
				}else{
					return "";
				}
			};

			scope.enter_city = function(cityId){
				angular.forEach(scope.cityData,function(v1){
					if(typeof v1.sub !="undefined" && v1.sub.length)
					{
						angular.forEach(v1.sub,function(v2){
							if(v2.id==cityId){
								scope.citys = v2.sub;
							}
						});
					}
				});
				city_id = cityId;
				cy_id = scope.citys.length ? scope.citys[0].id : '';
				if(scope.citys.length){
					scope.cy_detail = true;						
				}else{
					scope.cy_detail = false;
				}
			};

			scope.leave_city = function(){
				scope.city_detail = false;
				scope.cy_detail = false;
			};

			scope.en_cy = function(){
				scope.cy_detail = true;
				scope.city_detail = true;
			};

			scope.enter_cy = function(cyId){
				cy_id = cyId;
			};

			on_city_change = function(){
				if(scope.cityControl != null){
					if(angular.isObject(scope.cityControl)){
						var city = scope.cityControl;
						city.find_city = function(data,uid){
							angular.forEach(data,function(value){
								if(value.id==uid){
									if(typeof value.region_id !="undefined"){
										scope.cityParam.push(value.region_id);
										scope.cityParam.push(value.type);
										scope.cityParam.push(value.name);
									}else{
										scope.cityParam.push(value.name);
									}
									scope.cityList.push(value.name);						
									if(value.pid==0){
										return;
									}else{
										city.find_city(scope.cityData,value.pid);
									}
								}else{
									if(typeof value.sub !="undefined" && value.sub.length){
										city.find_city(value.sub,uid);
									}
								}
							});
						};

						return city;
					}
				}
			};

			scope.$watch('cityData',on_city_change,true);
		}
	}
};

export default angular
  .module("city.directive",[])
  .directive("city",city);