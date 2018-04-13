//Main Controller
catwalkApp.controller('ecommerce-controller', ['$scope','Settings','conduit',
    function ($scope,Settings,conduit) {
        angular.element('.nav-side-menu').css('background', '#37474F');
        angular.element('.page-topbar').css('background', '#37474F');
        angular.element('.nav-side-menu').css('margin-top', '60px');

        $scope.collection = conduit.collection('settings');
        $scope.ecom_settings = {'_id':'ecom_settings'};

        Settings.get().then(function(data){
            $scope.settings = data;
            $scope.base_url = base_url;
        });

        $scope.gotoConduit= function(){
            window.location = base_url +"#/admin/conduit";
        };

        $scope.save= function(){
            $scope.collection.save($scope.ecom_settings);
        };

        $scope.collection.getById('ecom_settings').then(function(data){
            if(data && data['_id'] === 'ecom_settings'){
                $scope.ecom_settings = data;
            }
        });
        $scope.relativeUrl= function(url){
            return !url.includes('http');
        };
        $scope.back = function () {
            window.history.back();
        };
    }
]);
/**
 *   Routing
 */
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom', {
                url: "/ecom",
                views: {
                    'header': {
                        templateUrl:'components/modules/ecommerce/templates/ecom-header.html',
                        controller:'ecommerce-controller',
                        access: {
                            authorizedRoles: [USER_ROLES.admin]
                        }
                    },
                    'side': {
                        templateUrl:'components/modules/ecommerce/templates/ecom-side-bar.html',
                        controller:'ecommerce-controller',
                        access: {
                            authorizedRoles: [USER_ROLES.admin]
                        }
                    },
                    'content': {
                        template:'<div class="has-sidebar has-topbar" ui-view></div>',
                        access: {
                            authorizedRoles: [USER_ROLES.admin]
                        }
                    }
                }

            })
            .state('ecom.settings', {
                url: "/settings",
                templateUrl: "components/modules/ecommerce/templates/settings.html",
                controller: 'ecommerce-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
    }
]).run(securityHandler);