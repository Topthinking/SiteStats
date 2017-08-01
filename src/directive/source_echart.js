'use strict';

/*圆环图*/
function pie(){
	return {
		scope:{
			id: "@",  
        	legend: "=",  
        	item: "=",  
        	data: "=",
        	name: "="
		},
		restrict:'E',
		template:'<div style="height:400px;" change="{{changes}}"></div>', 
		replace:true,
		link:function($scope,element,attrs,controller){
			$scope.$watch('data',function(){
				var option = {
					tooltip:{
						trigger:'items',
						formatter:"{a}<br/>{b}：{c}（{d}%）"
					},
					legend:{
						orient:'vertical',
						x:'right',
						data:$scope.legend
					},
					color:['#23B7E5','#7266BA','#F05050', '#27C24C', '#FAD733', '#949FB1', '#4D5360'],
					series:[
						{
							name:$scope.name,
							type:'pie',
							radius:['40%','55%'],
							data:$scope.data
						}
					]
				};
				var myChart = require('echarts').init(document.getElementById($scope.id),'macarons');  
            	myChart.setOption(option);
        	},true);
		}
	}
}

/*折线图*/
function polyline(){
	return {
		scope: {  
        	id: "@",  
        	legend: "=",  
        	item: "=",  
        	data: "="  
    	},  
    	restrict: 'E',  
    	template: '<div style="height:400px;"></div>',  
		replace: true,  
    	link: function($scope, element, attrs, controller) { 
    		$scope.$watch('data',function(){
        		var option = {
				    tooltip : {
				        trigger: 'axis'
				    },
				    color:['#23B7E5','#7266BA','#F05050', '#27C24C', '#FAD733', '#949FB1', '#4D5360'],
				    legend: {
				        data:$scope.legend
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : $scope.item
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series:$scope.data
        		};
        		var myChart = require('echarts').init(document.getElementById($scope.id),'macarons');  
            	myChart.setOption(option); 
        	},true);
    	}
	}
}

/*柱状图*/
function columnar(){
 	return {  
    	scope: {  
        	id: "@",  
        	legend: "=",  
        	item: "=",  
        	data: "="  
    	},  
    	restrict: 'E',  
    	template: '<div style="height:400px;"></div>',  
		replace: true,  
    	link: function($scope, element, attrs, controller) {
    		$scope.$watch('data',function(){ 
            	var option = {  
	                // 提示框，鼠标悬浮交互时的信息提示  
	                tooltip: {  
	                    trigger: 'axis',
        				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            				type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        				}  
	                },
	                color:['#23B7E5'],
	                // 图例  
	                legend: {  
	                    data: $scope.legend  
	                },
                    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
    				}, 
	                // 横轴坐标轴  
	                xAxis: [{  
	                    type: 'category',  
	                    data: $scope.item,
	                    interval:'10%'
	                }],  
	                // 纵轴坐标轴  
	                yAxis: [{  
	                    type: 'value'  
	                }],  
	                // 数据内容数组  
	                series: $scope.data
            	}; 
            	var myChart = require('echarts').init(document.getElementById($scope.id),'macarons');  
            	myChart.setOption(option);  
        	},true);
    	}  
	};  
}

export default angular
  .module("source.echarts",[
  	require('echarts')
  	])
  .directive('pie',pie)
  .directive('polyline',polyline)
  .directive('columnar',columnar);