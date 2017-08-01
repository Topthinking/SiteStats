'use strict';

function AppRouter($stateProvider) {
  $stateProvider
    .state('app',{
      abstract:true,
      url:'/app',
      templateProvider:($q)=>{
        let deferred = $q.defer();
        require.ensure([],()=>{
            let template = require('./app.html');
            deferred.resolve(template);
        },'app.tpl');
        return deferred.promise;
      },
      controller:'AppController as vm',
      resolve:{
        loadController:($q,$ocLazyLoad)=>{
          return $q((resolve)=>{
            require.ensure([],()=>{
              let module = require('./app.controller');
              $ocLazyLoad.load({name:module.name});
              resolve(module.controller);
            },'app.ctrl');
          });
        }
      }
    })
}

export default angular
  .module('app.router', [])
  .config(AppRouter);