//Main Controller
catwalkApp.controller('indexController', ['$scope','Account',
    function ($scope,Account) {

    }
]);

/**
 *   Routing
 */
catwalkApp.config(['$stateProvider', '$urlRouterProvider','USER_ROLES',
    function ($stateProvider, $urlRouterProvider,USER_ROLES) {
        
        $stateProvider
            .state('index', {
                url: "/index",
                views: {
                    'header': {
                        templateUrl:'components/app/topnavbar.html',
                        controller:'indexController as main'
                    },
                    'content': {
                        template:'<div ui-view></div>'
                    }
                    /*,
                    'footer': {
                        templateUrl:'components/app/footer.html',
                        controller:'indexController as main'
                    }*/
                }
            })
    }
]).run(securityHandler);
