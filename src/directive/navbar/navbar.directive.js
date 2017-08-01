'use strict';

function navBar() {
  require('./navbar.less');
  return {
    restrict: 'E',
    replace:true,
    template: require('./navbar.html'),
    scope: {
        navData: '='
    },
    link:function($scope,element,attrs){
    }
  };
}

export default angular
  .module("navbar.directive",[])
  .directive("navBar",navBar);
