'use strict';

class SourceService{
	constructor($http,$rootScope,source_url){
		this.$http = $http;
		this.$rootScope = $rootScope;
		this.source_url = source_url;
	}

	history_leads(sid){
		return this.$http({
  			url:this.source_url.history_leads,
  			method:'POST',
  			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			},
			data:$.param({
				sid:sid
			})
  		});
	}

	leads_info(uid){
		return this.$http({
  			url:this.source_url.history_leads,
  			method:'POST',
  			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			},
			data:$.param({
				uid:uid
			})
  		});
	}
}

export default angular
	.module('source.service',[])
	.service('SourceService',SourceService);