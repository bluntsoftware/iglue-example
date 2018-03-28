//Main Controller
catwalkApp.controller('ecommerce-controller', ['$scope','Settings',
    function ($scope,Settings) {
        angular.element('.nav-side-menu').css('background', '#37474F');
        angular.element('.page-topbar').css('background', '#37474F');
        angular.element('.nav-side-menu').css('margin-top', '60px');
        Settings.get().then(function(data){
            $scope.settings = data;
            $scope.base_url = base_url;
        });
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
    }
]).run(securityHandler);