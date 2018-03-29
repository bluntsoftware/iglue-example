//Main Controller
catwalkApp.controller('shop-controller', ['$scope','$rootScope','USettings','conduit',
    function ($scope,$rootScope,USettings,conduit) {
        angular.element('.nav-side-menu').css('background', '#37474F');
        angular.element('.page-topbar').css('background', '#37474F');
        angular.element('.nav-side-menu').css('margin-top', '60px');
        USettings.get().then(function(data){
            $scope.settings = data;
            $scope.base_url = base_url;
        });
        $scope.globalsearchterm = '';
        $scope.$watch('globalsearchterm', function(newVal, oldVal) {
            $rootScope.$broadcast('eventSearchProducts',newVal);
        }, true);

        $rootScope.$on('refreshCartQty',function(){
            $scope.refreshCartQty();
        });

        $scope.qty = 0;
        $scope.refreshCartQty = function(){
            var cart =  conduit.storage('cart').get();
            if(cart.items){
                $scope.qty = Object.keys(cart.items).length;
            }
        };
        $scope.refreshCartQty();

        $scope.search = function(){
            $rootScope.$broadcast('eventSearchProducts',$scope.globalsearchterm);
        }
    }
]);
/**
 *   Routing
 */
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('shop', {
                url: "/shop",
                views: {
                    'header': {
                        templateUrl:'components/modules/ecommerce/templates/shop-header.html',
                        controller:'shop-controller'
                    },
                    'content': {
                        template:'<div class="has-topbar" ui-view></div>'
                    }
                }
            })
    }
]).run(securityHandler);
