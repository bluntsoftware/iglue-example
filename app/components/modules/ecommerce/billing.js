catwalkApp.controller('billing-controller', ['$scope','$location','$stateParams','conduit','Settings',
    function ($scope,$location,$stateParams,conduit,Settings) {
        $scope.srchterm = '';
        $scope.collection = conduit.collection('billing','');
        $scope.listParams = {
            or:false,
            filterByFields: "{}",
            page: 1,
            sord: "ASC",
            projection: {},
            rows: 20,
            sidx: "title"
        };
        $scope.today = new Date();
        $scope.totalpages = 0;

        $scope.$watch('srchterm', function(newVal, oldVal) {
            $scope.search();
        }, true);

        $scope.sort = function(sortField){
            if(sortField){
                $scope.listParams.sidx = sortField;
            }
            if($scope.listParams.sord ==='ASC'){
                $scope.listParams.sord = 'DESC';
            }else{
                $scope.listParams.sord = 'ASC';
            }
            $scope.search();
        };
        Settings.get().then(function(data){
            $scope.settings = data;
            $scope.base_url = base_url;
        });


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
            $scope.collection.getById(id).then(function(billing) {
                $scope.modelData = billing;
                conduit.collection('order','').getById(billing.order).then(function(order){
                    console.log(order);
                    $scope.order = order;
                });
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

        $scope.new= function(){
            $location.path('/ecom/billing/');
        };

        $scope.update= function(id){
            $location.path('/ecom/billing/' + id);
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}

    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.billings', {
                url: "/billings",
                templateUrl: "components/modules/ecommerce/templates/billing-list.html",
                controller: 'billing-controller'
            })
            .state('ecom.new_billing', {
                url: "/billing",
                templateUrl: "components/modules/ecommerce/templates/billing.html",
                controller: 'billing-controller'
            })
            .state('ecom.billing', {
                url: "/billing/:id",
                templateUrl: "components/modules/ecommerce/templates/billing.html",
                controller: 'billing-controller'
            })
            .state('ecom.billing-invoice', {
                url: "/billing-invoice/:id",
                templateUrl: "components/modules/ecommerce/templates/billing-invoice.html",
                controller: 'billing-controller'
            })
    }
]);