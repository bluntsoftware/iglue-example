catwalkApp.controller('payment-controller', ['$scope','$location','$stateParams','conduit','profile','Payment',
    function ($scope,$location,$stateParams,conduit,profile,Payment) {
        $scope.srchterm = '';
        $scope.collection = conduit.collection('payment','');
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


        $scope.configureBraintree = function(){
            Payment.client_token(function(token){
                console.log(token);
                braintree.setup(token.client_token, 'dropin', {
                    container: 'dropin-container',
                    onPaymentMethodReceived:function(data){
                        console.log(data);
                        $scope.collection.save(data);


                        /*console.log($scope.registerAccount);
                        $scope.registerAccount['payment_info'] = data;
                        $scope.registerAccount['planId'] = $scope.planId;
                        Payment.subscribe( $scope.registerAccount,function(){
                            //alert('Subscribe');
                            AuthenticationSharedService.gotoDefaultPage();
                        });*/
                    }
                });
            });

        };
        $scope.configureBraintree();

        //save the default payment to the users profile
        $scope.select = function(id){
            profile.get().then(function(data){
                $scope.collection.getById(id).then(function(payment) {
                    data['payment'] = payment;
                    profile.collection().save(data).then(function(){
                        conduit.previousState();
                    });
                });
            });
        };

        $scope.$watch('srchterm', function(newVal, oldVal) {
            $scope.search();
        }, true);

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

        $scope.sort = function(){
            if($scope.listParams.sord ==='ASC'){
                $scope.listParams.sord = 'DESC';
            }else{
                $scope.listParams.sord = 'ASC';
            }
            $scope.search();
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
            $scope.collection.save($scope.modelData).then(function(){
                $scope.back();
            });
        };

        $scope.remove = function(id){
            $scope.collection.remove(id).then(function () {
                $scope.list();
            });
        };

        $scope.back = function () {conduit.previousState();};
        $scope.new = function(){conduit.go('shop.payment');};
        $scope.admin_new = function(){conduit.go('ecom.payment');};
        $scope.update= function(id){conduit.go('shop.payment',{id: id});};
        $scope.admin_update= function(id){conduit.go('ecom.payment',{id: id});};
        if($stateParams.id){ $scope.get($stateParams.id);}
        else{ $scope.list();}
    }
]);

catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('ecom.payments', {
                url: "/payments",
                templateUrl: "components/modules/ecommerce/templates/payment-list.html",
                controller: 'payment-controller'
            })
            .state('ecom.new_payment', {
                url: "/payment",
                templateUrl: "components/modules/ecommerce/templates/payment.html",
                controller: 'payment-controller'
            })
            .state('ecom.payment', {
                url: "/payment/:id",
                templateUrl: "components/modules/ecommerce/templates/payment.html",
                controller: 'payment-controller'
            })
            .state('shop.payment-manager', {
                url: "/payment-manager",
                templateUrl: "components/modules/ecommerce/templates/payment-manager.html",
                controller: 'payment-controller'
            })
            .state('shop.new_payment', {
                url: "/payment",
                templateUrl: "components/modules/ecommerce/templates/payment.html",
                controller: 'payment-controller'
            })
            .state('shop.payment', {
                url: "/payment/:id",
                templateUrl: "components/modules/ecommerce/templates/payment.html",
                controller: 'payment-controller'
            })
    }
]);