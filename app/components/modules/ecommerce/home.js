catwalkApp.controller('MainCtrl', ['$scope','$state','$translate','$window','conduit','SubscriptionPlan','USettings',
    function ($scope,$state,$translate,$window,conduit,SubscriptionPlan,USettings) {


    }
]);
//  Home Routing
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $urlRouterProvider.otherwise('/index/home');
        $stateProvider
            .state('shop.home', {
                url: "/home",
                templateUrl: "components/home/home.html",
                controller: 'MainCtrl'
            })

    }
]);
