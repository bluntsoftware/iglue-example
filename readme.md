# IGlue-Example 
#### A seed for an IGlue Angular Client application

This project is an application skeleton for a typical [IGlue Angular Client][iglue-catwalk] web application. You can use it
to quickly bootstrap your angular webapp projects and dev environment for these projects.

The seed contains a sample iglue-client application and is preconfigured to install the Angular
framework and iglue user management for instant web development gratification.

 

## Getting Started

To get you started you can simply clone the `IGlue-Example` repository and install the dependencies:

### Prerequisites

You need git to clone the `IGlue-Example` repository. You can get git from [here][git].

We also use a number of Node.js tools to initialize `IGlue-Example`. You must have Node.js
and its package manager (npm) installed. You can get them from [here][node].

### Clone `IGlue-Example`

Clone the `IGlue-Example` repository using git and remove remote origin:

```
git clone https://github.com/bluntsoftware/IGlue-Example.git
cd IGlue-Example
git remote rm origin
```

If you just want to start a new project without the `IGlue-Example` commit history then you can do:

```
git clone --depth=1 https://github.com/bluntsoftware/IGlue-Example.git <your-project-name>
```

The `depth=1` tells git to only pull down one commit worth of historical data.

### Install Dependencies

We have three kinds of dependencies in this project: tools and Angular framework code. The tools help
us manage and build the application.

* We get the tools we depend upon via `npm`, the [Node package manager][npm].
* We get the Angular code via `bower`, a [client-side code package manager][bower].
* We build using grunt 

To configure the libraries and build the app we can simply do:

```
npm install
bower install
grunt build
```

After that, you should find out that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the Angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
`angular-seed` changes this location through the `.bowerrc` file. Putting it in the `app` folder
makes it easier to serve the files by a web server.

### Set the location of the Backend Server
 Before being able to connect to the server glue-client needs to know where it is. In the app.js file set the base_url to the iglue back-end url.
```
var base_url = 'http://localhost:8080/glue/';
```

### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
grunt live
```

Now browse to the app at [`localhost:9000`][local-app-url].


## Directory Layout

```
app/                   --> all of the source files for the application
  components/              --> all app specific modules
    admin/users                --> user management (only admin access allowed)
      users.js                     --> list add remove users of the system
    home/                      --> main page (anomomous access allowed)
      home.js                      --> Quick registration
    security/                  --> Authentication login, register, reset password
      security_config.js           --> security tools and dialogs
    user/                      --> dash board (authenticated users only)
       dashboard                   --> change password, theme
  app.js                    --> main application module
  index.html                --> app layout file (the main html template file of the app)
```


 
## Updating Angular

Since the Angular framework library code and tools are acquired through package managers (npm and
bower) you can use these tools to easily update the dependencies. Simply run the preconfigured
script:

```
npm run update-deps
```

This will call `npm update` and `bower update`, which in turn will find and install the latest
versions that match the version ranges specified in the `package.json` and `bower.json` files
respectively.

 
 
### Running the App during Development
```
grunt live
```
Just changing a file and saving should update your browser with the changes.

### Running the App in Production
This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static HTML, CSS and JavaScript files that need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via XHR or other means, you need to figure out
what is the best way to host the static files to comply with the same origin policy if applicable.
Usually this is done by hosting the files by the backend server or through reverse-proxying the
backend server(s) and web server(s).


 
## Contact

For more information on IGlue please check out [bluntsoftware][iglue-catwalk].

[iglue-catwalk]:http://bluntsoftware.com/catwalk
[angularjs]: https://angularjs.org/
[bower]: http://bower.io/
[git]: https://git-scm.com/
[local-app-url]: http://localhost:9000
[node]: https://nodejs.org/
[npm]: https://www.npmjs.org/

