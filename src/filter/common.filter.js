"use strict";
		
function Cut_url_v(){
	var Cut_url_v = function(url){
		if(url.length>20){
			return url.substr(0,20) + "...";
		}else{
			return url;
		}
	}
	return Cut_url_v;
}


function Cut_url(){
	var Cut_url = function(url){
		if(url.length>50){
			return url.substr(0,50) + "...";
		}else{
			return url;
		}
	}
	return Cut_url;
}

function Leads_num(){
	var Leads_num = function(num){
		if(num>1){
			return num;
		}else{
			return '';
		}
	}
	return Leads_num;
}

function Page_name(){
	var Page_name = function(name){
		if(name.length>10){
			return name.substr(0,10)+"...";
		}else{
			return name;
		}
	}
	return Page_name;
}

export default angular
  .module("common.filter",[])
  .filter('Cut_url_v',Cut_url_v)
  .filter('Cut_url',Cut_url)
  .filter('Leads_num',Leads_num)
  .filter('Page_name',Page_name);	