'use strict';

function LabelSourceRouter($stateProvider) {
  $stateProvider
    .state('app.label_source', {
      url: '/label_source',
      templateProvider:($q)=>{
        let deferred = $q.defer();
        require.ensure([],()=>{
            let template = require('./label_source.html');
            deferred.resolve(template);
        },'label_source.tpl');
        return deferred.promise;
      },
      controller: 'LabelSourceController as vm',
      resolve: {
        loadController: ($q, $ocLazyLoad) => {
          return $q((resolve) => {
            require.ensure([], () => {
              let module = require('./label_source.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            },'label_source.ctrl');
          });
        }
      }
    });
}

export default angular
  .module('label_source.router', [])
  .config(LabelSourceRouter);