'use strict';
import angular from 'angular';

let AppModule = 'app';


angular.module(AppModule, [
    require('oclazyload'),
    require('angular-ui-router'),
    require('./common/lib/angular-toastr/index'),
    require('./common/lib/angular-bootstrap/index'),
    (()=>{require('angular-file-upload');return 'angularFileUpload';})(),
    require('./service/access.service').name,
    require('./view/_router').name
  ]);
angular.bootstrap(document, [AppModule], { strictDi: true });