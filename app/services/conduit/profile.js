catwalkApp.factory('profile', function ($q,conduit,$rootScope) {
    return {
        collection:function(){
            return conduit.collection('profile');
        },
        get:function(){
            var deferred = $q.defer();
            var account = $rootScope.account;
            if(!account){
                alert('Not Logged In');
                deferred.resolve({'error':'Not Logged In'});
            }else{
                var id = account.login;
                if(id){
                    this.collection().getById(id).then(function(profile){
                        if(!profile){
                            profile = {'_id':id};
                        }
                        deferred.resolve(profile);
                    });
                }
            }
            return deferred.promise;
        }
    }
});