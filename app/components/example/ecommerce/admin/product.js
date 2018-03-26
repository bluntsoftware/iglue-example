
catwalkApp.controller('product-controller', ['$scope','conduit',
    function ($scope,conduit) {
        $scope.listParams = {
            "or":false, "filterByFields": "{}", "page": 1, "sord": "ASC", "projection": "{}", "rows": 20, "sidx": "_id"
        };

        conduit.collection('product','').get($scope.listParams ).then(function(data){
            console.log(data.rows);
            $scope.items = data.rows;
        });


    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.products', {
                url: "/products",
                templateUrl: "components/example/ecommerce/templates/product-list.html",
                controller: 'product-controller'
            })
            .state('ecom.product', {
                url: "/product",
                templateUrl: "components/example/ecommerce/templates/product.html",
                controller: 'product-controller'
            })
    }
]);