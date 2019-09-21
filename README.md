### CREATE AWS INSTANCE
Ubuntu
Create security groups to expose ports 3000, 8091 to all IPs

### INSTALL
`sudo apt install git`
`git clone https://github.com/wesleychipeco/trifecta-fantasy-league.git`
Install node https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/
`sudo apt-get install curl`
`curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
`sudo apt-get update`
`sudo apt-get install -y nodejs`
`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
`sudo apt update`
`sudo apt install yarn`

To open tunnel:
`yarn add ngrok`
manually add authtoken to created file: `/home/ubuntu/ngrok.yml`
run `ngrok http 3000 -bind-tls=true -config=ngrok.yml` from `/home/ubuntu`

### Use screen to start processes
screen -S <screen_name> --- create screen
screen -ls --- see all screens
screen -x <screen_name> --- attach to screen
CTRL + a + d --- detach from screen

## Create each collection in MongoDB first, and add rules in Stitch ##
+ If in season -> pull data via API -> save to mongo & save to redux
+ If not in season or in season and already scraped today -> pull data via mongo -> save to redux
+ Sorting -> sort data and save to redux to re-render


# React Native Web Boilerplate 🥘 with navigation 🗺

A small and simple boilerplate for lazy people to create a universal Web/Native React app. How is that possible? By code sharing between both of those worlds. The most crucial element of this puzzle is a brilliant [React Native Web](https://github.com/necolas/react-native-web) library by [Nicolas Gallagher](http://nicolasgallagher.com).

This boilerplate will save you the hassle of configuring it by your own. Like I said. Lazy bones.

> There's also version without app navigation built in. [Check it out here.](https://github.com/inspmoore/rnw_boilerplate)

## Installing 🔩

Clone the repo and run

```
yarn
```

or

```
npm install
```

to install all the dependencies.

## Scripts ️️️⚙️

The scripts are a mix of [create-react-app](https://github.com/facebook/create-react-app#npm-start-or-yarn-start) and [react-native](https://facebook.github.io/react-native/docs/getting-started).

### `yarn start-web` or `npm run start-web`

Runs your app in the browser under the http://localhost:3000.

### `yarn start` or `npm run start`

Starts metro bundler for your react native project.

### `yarn start-ios` or `npm run start-ios`

Runs metro bundler and opens the app in the iOS simulator.

### `yarn build` or `npm run build`

Builds your web app for production.

### `yarn test` or `npm run test`

Runs the test environment for the native part.

### `yarn test-web` or `npm run test-web`

Runs the test environment for the web part.

### `yarn eject` or `npm run eject`

Eject your web project to your custom setup.

## Usage 🛠

Folder and file structure is also a result of combination of create-react-app and react-native boilerplates.

```
rnw_boilerplate
├── android
├── ios
├── node_modules
├── public
├── src
│    ├── NativeWebRouteWrapper
│    │    ├── index.js
│    │    ├── pop.native.js
│    │    └── pop.web.js
│    ├── App.js
│    ├── App.native.js
│    ├── HomeScreen.js
│    ├── index.js - web index file
│    └── registerServiceWorker.js
├── app.json
├── index.js - native index file
├── package.json
└── README.md
```

`HomeScreen.js` file is an example of a component shared between the platforms. Thanks to React Native Web lib, it is possible to use React Native primitives in the Web environment. Please check out [RNW guide](https://github.com/necolas/react-native-web) for more details.

Also notice that there are separate `App.js` files for Web and Native. This gives a lot of advantages, including adding platform specific libraries to your app.

### Navigation

In the native environment things are simple and easy. Just use [`react-navigation`](https://reactnavigation.org).

Web is however more complicated. In the spirit of RNW I've ported some `react-navigation` functionality using `react-router-dom`. Using a `WebRoutesGenerator` little helper function found in the `NativeWebRouteWrapper` lib you can create routes with a `react-navigation' like API.

First create a route map and pass it to the `WebRoutesGenerator`

```javascript
const routeMap = {
  Home: {
    component: HomeScreen,
    path: "/",
    exact: true
  },
  Second: {
    component: SecondScreen,
    path: "/second"
  },
  User: {
    component: UserScreen,
    path: "/user/:name?",
    exact: true
  },
  DasModal: {
    component: DasModalScreen,
    path: "*/dasmodal",
    modal: true
  }
};

// in the render method
WebRoutesGenerator({ routeMap });
```

The components are wrapped in a HOC that adds `navigation` prop. This props has three methods to work with:

- `this.props.navigation`
  - `navigate(routeName, params)` - go to a screen, pass params
  - `goBack` - goes one step back in history
  - `getParam(paramName, fallback)` - get a specific param with fallback

It's a limited copy of [react-navigation navigation prop](https://reactnavigation.org/docs/en/navigation-prop.html).

If you want to have a modal:

- add a `modal: true` flag the route map
- add `<ModalContainer />` from `react-router-modal` to your app layout

## Renaming the app ✏️

This boilerplate comes with ios and android bundles already named. If you want to (and you should) change the name, use the [react-native-rename](https://github.com/junedomingo/react-native-rename) lib.

## Contribution ❤️

This boilerplate was made for my own convenience and is still a work in progress. Please consider it as an experiment and think twice or even trice (is that a word?) before using it in production.

If you however would like to add something from yourself, please do make a PR! All contributions will be treated with great love!
