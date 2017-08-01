'use strict';

function LabelSourceController($uibModal,$http,$log,toastr,treeService){
  var vm = this;

  require('./label_source.less');

  vm.show_tree = false;
  vm.show_detail = false;
  vm.show_url = false;
  vm.show_mask = false;
  vm.source_name = '';
  vm.select_tree = {};
  vm.my_data = [];
  vm.my_tree = {};
  vm.label_data = [];
  vm.url_data = [];
  vm.source_path = [];

  

  //选中树枝节点
  vm.my_tree_handler = function(branch) {

    if(branch.node==1)
    {
      if(typeof vm.my_data[0] != "undefined")
        vm.my_data[0].selected = false;
      
      if(typeof vm.my_data[1] != "undefined")
        vm.my_data[1].selected = false;
    }

    if(branch.label=="我的推广")
    {
      if(typeof vm.my_data[1] != "undefined")
        vm.my_data[1].selected = false;
    }

    if(branch.label=="外部链接")
    {
      if(typeof vm.my_data[0] != "undefined")
        vm.my_data[0].selected = false;
    }

    vm.show_detail = branch.node==0 ? false : true;
    vm.show_url = branch.type==1 ? false : true;
    vm.source_name = branch.label;
    vm.select_tree = branch;
    if(branch.children.length){
      var tmp = 0;
      angular.forEach(branch.children,function(value){
        if(typeof value.show_row!="undefined" && value.show_row==true){
            tmp = 1;
        }
      });
      if(tmp){
        vm.show_mask = true;
      }else{
        vm.show_mask = false;
      }
    }else{
      vm.show_mask = false;
    }

    if(branch.node==1)
    {
      if(branch.type==1){
        //我的推广
        vm.label_data = branch.label_data;
      }else{
        //外部链接
        vm.url_data = branch.url_data;          
      }
    }

    vm.source_path = treeService.tree_path(vm.my_data,branch.uid);
    vm.source_path.push(branch.label);
    vm.source_path = vm.source_path.join(",").replace(/,/g,"/");
  };

  //保存标签名称和位置
  vm.add_new_source = function(){
    $http.post('/api/source/edit/',{
        "label_id":vm.select_tree.id,
        "label_name":vm.source_name
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

  //获取当前标记来源的信息   
  vm.source_list = function(){
    $http.post('/api/source/',{
        "type":1
    }).then(function(data){
      data = data.data;
      source_add_tag(data.data);
      vm.my_data = data.data;
      vm.show_tree = true;
    })
    .catch(function(err){
        $log.info(err);
    });
  };

  vm.source_list();

  //给source_data 添加标签
  function source_add_tag(data){
    angular.forEach(data,function(value){
      value.show_row = true;
      if(value.node==1){
        if(value.type==1){
          //我的推广
          value.label_data = 
          [
            {
              "name":"广告系列来源",
              "param":value.utm_source_param,
              "id":"1",
              "value":value.utm_source,
              "edit":false,
              "checked":false
            },{
              "name":"广告系列媒介",
              "param":value.utm_medium_param,
              "id":"2",
              "value":value.utm_medium,
              "edit":false,
              "checked":false
            },{
              "name":"广告系列字词",
              "param":value.utm_term_param,
              "id":"3",
              "value":value.utm_term,
              "edit":false,
              "checked":false
            },{
              "name":"广告系列内容",
              "param":value.utm_content_param,
              "id":"4",
              "value":value.utm_content,
              "edit":false,
              "checked":false
            },{
              "name":"广告系列名称",
              "param":value.utm_campaign_param,
              "id":"5",
              "value":value.utm_campaign,
              "edit":false,
              "checked":false
            }
          ];
        }else{
          //外部链接
          angular.forEach(value.url_data,function(v){
            v.checked = false;
            v.edit = false;
            v.show_url = true;
          });
        }
      }
      if(value.children.length){
        source_add_tag(value.children);
      }
    });
  };


  /*添加标签*/
  vm.add_new_label = function(){
    $http.post('/api/source/create/',{
      "label_pid":vm.select_tree.id,
      "label_name":"未命名标签",
      "type":vm.select_tree.type
    }).then(function(data){
      data =data.data;
      if(data.status){
        if(vm.select_tree.type==1){
          vm.my_tree.add_branch(vm.select_tree,{
            "label": '未命名标签',
            "id":data.data.label_id,
            "type": "1",
            "utm_source": "",
            "utm_medium": "",
            "utm_term": "",
            "utm_content": "",
            "utm_campaign": "",
            "node": 1,
            "show_check": true,
            "show_row" : true,
            "label_data":
            [
              {
                "name":"广告系列来源",
                "param":"utm_source",
                "id":"1",
                "value":"",
                "edit":false,
                "checked":false
              },{
                "name":"广告系列媒介",
                "param":"utm_medium",
                "id":"2",
                "value":"",
                "edit":false,
                "checked":false
              },{
                "name":"广告系列字词",
                "param":"utm_term",
                "id":"3",
                "value":"",
                "edit":false,
                "checked":false
              },{
                "name":"广告系列内容",
                "param":"utm_content",
                "id":"4",
                "value":"",
                "edit":false,
                "checked":false
              },{
                "name":"广告系列名称",
                "param":"utm_campaign",
                "id":"5",
                "value":"",
                "edit":false,
                "checked":false
              }
            ]
          });
        }else{
          vm.my_tree.add_branch(vm.select_tree,{
            "label": '未命名标签',
            "id":data.data.label_id,
            "type": "2",
            "node": 1,
            "show_check": true,
            "show_row" : true,
            "url_data":[]
          });
        }
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
    if(vm.select_tree.node==1){
      var param = {};
      param.data = vm.my_data;
      param.type = vm.select_tree.type;
      param.uid = vm.select_tree.uid;
      param.id = vm.select_tree.id;
      param.sco = vm;
      dialog(param);
    }
  };

  /*我的推广*/
  vm.edit = function(item){
    item.edit = true;
    item.clear = false;
    item.change_param = item.param;
    item.change_value = item.value;
  };

  vm.save = function(item){
    if(item.change_value!=item.value||item.change_param!=item.param)
    {
      $http.post('/api/source/save_promotion/',{
        "label_id":vm.select_tree.id,
        "type":item.id,
        "value":item.change_value,
        "param_value":item.change_param
      }).then(function(data){
        data = data.data;
        if(data.status){
          item.value = item.change_value;
          item.param = item.change_param;
          item.edit = false;
        }
      }).catch(function(err){
        $log.info(err);
      });
    }else{
      item.edit = false;
    }      
  };

  vm.undo = function(item){
    item.change_value = '';
    item.change_param = '';   
    item.edit = false;
  };

  vm.clear = function(item){
      item.change_value = ''; 
      item.change_param = '';   
  };

  vm.selectAll = false;

  vm.select_all = function(){
    angular.forEach(vm.label_data,function(value){
      if(vm.selectAll){
        value.checked = false;
      }else{
        value.checked = true;
      }
    });
    vm.selectAll = vm.selectAll ? false : true;
  };

  vm.reset = function(){
    var reset_param = [];
    angular.forEach(vm.label_data,function(value){
      if(value.checked){
        reset_param.push(value.id);
      }
    });
    if(reset_param.length){
      $http.post('/api/source/reset_param/',{
        "reset_id":reset_param,
        "label_id":vm.select_tree.id
      }).then(function(data){
        data = data.data;
        if(data.status){
          angular.forEach(vm.label_data,function(value){
            if(value.checked){
                value.value = '';
                value.clear = true;
                value.change_value = '';
                value.change_param = '';
              }
          });
        }
      }).catch(function(err){
        $log.info(err);
      });
    }
  };

  vm.select_single = function(item){
    item.checked = item.checked ? false : true;
  };

  /*外部链接*/

  vm.url_detail = '';
  vm.add_url = function(){
    if(vm.url_detail!=''){
      $http.post('/api/source/save_url/',{
        "label_id":vm.select_tree.id,
        "url":vm.url_detail,
        "type":vm.select_tree.type
      }).then(function(data){
        data =data.data;
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
      $http.post('/api/source/edit_url/',{
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
      controller: 'ModalLabelSourceCtrl',
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
      controller: 'ModalLabelSourceCtrl',
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
      controller: 'ModalLabelSourceCtrl',
      controllerAs: '$modal',
      size: 'sm',
      resolve: {
        param:param
      }
    });
  }
}

function ModalLabelSourceCtrl($uibModalInstance,$http,$log,param,toastr){
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
    $http.post('/api/source/delete/',{
      "id":param.id
    }).then(function(data){
      data =data.data;
      if(data.status){
        finish_delete_tag(param.data,param.uid);
        if(param.type==1)
        {
          param.data[0].selected = true;
          param.sco.my_tree_handler(param.data[0]);
        }
        if(param.type==2)
        {
          param.data[1].selected = true;
          param.sco.my_tree_handler(param.data[1]);
        }

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
      $http.post('/api/source/delete_url/',{
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
    $http.post('/api/source/del_batch_url/',{
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
.module('label_source.controller',[
  require('../../directive/abn-tree/abn-tree.directive').name,
  require('../../service/tree.service').name
])
.controller('LabelSourceController',LabelSourceController)
.controller('ModalLabelSourceCtrl',ModalLabelSourceCtrl);