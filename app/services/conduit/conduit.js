catwalkApp.factory('conduit', function ($resource,$window,$q,$state,$rootScope) {
    var conduit =  {
        go:function(state,data){
            if(data){
                return $state.go(state,data);
            }else{
                return $state.go(state);
            }
        },
        getParameter:function(key){
            var ret = $state.params[key];
            if(!ret){
                alert("Parameter " + key + " must be defined in the route i.e. --> params{ " + key + ": 'SomeDefaultValue'}");
            }
            return $state.params[key];
        },
        previousState:function(data){
            if(data){
                return $state.go($rootScope.prevState,data);
            }else{
                return $state.go($rootScope.prevState);
            }
        },
        sessionStorage:function(name){
            return {
                get:function () {
                    var storage = angular.fromJson(sessionStorage[name]);
                    if(!storage){
                        storage = {};
                    }
                    return storage;
                },
                save:function (data) {
                    sessionStorage[name] = angular.toJson(data);
                },
                remove:function () {
                    sessionStorage[name] = null;
                }
            }
        },
        localStorage:function(name){
            return {
                get:function () {
                    var storage = angular.fromJson($window.localStorage.getItem(name));
                    if(!storage){
                        storage = {};
                    }
                    return storage;
                },
                save:function (data) {
                    $window.localStorage.setItem(name,angular.toJson(data));
                },
                remove:function () {
                    $window.localStorage.removeItem(name);
                }
            }
        },
        createMongoFlow:function(endpoint,database){
            var context = {
                'template':'mongo_crud.json',
                'databaseName':database,
                'flowName':endpoint,
                'collectionName':endpoint
            };
            var deferred = $q.defer();
            $resource( base_url + 'conduit/flows/template', {}, {}).save(context,function(data){
                deferred.resolve(conduit.collection(endpoint));
            });
            return deferred.promise;
        },
        collection:function(endpoint,context){
            var final = base_url + 'conduit/rest/' + endpoint ;
            if(context){
                final += "/action/" + context;
            }
            return {

                get:function (params) {
                    var deferred = $q.defer();
                    $resource( final, {}, {}).get(params,function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                getById:function (id) {
                    var deferred = $q.defer();
                    $resource( final + '/' + id + '/?', {}, {}).get({id: this.id},function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                post:function(params){
                    var deferred = $q.defer();
                    $resource( final, {}, {}).save(params,function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                save:function (params) {
                    return this.post(params);
                },
                remove:function (id) {
                    var deferred = $q.defer();
                    $resource( final +'/'  + id , {}, {}).remove({id: this.id},function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        }
    };
    return conduit;
});