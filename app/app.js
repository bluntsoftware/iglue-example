/**
 *   Set the base_url below to your IGlue Server location / context
 *   type npm install on the command line. will install the grunt and bower libraries
 *   type bower install on the command line. will install all of the dependent javascript libraries.
 *   type grunt build on the command line. will build a minimized version of the client in the www folder
 *   type grunt live on the command line. will start the app in a simple development web server.
 */
var catwalkApp  = angular.module('catwalk', [
    'ui.router',                    // Routing
    'ngAnimate',                    // Bootstrap animation
    'ui.bootstrap',                 // Bootstrap Styling
    'ngResource',                   // Ajax Server Calls
    'ngCookies',                    // Security Tokens
    'ngSanitize',
    'ui.select',
    'http-auth-interceptor',        // Security
    'pascalprecht.translate',       // Different Languages
    'ngTagsInput',                  // tags
    'as.sortable'                   // Ng Sortable
]).run();
var base_url = 'http://localhost/glue/'; //'../glue/  http://localhost/glue/ http://localhost:8080/glue/ http://jerb.bluntsoftware.com/KoleImports/
