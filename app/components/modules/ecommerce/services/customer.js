catwalkApp.factory('customer', function (conduit) {
    return {
        collection:function(){
            return conduit.collection('customer');
        },
        getByAccount:function(){

        }
    }
});