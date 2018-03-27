catwalkApp.controller('eco-dashboard-controller', ['$scope',
    function ($scope) {

    }
]);
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.dashboard', {
                url: "/dashboard",
                templateUrl: "components/modules/ecommerce/admin/templates/dashboard.html",
                controller: 'eco-dashboard-controller'
            })
    }
]);