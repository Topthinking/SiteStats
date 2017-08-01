'use strict';

function SourceRouter($stateProvider) {
  $stateProvider
    .state('app.source', {
      url: '/source',
      templateProvider:($q)=>{
        let deferred = $q.defer();
        require.ensure([],()=>{
            let template = require('./source.html');
            deferred.resolve(template);
        },'source.tpl');
        return deferred.promise;
      },
      controller: 'SourceController as vm',
      resolve: {
        loadController: ($q, $ocLazyLoad) => {
          return $q((resolve) => {
            require.ensure([], () => {
              let module = require('./source.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            },'source.ctrl');
          });
        }
      }
    });
}

export default angular
  .module('source.router', [])
  .config(SourceRouter);