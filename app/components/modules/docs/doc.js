//Main Controller
catwalkApp.controller('doc-controller', ['$scope','$rootScope','$stateParams','USettings','conduit','$q',
    function ($scope,$rootScope,$stateParams,USettings,conduit,$q) {


        angular.element('.nav-side-menu').css('margin-top', '60px');

        $scope.srchterm = '';
        $scope.collection = conduit.collection('doc','');
        $scope.category ='';
        $scope.subcategory='';

        $scope.listParams = {
            or:false,
            filterByFields: "{}",
            page: 1,
            sord: "ASC",
            projection: {},
            rows: 5000,
            sidx: "title"
        };

        $scope.listTOC = function(){
            var toc = {};
            $.each($scope.items,function(idx,item){
                if(item.category && item.subcategory ){
                    if(!toc[item.category]){
                        toc[item.category] = {};
                    }
                    toc[item.category][item.subcategory] = item._id;
                }
            });
            $scope.toc = toc;
        };

        $scope.addCategoryTag = function(tag){
            if(tag && tag.text){
                conduit.collection('doc-tag','').save({_id:tag.text});
            }
        };

        $scope.loadCategoryTags = function(query){
            var deferred = $q.defer();
            var listparams = {
                sord: "ASC",
                rows: 1000,
                sidx: "_id",
                filterByFields:{'_id':{ '$regex': '^'+query , '$options': 'i' } }
            };
            conduit.collection('doc-tag','').get(listparams ).then(function(data){
                var tags = [];
                $.each(data.rows,function(idx,tag){
                    tags.push({'text':tag._id});
                });
                deferred.resolve(tags);
            });
            return  deferred.promise;
        };

        $scope.totalpages = 0;

        $rootScope.$on('docChanged',function(events,data){
            $scope.list();
        });


        $rootScope.$on('eventSearchdocs',function(events,data){
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
                or['$or'].push({'description':{'$regex':search,'$options':'i'}});
                filterByFields['$and'].push(or);
                filter = true;
            }
            if(filter){
                $scope.listParams['projection']['subcategory'] = 1;
                $scope.listParams['projection']['category'] = 1;
                $scope.listParams['projection']['description'] = 1;
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
            var deferred = $q.defer();
            $scope.collection.get($scope.listParams ).then(function(data){
                $scope.items = data.rows;
                $scope.listParams.page = data.currpage;
                $scope.totalpages = data.totalpages;
                $scope.listTOC();
                deferred.resolve(data);
            });
            return deferred.promise;
        };


        $scope.get = function(id){
            $scope.collection.getById(id).then(function(doc) {
                $scope.modelData = doc;

            });
        };

        $scope.save = function(){
            $scope.collection.save($scope.modelData).then(function(doc){
                $rootScope.$emit('docChanged');
                $scope.view(doc._id);
            });
        };

        $scope.selectFirst = function(){
            $scope.view($scope.items[0]._id);
        };

        $scope.remove = function(id){
            $scope.collection.remove(id).then(function () {
                $rootScope.$emit('docChanged');
                $scope.selectFirst();
            });
        };

        $scope.back = function () {
            conduit.previousState();
        };

        $scope.new= function(){
            if($scope.isAdmin()) {
                conduit.go('doc.edit');
            }
        };

        $scope.update= function(id){
            if($scope.isAdmin()){
                conduit.go('doc.edit',{id: id});
            }
        };

        $scope.view= function(id){
            conduit.go('doc.view',{id: id});
        };

        if($stateParams.id){
            $scope.get($stateParams.id);
        }

        $scope.list().then(function(){
            if(!$scope.modelData && !$scope.isAdmin()){
                 $scope.selectFirst();
            }
        });

    }
]);
/**
 *   Routing
 */
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        $stateProvider
            .state('doc', {
                url: "/doc",
                views: {
                    'header': {
                        templateUrl:'components/modules/docs/templates/doc-header.html',
                        controller:'doc-controller'
                    },
                    'side': {
                        templateUrl:'components/modules/docs/templates/doc-toc.html',
                        controller:'doc-controller'
                    },
                    'content': {
                        template:'<div class="has-sidebar has-topbar" ui-view></div>'
                    }

                }
            })
            .state('doc.view', {
                url: "/view/:id",
                templateUrl:'components/modules/docs/templates/doc-view.html',
                controller: 'doc-controller',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }

            }).state('doc.edit', {
                url: "/edit/:id",
                templateUrl:'components/modules/docs/templates/doc.html',
                controller: 'doc-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            }).state('doc.new', {
                url: "/new",
                templateUrl: "components/modules/docs/templates/doc.html",
                controller: 'doc-controller',
                access: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
    }
]).run(securityHandler);