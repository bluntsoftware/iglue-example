//Main Controller
catwalkApp.controller('cart-controller', ['$scope','USettings',
    function ($scope,USettings) {
        angular.element('.nav-side-menu').css('background', '#37474F');
        angular.element('.page-topbar').css('background', '#37474F');
        angular.element('.nav-side-menu').css('margin-top', '60px');
        USettings.get().then(function(data){
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
            .state('cart', {
                url: "/cart",
                views: {
                    'header': {
                        templateUrl:'components/modules/ecommerce/admin/templates/header.html',
                        controller:'ecommerce-controller as main'
                    },
                    'side': {
                        templateUrl:'components/modules/ecommerce/admin/templates/side-bar.html',
                        controller:'ecommerce-controller as main'
                    },
                    'content': {
                        template:'<div class="has-sidebar has-topbar" ui-view></div>'
                    }
                }
            })
    }
]).run(securityHandler);