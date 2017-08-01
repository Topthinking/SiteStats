'use strict';

function LabelPageController($uibModal,$log,$http,toastr,treeService){
  var vm = this;

  require('./label_page.less');
  vm.show_tree = false;
  vm.select_tree = {};
  vm.source_path = [];
  vm.selection = 0;

  vm.my_tree_handler = function(branch) {
  	if(vm.selection==0)
  	{
  		if(typeof vm.my_data[0] != "undefined")
  		{
  			if(vm.my_data[0].uid!=branch.uid)
  			{
  				vm.my_data[0].selected = false;
  			}
  		}
  		
  		vm.source_path = treeService.tree_path(vm.my_data,branch.uid);   			 		
  	}else{
  		vm.selection = 0;
  	}

  	vm.source_path.push(branch.label);
  		vm.source_path = vm.source_path.join(",").replace(/,/g,"/");  

  	vm.source_name = branch.label;
  	vm.url_data = branch.url_data;
  	vm.select_tree = branch;
  };

  //获取当前标记来源的信息
  vm.my_data = [];
  vm.my_tree = {};
  vm.page_list = function(){
    $http.post('/api/page/',{
    		"type":1
    }).then(function(data){
    	data = data.data;
    	source_add_tag(data.data);	      	
    	vm.my_data = data.data;
    	if(typeof vm.my_data[0] != "undefined")
  	{
    		vm.my_data[0].selected = true;
    		vm.selection = 1;
    		vm.my_tree_handler(vm.my_data[0]);
    	}
    	vm.show_tree = true;
    })
    .catch(function(err){
        $log.info(err);
    });
  };

  vm.page_list();

  //保存标签名称和位置
  vm.add_new_source = function(){
    $http.post('/api/page/edit/',{
        "label_id":vm.select_tree.id,
        "page_name":vm.source_name
    }).then(function(data){
    	data = data.data;
        if(data.status){
          vm.select_tree.label = vm.source_name;
      	vm.source_path = treeService.tree_path(vm.my_data,vm.select_tree.uid); 
      	vm.source_path.push(vm.select_tree.label);
  			vm.source_path = vm.source_path.join(",").replace(/,/g,"/"); 
          toastr.success("保存标签成功");
        }else{
          toastr.error("保存标签失败");
        }
    }).catch(function(err){
        $log.info(err);
    });      
  };

  //给source_data 添加标签
  function source_add_tag(data){
    angular.forEach(data,function(value){
      	value.show_row = true;
      	if(typeof value.url_data != "undefined" && value.url_data.length){
      		angular.forEach(value.url_data,function(v){
            		v.checked = false;
            		v.edit = false;
            		v.show_url = true;
          	});
      	}
      	if(value.children.length){
      		source_add_tag(value.children);
      	}
    });
  };

  /*添加标签*/
  vm.add_new_label = function(){
    $http.post('/api/page/create/',{
      "label_pid":vm.select_tree.id < 0 ? 0 : vm.select_tree.id,
      "label_name":"未命名标签",
      "page_type":vm.select_tree.page_type
    }).then(function(data){
    	data = data.data;
      if(data.status){
          vm.my_tree.add_branch(vm.select_tree,{
            "label": '未命名标签',
            "id":data.data.label_id,
            "node": 1,
            "show_check": true,
            "show_row" : true,
            "page_type":vm.select_tree.page_type,
            "url_data":[]
          });
        vm.my_tree_handler(vm.select_tree); 
        toastr.success("添加标签成功");
      }else{
        toastr.error("添加标签失败");
      }
    }).catch(function(err){
      $log.info(err);
    });
  };

  /*删除标签*/
  vm.delete_label = function(){
      var param = {};
      param.data = vm.my_data;
      param.uid = vm.select_tree.uid;
      param.id = vm.select_tree.id;
      dialog(param);
  };

  vm.url_detail = '';
  vm.add_url = function(){
    if(vm.url_detail!=''){
      $http.post('/api/page/save_url/',{
        "label_id":vm.select_tree.id,
        "url":vm.url_detail,
        "page_type":vm.select_tree.page_type
      }).then(function(data){
      	data = data.data;
        if(data.status){
          vm.url_data.push({
            "url":vm.url_detail,
            "checked":false,
            "edit":false,
            "show_url":true,
            "id":data.data.label_id
          });
        }
      }).catch(function(err){
        $log.info(err);
      });
      
    }      
  };

  vm.del_url = function(url){
    var param = {};
    param.data = vm.url_data;
    param.url = url;
    dialog_url(param)      
  };

  vm.edit_url = function(url){      
    url.change_value = url.url;
    url.edit = true;
  };

  vm.undo_url = function(url){      
    url.change_value = '';
    url.edit = false;
  };

  vm.save_url = function(url){
    if(url.change_value!=url.url)
    {
      $http.post('/api/page/edit_url/',{
            "id":url.id,
            "url":url.change_value
        }).then(function(data){
        	data = data.data;
          if(data.status){
              url.url = url.change_value;
              url.edit = false;
          }
        }).catch(function(err){
            $log.info(err);
        });
    }else{
      url.edit = false;
    }
  };

  vm.selectAllurl = false;

  vm.select_all_url = function(){
    angular.forEach(vm.url_data,function(value){
      if(vm.selectAllurl){
        value.checked = false;
      }else{
        value.checked = true;
      }
    });
    vm.selectAllurl = vm.selectAllurl ? false : true;
  };

  vm.reset_url = function(){
    var param = {},del = [];
    angular.forEach(vm.url_data,function(value){
      if(value.checked){
        del.push(value.id);
      }
    });
    param.data = vm.url_data;
    param.del = del;
    if(del.length){
      dialog_batch_url(param);        
    }
  };

  vm.select_single_url = function(url){
    url.checked = url.checked ? false : true;
  };

  function dialog(param){
    $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalDelete.html',
          controller: 'ModalLabelPageCtrl',
          controllerAs: '$modal',
          size: 'sm',
          resolve: {
            param:param
          }
  		});
  }

  function dialog_url(param){
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myUrlDelete.html',
      controller: 'ModalLabelPageCtrl',
      controllerAs: '$modal',
      size: 'sm',
      resolve: {
        param:param
      }
    });
  }

  function dialog_batch_url(param){
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myUrlBatchDelete.html',
      controller: 'ModalLabelPageCtrl',
      controllerAs: '$modal',
      size: 'sm',
      resolve: {
        param:param
      }
    });
  }
}

function ModalLabelPageCtrl($uibModalInstance,$http,$log,param,toastr){
    var $modal = this;

    //执行删除方法
    function finish_delete_tag(data,uid){
      angular.forEach(data,function(value,key){
        if(value.uid==uid){
          value.show_row = false;
          if(value.children.length){
            delete_children_tag(value.children,uid);
          }
        }else{
          if(value.children.length){
            finish_delete_tag(value.children,uid);
          }
        }  
      });
    };

    //删除所有子标签
    function delete_children_tag(data){
      angular.forEach(data,function(value){
        value.show_row = false;
        if(value.children.length){
          delete_children_tag(value.children);
        }
      });
    };

    /*确定删除*/
    $modal.del = function(){
      $http.post('/api/page/delete/',{
        "id":param.id
      }).then(function(data){
        data = data.data;
        if(data.status){
          finish_delete_tag(param.data,param.uid);
          toastr.success("删除标签成功");
        }else{
          toastr.error("删除标签失败");
        }
        $uibModalInstance.close();
      }).catch(function(err){
        toastr.error("删除标签失败");
        $log.info(err);
      });      
    };

    /*确定删除url*/
    $modal.confirm_del_url = function(){
        $http.post('/api/page/delete_url/',{
            "id":param.url.id
        }).then(function(data){
          data = data.data;
            if(data.status){
                angular.forEach(param.data,function(value){
                    if(value.id==param.url.id){
                        value.show_url = false;
                    }
                });
                toastr.success("删除url成功");
            }else{
                toastr.error("删除url失败");
            }
            $uibModalInstance.close();
        }).catch(function(err){
            $log.info(err);
        });
    };

    /*确定批量删除url*/
    $modal.confirm_del_batch_url = function(){
      $http.post('/api/page/del_batch_url/',{
        "del_id":param.del
      }).then(function(data){
        data = data.data;
        if(data.status){
          angular.forEach(param.data,function(value){
            if(value.checked){
              value.show_url = false;
            }
          });
          toastr.success("批量删除url成功");
        }else{
          toastr.error("批量删除url失败");
        }
        $uibModalInstance.close();
      }).catch(function(err){
        $log.info(err);
      });
    };

    /*取消模态框*/
    $modal.cancel = function (){     
      $uibModalInstance.close();
    };
}

export default angular
.module('label_page.controller',[
  require('../../directive/abn-tree/abn-tree.directive').name,
  require('../../service/tree.service').name
])
.controller('LabelPageController',LabelPageController)
.controller('ModalLabelPageCtrl',ModalLabelPageCtrl);