catwalkApp.controller('cart-controller', ['$scope','$rootScope','$location','$stateParams','conduit',
    function ($scope,$rootScope,$location,$stateParams,conduit) {

        $scope.restoreState=function () {
            var cart = conduit.localStorage('cart').get();
           if(cart){
               $scope.cart = cart;
           }else{
               $scope.cart = {'items':{}};
           }
        };
        $scope.restoreState();

        $scope.remove = function(id){
            delete  $scope.cart.items[id];
            $scope.calculate();
        };

        $scope.saveCart = function(){
            conduit.localStorage('cart').save($scope.cart);
            $rootScope.$emit('refreshCartQty');
        };

        $scope.$watch('cart', function(newVal, oldVal) {
            $scope.calculate();
            $scope.saveCart();
        }, true);

        $scope.calculate = function(){
            var subTotal = 0;
            var estimateShip = 0;
            $.each($scope.cart.items,function(idx,item){
                var total = 0;
                if(item.tiers[0]){
                    total = item.qty * item.tiers[0].price;
                }

                $scope.cart.items[item._id]['total'] = total;
                subTotal += total;
                estimateShip += item.qty *2;
            });
            var tax = subTotal * .06;
            var shipping = 15;
            if(estimateShip > shipping){
                shipping = estimateShip;
            }
            $scope.cart['subTotal'] = subTotal;
            $scope.cart['tax'] = tax;
            $scope.cart['shippingTotal'] = shipping;
            $scope.cart['total'] =  subTotal + tax + shipping;

        };

        $scope.calculate();
    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('shop.cart', {
                url: "/cart",
                templateUrl: "components/modules/ecommerce/templates/cart.html",
                controller: 'cart-controller'
            })
    }
]);