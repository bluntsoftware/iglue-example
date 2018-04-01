catwalkApp.factory('profile', function ($q,conduit,$rootScope,Account) {
    return {
        collection:function(){
            return conduit.collection('profile');
        },
        get:function(){
            var deferred = $q.defer();
            Account.get(function(data) {
                if(data && data.login){
                    var id = data.login;
                    conduit.collection('profile').getById(id).then(function(profile){
                        if(!profile['_id']){
                            profile = {'_id':id};
                        }
                        deferred.resolve(profile);
                    });
                }else{
                    deferred.resolve({'error':'Not Authenticated'});
                }
            });
            return deferred.promise;
        }
    }
});