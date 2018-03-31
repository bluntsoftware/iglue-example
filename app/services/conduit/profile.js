catwalkApp.factory('profile', function (conduit,$rootScope) {
    return {
        collection:function(){
            return conduit.collection('profile');
        },
        get:function(){
            var deferred = $q.defer();
            var account = $rootScope.account;
            var id = account.login;
            if(id){
                this.collection().getById(id).then(function(profile){
                    if(!profile){
                        profile = {'_id':id};
                    }
                    deferred.resolve(profile);
                });
            }
            return deferred.promise;
        }
    }
});