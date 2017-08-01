"use strict";

function treeService(){
	var other,source_path=[],per_tree;
	this.tree_path = function(data,uid){
		source_path=[];
		find_tree(data,uid);
		return source_path;
	};

	//找出树枝线
	function find_tree(data,uid){
			angular.forEach(data,function(v){
	        if(typeof v.children != "undefined" && v.children.length){
	          other = true;
	          search_expanded_tree(v.children,uid);
	          if(!other){
	            var _tmp_ = [v.label];
	            angular.forEach(source_path,function(vv){
	              _tmp_.push(vv);
	            });
	            source_path = _tmp_;
	          }          
	        }          
			});
	};

	//给符合条件的树进行展开
	function search_expanded_tree(data,uid){
	  angular.forEach(data,function(v){
	    per_tree = false;
	    search_per_tree(v.children,uid);
	    if(per_tree){
	      source_path.push(v.label);         
	    }
	    if(v.uid==uid){
	      other = false;
	      return;
	    }else{
	      search_expanded_tree(v.children,uid);
	    }
	  });
	};

	//搜寻每颗树是否符合条件
	function search_per_tree(data,uid){
	  angular.forEach(data,function(v){
	    if(v.uid==uid){
	      per_tree = true;
	    }else{
	      search_per_tree(v.children,uid);
	    }
	  });
	};
}

export default angular
	.module('tree.service',[])
	.service('treeService',treeService);