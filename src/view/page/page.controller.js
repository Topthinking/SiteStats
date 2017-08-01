'use strict';

function PageController($rootScope, $http, $log, toastr) {

	if ($rootScope.login_state == 0) {
		return false;
	};

	var vm = this;

	require('./page.less');
  	vm.face_img = require('../../common/images/avatar.png');

	vm.line_data = {};
	vm.source_data = {};

	//页面参数
	vm.source_id = '';
	vm.total_source_id = [];
	vm.date_type = '';
	vm.start_date_detail = '';
	vm.end_date_detail = '';
	vm.currentPage = 1;
	vm.maxSize = 5;
	vm.kpi_type = 0;
	vm.show_tree = false;
	vm.show_data = false;
	vm.show_vistor_data = false;
	vm.checked_res = false;
	vm.show_page = true;
	vm.rowCollection = [];
	vm.source_path = [];
	vm.source_line_name = '';
	vm.source_line_data = 0;
	vm.rightActive = "right-active";

	//全部地域
	vm.Citys = [];
	vm.city_path = "全部地域";
	vm.city_list = [];
	vm.city_param = [];
	vm.vistor_area = '';
	vm.city_ctrl = {};
	vm.select_city = function(cityId) {
		vm.city_ctrl.find_city(vm.Citys, cityId);
		var cur_path = vm.city_path;
		vm.city_path = vm.city_list.reverse().join(",").replace(/,/g, " - ");
		vm.city_param = vm.city_param.reverse().join(",").replace(/,/g,"&");
		vm.vistor_area = vm.city_param;
		if (cur_path != vm.city_path) {
			source_data();
		};
		vm.city_list = [];
		vm.city_param = [];
	};

	vm.judge_name = function(name) {
		if (name != null) {
			if (name.length > 10) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	vm.detail_path = true;
	vm.detail_leads = false;
	vm.detail_history = false;
	vm.cur_select_tag = 0;

	vm.judge_url = function(url) {
		if (url != null) {
			if (url.length > 50) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	vm.change_tag = function(tag, row) {
		if (tag == 0) {
			//访问路径
			row.detail_path = true;
			row.detail_path_active = "active";
			row.detail_leads = false;
			row.detail_leads_active = "";
			row.detail_history = false;
			row.detail_history_active = "";
		} else if (tag == 1) {
			//登记信息
			row.detail_path = false;
			row.detail_path_active = "";
			row.detail_leads = true;
			row.detail_leads_active = "active";
			row.detail_history = false;
			row.detail_history_active = "";
			if (isEmptyObj(row.leads_info)) {
				row.show_detail_leads = false;
				leads_info(row);
			} else {
				row.show_detail_leads = true;
			}
		} else if (tag == 2) {
			//历史访问
			row.detail_path = false;
			row.detail_path_active = "";
			row.detail_leads = false;
			row.detail_leads_active = "";
			row.detail_history = true;
			row.detail_history_active = "active";
			if (isEmptyObj(row.leads_history)) {
				row.history_select = false;
				row.show_detail_history = false;
				vm.history_param_data(0, row);
				vm.history_device_data(0, row);
				vistor_history(row);
			} else {
				row.history_select = true;
				row.show_detail_history = true;
			}
		}
	}

	//判断是否是空对象
	function isEmptyObj(obj) {
		for (var name in obj) {
			return false;
		}
		return true;
	}

	vm.refresh_vistor = function() {
		vistor_list();
	}

	vm.refresh_vistor_history = function(row) {
		vistor_history(row);
	}

	//获取登记信息
	function leads_info(row) {
		$http.post("/api/vistor/leads_info/", {
			"sid": row.sid
		}).then(function(data) {
			data =data.data;
			if (data.status) {
				row.show_detail_leads = true;
				row.leads_info = data.data;
			} else {
				toastr.error(data.msg || '登记信息获取失败');
			}
		}).catch(function(err) {
			$log.error(err);
		})
	}

	//获取历史访问
	function vistor_history(row) {
		var page = row.leads_history.currentPage;
		row.show_detail_history = false;
		$http.post("/api/vistor/leads_history/", {
			"uid": row.uid,
			"page": page,
			"vistor_param_type": row.vistor_param_type,
			"vistor_device_type": row.vistor_device_type
		}).then(function(data) {
			data =data.data;
			if (data.status) {
				if (data.data.list.length) {
					row.show_history_page = true;
				} else {
					row.show_history_page = false;
				}
				row.show_detail_history = true;
				row.history_select = true;
				row.leads_history = data.data;
				row.leads_history.totalItems = data.data.total;
				row.leads_history.maxSize = 5;
				row.leads_history.currentPage = page;
			} else {
				toastr.error(data.msg || '历史访问记录获取失败');
			}
		}).catch(function(err) {
			$log.error(err);
		})
	}

	//历史访问分页查询
	vm.historypageChanged = function(row) {
		vistor_history(row);
	}

	//历史访问筛选查询
	vm.history_param_data = function(type, row) {
		switch (type) {
			case 0:
				row.show_history_0 = false;
				row.show_history_1 = true;
				row.show_history_2 = true;
				row.vistor_history_param = "全部访客";
				break;
			case 1:
				row.show_history_0 = true;
				row.show_history_1 = false;
				row.show_history_2 = true;
				row.vistor_history_param = "已登记";
				break;
			case 2:
				row.show_history_0 = true;
				row.show_history_1 = true;
				row.show_history_2 = false;
				row.vistor_history_param = "未登记";
				break;
		}
		row.vistor_param_type = type;
		if (row.history_select) {
			vistor_history(row);
		}
	}

	vm.history_device_data = function(type, row) {
		switch (type) {
			case 0:
				row.show_history_device_0 = false;
				row.show_history_device_1 = true;
				row.show_history_device_2 = true;
				row.vistor_history_device = "全部设备";
				break;
			case 1:
				row.show_history_device_0 = true;
				row.show_history_device_1 = false;
				row.show_history_device_2 = true;
				row.vistor_history_device = "Mobile";
				break;
			case 2:
				row.show_history_device_0 = true;
				row.show_history_device_1 = true;
				row.show_history_device_2 = false;
				row.vistor_history_device = "PC";
				break;
		}
		row.vistor_device_type = type;
		if (row.history_select) {
			vistor_history(row);
		}
	}

	/*分页*/
	vm.pageChanged = function() {
		vistor_list();
	};

	/*筛选访客类型*/
	vm.vistor_param = '';
	vm.vistor_device = '';
	vm.vistor_param_type = 0;
	vm.vistor_device_type = 0;
	vm.vistor_param_data = function(param) {
		if (vm.vistor_param_type != param) {
			vm.vistor_param_type = param;
			vm.currentPage = 1;
			vistor_list();
		}
		var h = $('.date').height() + $('.data').height() + $('.chart-detail').height() + 130 + 'px';
		$('html,body').animate({
			scrollTop: h
		}, 800);
	}

	vm.vistor_device_data = function(param) {
		vm.vistor_device_type = param;
		vm.currentPage = 1;
		source_data();
	}

	vm.show_vistor_param = function(type, name) {
		if (vm.vistor_param_type == type) {
			vm.vistor_param = name;
			return false;
		}
		return true;
	}

	vm.show_vistor_device = function(type, name) {
		if (vm.vistor_device_type == type) {
			vm.vistor_device = name;
			return false;
		}
		return true;
	}

	/*获取访客信息*/
	function vistor_list() {
		if (vm.source_id != '') {
			vm.total_source_id = [];
			find_selected_node(vm.my_data);
			vm.show_vistor_data = false;
			$http.post('/api/page/vistor/', {
					"page": vm.currentPage,
					"vistor_param_type": vm.vistor_param_type,
					"vistor_device_type": vm.vistor_device_type,
					"vistor_area":vm.vistor_area,
					"date_type": vm.date_type,
					"start_date_detail": vm.start_date_detail,
					"end_date_detail": vm.end_date_detail,
					"total_source_id": vm.total_source_id
				})
				.then(function(data) {
					data = data.data;
					if (data.status) {
						vm.rowCollection = [];
						vm.Citys = data.data.city;
						if (data.data.list.length) {
							angular.forEach(data.data.list, function(value) {
								value.detail_path = true;
								value.detail_path_active = "active";
								value.detail_leads = false;
								value.detail_leads_active = "";
								value.leads_info = {};
								value.detail_history = false;
								value.detail_history_active = "";
								value.leads_history = {};
								vm.rowCollection.push(value);
							});
							vm.show_page = true;
						} else {
							vm.show_page = false;
						}
						vm.totalItems = data.data.total;
						vm.show_vistor_data = true;
					} else {
						toastr.error(data.msg || '该来源下暂时没有数据');
					}
					vm.show_tree = true;
				})
				.catch(function(err) {
					$log.error(err);
				});
		}
	}

	//点击每个树枝触发的事件方法
	vm.my_tree_handler = function(branch) {
		close_expanded(vm.my_data);
		clear_checked(vm.my_data);
		vm.source_path = [];
		if (branch.id != vm.my_data[0].id) {
			vm.my_data[0].selected = false;
		}
		if (branch.id == "-2") {
			//全部访问
			angular.forEach(vm.my_data, function(value, key) {
				if (key > 0) {
					value.checked = true;
				}
			});
		} else {
			if (branch.children.length) {
				//说明点击的是有子节点的选项
				branch.expanded = true;
				branch.show_check = false;
				angular.forEach(branch.children, function(value) {
					value.checked = true;
				});
			} else {
				//点击的是没有子节点的
				branch.checked = true;
			}

			if (typeof branch.parent_uid == "undefined") {
				branch.expanded = true;
			} else {
				expand_tree(vm.my_data, branch.uid);
			}
		}
		vm.source_path.push(branch.label);

		vm.source_path = vm.source_path.join(",").replace(/,/g, "/");
		vm.source_id = branch.id;
		source_data();
	};

	vm.my_tree_checked = function(branch) {
		if (typeof branch.checked == "undefined") {
			branch.checked = true;
		} else {
			branch.checked = branch.checked ? false : true;
		}

		//取消子级的checkbox选中
		if (branch.children.length) {
			angular.forEach(branch.children, function(value) {
				value.checked = false;
			});
		}

		//取消父级的checkbox选中
		clear_checked_uid(vm.my_data, branch.parent_uid);

		//判断当前的checkbox选择的是否是当前选中节点下的
		find_checked_node(vm.my_data, branch.uid);

		if (vm.checked_res) {
			vm.checked_res = false;
			source_data();
		}
	}

	//关闭所有的expanded
	function close_expanded(data) {
		angular.forEach(data, function(v) {
			v.expanded = false;
			if (typeof v.children != "undefined" && v.children.length) {
				close_expanded(v.children);
			}
		});
	}

	//根据选中的uid展开树
	function expand_tree(data, uid) {
		angular.forEach(data, function(v) {
			if (typeof v.children != "undefined" && v.children.length) {
				vm.other = true;
				search_expanded_tree(v.children, uid);
				if (vm.other) {
					close_expanded(v.children);
				} else {
					v.expanded = true;
					v.show_check = false;
					vm.source_path.push(v.label);
				}
			}
		});
	}

	//给符合条件的树进行展开
	function search_expanded_tree(data, uid) {
		angular.forEach(data, function(v) {
			vm.per_tree = false;
			search_per_tree(v.children, uid);
			if (vm.per_tree) {
				v.show_check = false;
				v.expanded = true;
				vm.source_path.push(v.label);
			}
			if (v.uid == uid) {
				vm.other = false;
				return;
			} else {
				search_expanded_tree(v.children, uid);
			}
		});
	}

	//搜寻每颗树是否符合条件
	function search_per_tree(data, uid) {
		angular.forEach(data, function(v) {
			if (v.uid == uid) {
				vm.per_tree = true;
			} else {
				search_per_tree(v.children, uid);
			}
		});
	}

	//清除所有的checkbox选中的
	function clear_checked(data) {
		angular.forEach(data, function(value) {
			value.checked = false;
			if (value.id != "-2") {
				value.show_check = true;
			}
			if (typeof value.children != "undefined" && value.children.length) {
				clear_checked(value.children);
			}
		});
	}

	//清除指定的uid的节点
	function clear_checked_uid(data, uid) {
		angular.forEach(data, function(value) {
			if (value.uid == uid) {
				value.checked = false;
				return true;
			} else {
				if (typeof value.children != "undefined" && value.children.length) {
					clear_checked_uid(value.children, uid);
				}
			}
		});
	}

	//找出tree型数据被选中的节点，同时判断当前的checkBox操作是否在当前节点下的子节点中进行的  
	function find_checked_node(data, uid) {
		angular.forEach(data, function(value) {
			if (value.selected) {
				if (value.id == "-2") {
					if (vm.checked_res == false) {
						get_checked_uid(vm.my_data, uid);
					}
				} else {
					if (typeof value.children != "undefined" && value.children.length) {
						if (vm.checked_res == false) {
							get_checked_uid(value.children, uid);
						}
					}
				}
				return;
			} else {
				if (typeof value.children != "undefined" && value.children.length) {
					find_checked_node(value.children, uid);
				}
			}
		});
	}

	//判断当前的checkbox的uid号的位置
	function get_checked_uid(data, uid) {
		angular.forEach(data, function(value) {
			if (value.uid == uid) {
				vm.checked_res = true;
				return;
			} else {
				if (typeof value.children != "undefined" && value.children.length) {
					get_checked_uid(value.children, uid);
				}
			}
		});
	}

	//找出tree型数据被选中的节点,同时获取该节点下的所有子节点中选中的checkbox的source_id号
	function find_selected_node(data) {
		angular.forEach(data, function(value) {
			if (value.selected) {
				if (value.id == "-2") {
					get_checked_id(vm.my_data);
				} else {
					if (typeof value.children != "undefined" && value.children.length) {
						get_checked_id(value.children);
					} else {
						vm.total_source_id.push(value.id);
					}
				}
				return true;
			} else {
				if (typeof value.children != "undefined" && value.children.length) {
					find_selected_node(value.children);
				}
			}
		});
	}

	//获取所有选中的checkbox的source_id号
	function get_checked_id(data) {
		angular.forEach(data, function(value) {
			if (value.checked) {
				vm.total_source_id.push(value.id);
			} else {
				if (typeof value.children != "undefined" && value.children.length) {
					get_checked_id(value.children);
				}
			}
		});
	}

	//获取圆环及折线图详情信息
	function source_data() {
		if (vm.source_id != '') {
			vm.total_source_id = [];
			vm.line_data = {};
			find_selected_node(vm.my_data);
			vm.show_data = false;
			vm.rightActive = '';
			$http.post('/api/page/page_data/', {
				"total_source_id": vm.total_source_id,
				"date_type": vm.date_type,
				"start_date_detail": vm.start_date_detail,
				"end_date_detail": vm.end_date_detail,
				"vistor_device_type": vm.vistor_device_type,
				"vistor_area":vm.vistor_area
			}).then(function(data) {
				data =data.data;
				if (data.status) {
					vm.source_data = data.data;
					vm.line_data = data.data.line_data;
					vm.param = data.data.param;
					vm.show_data = true;
					vm.rightActive = "right-active";
					vm.kpi(vm.kpi_type);

					vistor_list();
				} else {
					toastr.error(data.msg || '该来源下暂时没有数据');
				}
				vm.show_tree = true;
			}).catch(function(err) {
				$log.error(err);
			});
		}
	}

	//获取对应指标信息  
	vm.cur_kpi = '';
	vm.kpi = function(type) {
		if (!isEmptyObj(vm.line_data)) {
			var _name;
			switch (type) {
				case 0: //pv
					vm.source_line_data = vm.param.pv;
					angular.forEach(vm.source_data.polyline.data, function(value) {
						value.data = vm.line_data[value.name].pv;
					});
					_name = "PV";
					vm.source_data.columnar.legend = ["PV"];
					vm.source_data.columnar.data.name = "PV";
					vm.source_data.columnar.data.data = vm.line_data.columnar_data.pv;
					angular.forEach(vm.source_data.pie.data, function(value) {
						value.value = vm.line_data[value.name].pie_pv;
					});
					break;
				case 1: //uv
					vm.source_line_data = vm.param.uv;
					angular.forEach(vm.source_data.polyline.data, function(value) {
						value.data = vm.line_data[value.name].uv;
					});
					_name = "UV";
					vm.source_data.columnar.legend = ["UV"];
					vm.source_data.columnar.data.name = "UV";
					vm.source_data.columnar.data.data = vm.line_data.columnar_data.uv;
					angular.forEach(vm.source_data.pie.data, function(value) {
						value.value = vm.line_data[value.name].pie_uv;
					});
					break;
				case 2: //ip
					vm.source_line_data = vm.param.ip;
					angular.forEach(vm.source_data.polyline.data, function(value) {
						value.data = vm.line_data[value.name].ip;
					});
					_name = "IP";
					vm.source_data.columnar.legend = ["IP"];
					vm.source_data.columnar.data.name = "IP";
					vm.source_data.columnar.data.data = vm.line_data.columnar_data.ip;
					angular.forEach(vm.source_data.pie.data, function(value) {
						value.value = vm.line_data[value.name].pie_ip;
					});
					break;
				case 3: //leads
					vm.source_line_data = vm.param.leads;
					angular.forEach(vm.source_data.polyline.data, function(value) {
						value.data = vm.line_data[value.name].leads;
					});
					_name = "Leads";
					vm.source_data.columnar.legend = ["Leads"];
					vm.source_data.columnar.data.name = "Leads";
					vm.source_data.columnar.data.data = vm.line_data.columnar_data.leads;
					angular.forEach(vm.source_data.pie.data, function(value) {
						value.value = vm.line_data[value.name].pie_leads;
					});
					break;
				case 4: //new_vistor
					vm.source_line_data = vm.param.new_vistor;
					angular.forEach(vm.source_data.polyline.data, function(value) {
						value.data = vm.line_data[value.name].new_vistor;
					});
					_name = "Leads";
					vm.source_data.columnar.legend = ["new_visitor"];
					vm.source_data.columnar.data.name = "new_visitor";
					vm.source_data.columnar.data.data = vm.line_data.columnar_data.new_vistor;
					angular.forEach(vm.source_data.pie.data, function(value) {
						value.value = vm.line_data[value.name].pie_new_vistor;
					});
					break;
			}

			/*折线图*/
			vm.polyline_legend = vm.source_data.polyline.legend;
			vm.polyline_data = vm.source_data.polyline.data;
			vm.polyline_item = vm.source_data.polyline.item;

			/*圆环图*/
			vm.pie_name = _name;
			vm.pie_legend = vm.source_data.pie.legend;
			vm.pie_data = vm.source_data.pie.data;

			/*柱状图*/
			vm.columnar_legend = vm.source_data.columnar.legend;
			vm.columnar_data = vm.source_data.columnar.data;
			vm.columnar_item = vm.source_data.columnar.item;
		}
		vm.kpi_type = type;
	}

	vm.show_kpi = function(type, name) {
		if (type == vm.kpi_type) {
			vm.cur_kpi = name;
			vm.source_line_name = "总" + name;
			return false;
		} else {
			return true;
		}
	}

	//获取树状图的信息
	vm.my_data = [];
	vm.doing_async = true;

	function source_list() {
		$http.post('/api/page/',{
			"type":0
		}).then(function(data) {
			data = data.data;
				var tmp = [];
				tmp.push({
					"label": "全部页面",
					"id": "-2",
					"show_check": false
				});
				angular.forEach(data.data, function(value) {
					tmp.push(value);
				});
				tmp.push({
					"label":"其他页面",
					"id":"-3",
					"show_check":false
				});
				vm.doing_async = false;
				vm.my_data = tmp;
				tmp[0].selected = true;
				tmp[0].expanded = true;
				vm.my_tree_handler(tmp[0]);
			})
			.catch(function(err) {
				$log.error(err);
			});
	};

	source_list();

	/*选择最近的日期*/
	vm.date_type = '';
	vm.DateActive = function(type) {
		if (type == vm.date_type) {
			return 'active';
		}
	};
	vm.setDate_type = function(type) {
		vm.date_type = type;
		vm.dt1 = '';
		vm.dt2 = '';
		vm.start_date_detail = '';
		vm.end_date_detail = '';
		vm.currentPage = 1;
		source_data();
	};

	vm.DateActive(1);
	vm.setDate_type(1);

	/*显示日期*/
	vm.dt1 = '';
	vm.dt2 = '';

	vm.dateOptions1 = {
		formatYear: 'yy',
		maxDate: new Date(2020, 11, 31),
		minDate: '',
		startingDay: 1,
		showWeeks: false
	};

	vm.dateOptions2 = {
		formatYear: 'yy',
		maxDate: new Date(2020, 11, 31),
		minDate: '',
		startingDay: 1,
		showWeeks: false,
		select: function() {
			console.log('1');
		}
	};

	vm.open1 = function() {
		vm.popup.opened1 = true;
	};

	vm.open2 = function() {
		vm.popup.opened2 = true;
	};

	vm.format = 'yyyy-MM-dd';
	vm.altInputFormats = ['M!/d!/yyyy'];
	vm.popup = {
		opened1: false,
		opened2: false
	};

	vm.select_date1 = function() {
		var dt = vm.dt1;
		vm.date_type = '';
		vm.DateActive(-1);
		if (typeof dt != "undefined") {
			vm.start_date_detail = dt.getFullYear() + '-' + (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? "0" + (dt.getDate()) : dt.getDate());
			var min = vm.start_date_detail.split('-');
			vm.dateOptions2.minDate = new Date(min[0], min[1] - 1, min[2]);
			source_data();
		} else {
			vm.start_date_detail = '';
			vm.end_date_detail = '';
			vm.dt1 = '';
			vm.dt2 = '';
		}
	}

	vm.select_date2 = function() {
		var dt = vm.dt2;
		vm.date_type = '';
		vm.DateActive(-1);
		if (typeof dt != "undefined") {
			vm.end_date_detail = dt.getFullYear() + '-' + (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? "0" + (dt.getDate()) : dt.getDate());
			var max = vm.end_date_detail.split('-');
			vm.dateOptions1.maxDate = new Date(max[0], max[1] - 1, max[2]);
			source_data();
		} else {
			vm.end_date_detail = '';
			vm.dt2 = '';
		}
	}
};

export default angular
  .module('page.controller',[
    require('../../directive/abn-tree/abn-tree.directive').name,
    require('../../directive/source_echart').name,
    require('../../directive/city/city.directive').name,
    require('../../filter/common.filter').name
  ])
  .controller('PageController',PageController);