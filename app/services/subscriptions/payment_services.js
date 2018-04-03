catwalkApp.factory('Payment', ['$resource',
    function ($resource) {
        return $resource(base_url + 'payment', {}, {
            'client_token': { method: 'POST', params: {}, isArray: false,url:base_url + 'payment' + '/client_token'},
            'checkout':{method: 'POST',params: {},isArray: false,url:base_url + 'payment' + '/checkout'},
            'subscribe':{method: 'POST',isArray: false,url:base_url + 'payment' + '/subscribe'},
            'mysubscriptions':{method: 'GET',isArray: false,url:base_url + 'payment' + '/my_subscriptions'},
            'mytransactions':{method: 'GET',isArray: false,url:base_url + 'payment' + '/my_transactions'},
            'subscriptions':{method: 'GET',isArray: false,url:base_url + 'payment' + '/subscriptions'},
            'cancel_subscription':{method: 'GET',params:{subscriptionId:'@subscriptionId'},isArray: false,url:base_url + 'payment' + '/cancel_subscription'}
        });
}]);

catwalkApp.factory('SubscriptionPlan', ['$resource',
    function ($resource) {
        return $resource(base_url + 'subscription/plan/'+':id', {}, {
            'update':{method: 'POST',isArray: false,url:base_url + 'subscription/plan/update'},
            'query':{method:'GET',
                transformResponse:function(data,headers){
                    return JSON.parse(data);
                }
            },
            'get':{method:'GET'},
            'getByPlanId':{method:'POST',params:{planId:'@planId'},isArray: false,url:base_url + 'subscription/plan/getByPlanId'}
        });
}]);