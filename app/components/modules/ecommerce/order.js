
catwalkApp.controller('order-controller', ['$scope','$location','$stateParams','conduit','customer',
    function ($scope,$location,$stateParams,conduit,customer) {
        $scope.srchterm = '';
        $scope.collection = conduit.collection('order','');
        $scope.listParams = {
            or:false,
            filterByFields: "{}",
            page: 1,
            sord: "ASC",
            projection: {},
            rows: 20,
            sidx: "title"
        };
        $scope.customer = {};


        $scope.modelData = conduit.localStorage('cart').get();


        if($scope.modelData.items){
            $scope.qty = Object.keys($scope.modelData.items).length;
        }

        $scope.placeOrder = function(){

            conduit.collection('customer','').get().then(function(){

            });

            $scope.modelData['account'] = $scope.account;
            console.log($scope.modelData);
          //Validate Address and Payment Method
            $scope.collection.save($scope.modelData).then(function(){
               // conduit.localStorage('cart').remove();
               // $location.path('/shop/home');
            });
        };

        $scope.totalpages = 0;

        $scope.$watch('srchterm', function(newVal, oldVal) {
            $scope.search();
        }, true);

        $scope.sort = function(){
            if($scope.listParams.sord ==='ASC'){
                $scope.listParams.sord = 'DESC';
            }else{
                $scope.listParams.sord = 'ASC';
            }
            $scope.search();
        };

        $scope.search = function(){
            var filterByFields = {'$or':[]};
            var search = $scope.srchterm;
            //lets search on subcategory, category && title
            $scope.listParams.page = 1;
            if( search&& search !== '' ){
                filterByFields['$or'].push({'subcategory':{'$regex':search,'$options':'i'}});
                filterByFields['$or'].push({'category':{'$regex':search,'$options':'i'}});
                filterByFields['$or'].push({'title':{'$regex':search,'$options':'i'}});
                $scope.listParams['projection']['subcategory'] = 1;
                $scope.listParams['projection']['category'] = 1;
                $scope.listParams['projection']['title'] = 1;
                $scope.listParams['filterByFields'] =  filterByFields;
            }else{
                $scope.listParams['projection'] = {};
                $scope.listParams['filterByFields'] = {};
            }
            $scope.list();
        };
        $scope.cycle= function(){
            if($scope.interval){
                clearInterval($scope.interval);
                $scope.interval = null;
            }else{
                $scope.interval = setInterval(function() {
                    $scope.nextPage();
                }, 1500);
            }
        };
        $scope.nextPage = function(){
            $scope.setPage($scope.listParams.page + 1);
        };
        $scope.prevPage = function(){
            $scope.setPage($scope.listParams.page - 1);
        };

        $scope.setPage = function(page){
            $scope.listParams.page = page;
            $scope.list();
        };

        $scope.list = function(){
            $scope.collection.get($scope.listParams ).then(function(data){
                $scope.items = data.rows;
                $scope.listParams.page = data.currpage;
                $scope.totalpages = data.totalpages;
            });
        };

        $scope.get = function(id){
            $scope.collection.getById(id).then(function(order) {
                $scope.modelData = order;
                $scope.imageSrc = "";
            });
        };

        $scope.save = function(){
            $scope.collection.save($scope.modelData).then(function(){

            });
        };

        $scope.remove = function(id){
            $scope.collection.remove(id).then(function () {
                $scope.list();
            });
        };

        $scope.back = function () {
            window.history.back();
        };

        $scope.new= function(){
            $location.path('/ecom/order/');
        };

        $scope.update= function(id){
            $location.path('/ecom/order/' + id);
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}

    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.orders', {
                url: "/orders",
                templateUrl: "components/modules/ecommerce/templates/order-list.html",
                controller: 'order-controller'
            })
            .state('ecom.new_order', {
                url: "/order",
                templateUrl: "components/modules/ecommerce/templates/order.html",
                controller: 'order-controller'
            })
            .state('ecom.order', {
                url: "/order/:id",
                templateUrl: "components/modules/ecommerce/templates/order.html",
                controller: 'order-controller'
            })
            .state('shop.checkout', {
                url: "/checkout",
                templateUrl: "components/modules/ecommerce/templates/checkout.html",
                controller: 'order-controller'
            })
    }
]);