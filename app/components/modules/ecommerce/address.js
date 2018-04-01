catwalkApp.controller('address-controller', ['$scope','$location','$stateParams','conduit','profile',
    function ($scope,$location,$stateParams,conduit,profile) {
        $scope.srchterm = '';
        $scope.collection = conduit.collection('address','');
        $scope.listParams = {
            or:false,
            filterByFields: "{}",
            page: 1,
            sord: "ASC",
            projection: {},
            rows: 20,
            sidx: "title"
        };
        $scope.totalpages = 0;

        //save the default address to the users profile
        $scope.select = function(id){
            profile.get().then(function(data){
                $scope.collection.getById(id).then(function(address) {
                    data[conduit.getParameter('addressType')] = address;
                    profile.collection().save(data).then(function(){
                        conduit.previousState();
                    });
                });
            });
        };

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
            $scope.collection.getById(id).then(function(customer) {
                $scope.modelData = customer;
                $scope.imageSrc = "";
            });
        };

        $scope.save = function(){
            console.log($scope.modelData);
            $scope.collection.save($scope.modelData).then(function(){
                $scope.back();
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



        $scope.new = function(){
            $location.path('/shop/address/');
        };

        $scope.admin_new = function(){
            $location.path('/ecom/address/');
        };

        $scope.update= function(id){
            $location.path('/shop/address/' + id);
        };

        $scope.admin_update= function(id){
            $location.path('/ecom/address/' + id);
        };
        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}

    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.addresses', {
                url: "/addresses",
                templateUrl: "components/modules/ecommerce/templates/address-list.html",
                controller: 'address-controller'
            })
            .state('ecom.new_address', {
                url: "/address",
                templateUrl: "components/modules/ecommerce/templates/address.html",
                controller: 'address-controller'
            })
            .state('ecom.address', {
                url: "/address/:id",
                templateUrl: "components/modules/ecommerce/templates/address.html",
                controller: 'address-controller'
            })
            .state('shop.address-manager', {
                url: "/address-manager",
                templateUrl: "components/modules/ecommerce/templates/address-manager.html",
                controller: 'address-controller',
                params:{
                    addressType:'shipping'
                }
            })
            .state('shop.new_address', {
                url: "/address",
                templateUrl: "components/modules/ecommerce/templates/address.html",
                controller: 'address-controller'
            })
            .state('shop.address', {
                url: "/address/:id",
                templateUrl: "components/modules/ecommerce/templates/address.html",
                controller: 'address-controller'
            })
    }
]);