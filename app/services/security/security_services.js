'use strict';
catwalkApp.constant('USER_ROLES', {
    all: '*',
    admin: 'ROLE_ADMIN',
    superUser:'ROLE_SUPER_USER',
    user: 'ROLE_USER'
});

var user_manager_base_url  = base_url + 'user_manager/';

/* Services */

catwalkApp.factory('Application', ['$resource', function ($resource) {
    return $resource(base_url + 'application', {}, {
        'get': { method: 'GET', params: {}, isArray: false},
        'version':{method: 'GET',isArray: false,url:base_url + 'application' + '/version'}
    });
}]);


catwalkApp.factory('Account', ['$resource', function ($resource) {
    return $resource(user_manager_base_url + 'account', {}, {
    });
}]);

catwalkApp.factory('Register', function ($resource) {
    return $resource(user_manager_base_url + 'register', {}, {
    });
});


catwalkApp.factory('USettings', function ($resource,$q) {
    this.init = function () {
        this.settings = null;
    };
    this.get = function () {
        var deferred = $q.defer();
        var self = this;
        if(!this.settings){
            $resource(user_manager_base_url + 'applicationSettings/uget' , {}, {
                'get': { method: 'GET', params: {}, isArray: false}
            }).get({},function(data) {
                self.settings = data;
                deferred.resolve(self.settings);
            });
        }else{
            deferred.resolve(this.settings);
        }
        return deferred.promise;
    };
    return this;
});
//Must be admin to access
catwalkApp.factory('Settings', function ($resource,$q) {
    this.get = function () {
        var deferred = $q.defer();
        $resource(user_manager_base_url + 'applicationSettings' , {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        }).get({},function(data) {
            deferred.resolve(data.rows[0]);
        });
        return deferred.promise;
    };
    return this;
});

catwalkApp.factory('ResetPassword', function ($resource) {
    return $resource(user_manager_base_url + 'resetpassword', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
});
catwalkApp.factory('ChangePassword', function ($resource) {
    return $resource(user_manager_base_url + 'changepassword', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
});
catwalkApp.factory('Activate', function ($resource) {
    return $resource(user_manager_base_url + 'activate', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
});
catwalkApp.factory('Password', ['$resource',
    function ($resource) {
        return $resource(user_manager_base_url + 'account/change_password', {}, {
        });
    }]);
catwalkApp.factory('AppAPI', ['$resource',
    function ($resource) {
        return $resource(base_url + 'api' , {}, {
            'get':{ method: 'GET', params: {}, isArray: false}
        });
    }
]);
catwalkApp.factory('Sessions', ['$resource',
    function ($resource) {
        return $resource(user_manager_base_url + 'sessions/:series', {}, {
            'get': { method: 'GET', isArray: true}
        });
    }]);
catwalkApp.factory('Session', function () {
    this.create = function (landingPage,login, firstName, lastName, email, userRoles,imgSrc) {
        this.landingPage = landingPage;
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userRoles = userRoles;
        this.imgSrc = imgSrc;
    };
    this.invalidate = function () {
        this.landingPage = null;
        this.login = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.userRoles = null;
        this.imgSrc = null;
    };
    return this;
});




catwalkApp.factory('AuthenticationSharedService', function ($rootScope, $http, authService, Session, Account,$location) {
    return {
        sociallogin:function(){
            Account.get(function(data) {
                Session.create(data.landingPage,data.login, data.firstName, data.lastName, data.email, data.roles,data.imgSrc);
                $rootScope.account = Session;
                authService.loginConfirmed(data);

            });
        },
        login: function (param) {
            var data ="j_username=" + param.username +"&j_password=" + param.password +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
            $http.post(base_url + 'app/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function (data, status, headers, config) {
                Account.get(function(data) {
                    Session.create(data.landingPage,data.login, data.firstName, data.lastName, data.email, data.roles,data.imgSrc);
                    $rootScope.account = Session;
                    authService.loginConfirmed(data);
                    param.success(data);
                });
            }).error(function (data, status, headers, config) {
                $rootScope.authenticationError = true;
                Session.invalidate();
            });
        },

        valid: function (authorizedRoles) {

            if (!authorizedRoles) {
                return true;
            }

            $http.get('protected/authentication_check.gif', {
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function (data, status, headers, config) {

                if (!Session.login) {
                    Account.get(function(data) {
                        Session.create(data.landingPage,data.login, data.firstName, data.lastName, data.email, data.roles,data.imgSrc);
                        $rootScope.account = Session;

                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                            event.preventDefault();

                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                        }

                        $rootScope.authenticated = true;
                    });
                }else{
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                        event.preventDefault();

                        // user is not allowed
                        $rootScope.$broadcast("event:auth-notAuthorized");
                    }
                }
                $rootScope.authenticated = !!Session.login;

            }).error(function (data, status, headers, config) {

                $rootScope.authenticated = false;
                $rootScope.$broadcast("event:auth-loginRequired");
            });
        },

        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles === '*') {
                    return true;
                }
                authorizedRoles = [authorizedRoles];
            }
            var isAuthorized = false;
            angular.forEach(authorizedRoles, function(authorizedRole) {
                var authorized = (!!Session.login &&
                Session.userRoles.indexOf(authorizedRole) !== -1);

                if (authorized || authorizedRole == '*') {
                    isAuthorized = true;
                }
            });
            return isAuthorized;
        },
        logout: function () {
            $http.get(base_url + 'app/logout').success(function (data, status, headers, config) {
                $rootScope.authenticationError = false;
                $rootScope.authenticated = false;
                $rootScope.account = null;
                Session.invalidate();
                authService.loginCancelled();
                $rootScope.$broadcast("event:auth-logout");
            });
        },
        gotoPage:function(page){
            console.log("GoTo Page - > " + page);
            //alert("GoTo Page - > " + page);
            if(page && page !== ''){
                if(page.startsWith("http")){
                    //window.location = page;
                    $location.path('/login').replace();
                }else{
                    $location.path(page.replace("/#","")).replace();
                }
            }else{
                $location.path('/login').replace();
            }
        },
        gotoDefaultPage:function(){
            var self = this;
            if($rootScope.account){
                if(!$rootScope.account.landingPage || $rootScope.account.landingPage === ''){
                    self.gotoPage('/#/index/account');
                }else{
                    self.gotoPage($rootScope.account.landingPage);
                }
            }else{
                USettings.get().then(function(data){
                    self.gotoPage(data.landingPage);
                });
            }
        }
    };
});

var securityHandler = ['$rootScope','$log', '$location', '$http','$state','AuthenticationSharedService', 'Session', 'USER_ROLES',
    function($rootScope,$log, $location, $http,$state, AuthenticationSharedService, Session, USER_ROLES) {
        $rootScope.$state = $state;
        $rootScope.isAdmin = function(){
            if($rootScope.account){
                return $rootScope.account.userRoles.indexOf('ROLE_ADMIN') !== -1;
            }
            return false;
        };
        $rootScope.isSuperUser = function(){
            if($rootScope.account){
                return $rootScope.account.userRoles.indexOf('ROLE_SUPER_USER') !== -1;
            }
            return false;
        };
        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

            $rootScope.prevState = fromState.name;

            $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
            $rootScope.userRoles = USER_ROLES;
            var authorizedRoles = null;
            //Get access from  state provider
            var access = toState.access;
            if(access){
                authorizedRoles = access.authorizedRoles;
            }


            AuthenticationSharedService.valid(authorizedRoles);

            if($rootScope.authenticated === false && toState.url !== '/login'){
                $rootScope.returnToState = toState.name;
                $rootScope.returnToStateParams = toParams;
            }

        });
        $rootScope.$on('event:auth-logout', function(event,data) {
            console.log("*************** LOGOUT *****************");
            $state.go("index.home");
        });
        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function(event,data) {
           // alert('event:auth-loginConfirmed' + $rootScope.returnToState);
            console.log("*************** LOGIN CONFIRMED *****************");
            $rootScope.authenticated = true;
           if($rootScope.returnToState && $rootScope.returnToStateParams ) {
               $state.go($rootScope.returnToState ,$rootScope.returnToStateParams);
            }else if( $rootScope.returnToState){
               $state.go($rootScope.returnToState);
            }else{
               $state.go("index.home");
            }
        });
        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function(rejection) {
            Session.invalidate();

            $rootScope.authenticated = false;
            var exceptions = [
                '',
                '/' 
            ];

             if (!($rootScope.inArray($location.path(), exceptions))) {
                $location.path('/login').replace();
             }
        });
        $rootScope.inArray = function(val,array){
            if (($.inArray(val, array) > -1)){
                  return true;
            }
            return val.indexOf("/resetpassword/") > -1;
        };

        $rootScope.$on('event:auth-notAuthorized', function(rejection) {
            $rootScope.errorMessage = 'errors.403';
            console.log('Un authorised');
            $location.path('/error').replace();
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function() {
            //alert("event:auth-loginCancelled");
            //AuthenticationSharedService.gotoDefaultPage();
        });

        $rootScope.log = function(val) {
            $log.info(val);
        };
    }
];
