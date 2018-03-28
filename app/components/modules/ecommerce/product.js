
catwalkApp.controller('product-controller', ['$scope','$rootScope','$location','$stateParams','conduit','$q',
    function ($scope,$rootScope,$location,$stateParams,conduit,$q) {
        $scope.srchterm = '';
        $scope.collection = conduit.collection('product','');
        $scope.category ='';
        $scope.subcategory='';

        $scope.listParams = {
            or:false,
            filterByFields: "{}",
            page: 1,
            sord: "ASC",
            projection: {},
            rows: 20,
            sidx: "title"
        };

        $scope.addProductTag = function(tag){
            if(tag && tag.text){
                conduit.collection('product-tag','').save({_id:tag.text});
            }
        };

        $scope.loadProductTags = function(query){
            var deferred = $q.defer();
            var listparams = {
                sord: "ASC",
                rows: 1000,
                sidx: "_id",
                filterByFields:{'_id':{ '$regex': '^'+query , '$options': 'i' } }
            };
            conduit.collection('product-tag','').get(listparams ).then(function(data){
                var tags = [];
                $.each(data.rows,function(idx,tag){
                    tags.push({'text':tag._id});
                });
                deferred.resolve(tags);
            });
            return  deferred.promise;
        };

        $scope.totalpages = 0;

        $rootScope.$on('eventSearchProducts',function(events,data){
            $scope.srchterm = data;
        });

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

        $scope.search = function(){
            var filterByFields =  {'$and':[]};
            var or = {'$or':[]};
            var search = $scope.srchterm;
            var filter = false;
            //lets search on subcategory, category && title mongo search
            $scope.listParams.page = 1;

            if($scope.category && $scope.category !== ''){
                filterByFields['$and'].push({'category':{'$eq':$scope.category}});
                filter = true;
            }
            if($scope.subcategory && $scope.subcategory !== ''){
                filterByFields['$and'].push({'subcategory':{'$eq':$scope.subcategory}});
                filter = true;
            }

            if( search && search !== '' ){
                or['$or'].push({'subcategory':{'$regex':search,'$options':'i'}});
                or['$or'].push({'category':{'$regex':search,'$options':'i'}});
                or['$or'].push({'title':{'$regex':search,'$options':'i'}});
                filterByFields['$and'].push(or);
                filter = true;
            }
            if(filter){
                $scope.listParams['projection']['subcategory'] = 1;
                $scope.listParams['projection']['category'] = 1;
                $scope.listParams['projection']['title'] = 1;
                $scope.listParams['filterByFields'] =  filterByFields;
            }
            else{
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
            $scope.collection.getById(id).then(function(product) {
                $scope.modelData = product;
                $scope.imageSrc = "";
            });
        };

        $scope.save = function(){
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
            $location.path('/ecom/product/');
        };

        $scope.update= function(id){
            $location.path('/ecom/product/' + id);
        };

        $scope.detail= function(id){
            $location.path('/shop/detail/' + id);
        };

        $scope.shopHome= function(){
            $location.path('/shop/home');
        };

        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}

    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.products', {
                url: "/products",
                templateUrl: "components/modules/ecommerce/templates/product-list.html",
                controller: 'product-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('ecom.new_product', {
                url: "/product",
                templateUrl: "components/modules/ecommerce/templates/product.html",
                controller: 'product-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('ecom.product', {
                url: "/product/:id",
                templateUrl: "components/modules/ecommerce/templates/product.html",
                controller: 'product-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('shop.home', {
                url: "/home",
                templateUrl: "components/modules/ecommerce/templates/home.html",
                controller: 'product-controller'
            })
            .state('shop.detail', {
                url: "/detail/:id",
                templateUrl: "components/modules/ecommerce/templates/detail.html",
                controller: 'product-controller'
            })

    }
]);