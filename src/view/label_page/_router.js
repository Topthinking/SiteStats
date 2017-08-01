'use strict';

function LabelPageRouter($stateProvider) {
  $stateProvider
    .state('app.label_page', {
      url: '/label_page',
      templateProvider:($q)=>{
        let deferred = $q.defer();
        require.ensure([],()=>{
            let template = require('./label_page.html');
            deferred.resolve(template);
        },'label_page.tpl');
        return deferred.promise;
      },
      controller: 'LabelPageController as vm',
      resolve: {
        loadController: ($q, $ocLazyLoad) => {
          return $q((resolve) => {
            require.ensure([], () => {
              let module = require('./label_page.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            },'label_page.ctrl');
          });
        }
      }
    });
}

export default angular
  .module('label_page.router', [])
  .config(LabelPageRouter);