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
    'as.sortable',                   // Ng Sortable
    'hc.marked',
    'hljs',
    'angular-markdown-editor',
    'iglue'
]).config(['markedProvider', 'hljsServiceProvider', function(markedProvider, hljsServiceProvider) {
    // marked config
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        sanitize: true,
        highlight: function (code, lang) {
            if (lang) {
                return hljs.highlight(lang, code, true).value;
            } else {
                return hljs.highlightAuto(code).value;
            }
        }
    });

    // highlight config
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    });
    window.iglue_env.base_url = "https://jerb.bluntsoftware.com/KoleImports/";
}]).run();
var base_url = 'https://jerb.bluntsoftware.com/KoleImports/'; //'../glue/  http://localhost/glue/ http://localhost:8080/glue/ http://jerb.bluntsoftware.com/KoleImports/
