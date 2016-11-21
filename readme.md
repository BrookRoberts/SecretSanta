# Build/dev instructions

## JavaScript

Use [node](https://nodejs.org/en/) to build and install dependencies.

`cd` into `/server/client`, run:

* `npm install -g browserify`
* `npm install`
* `browserify src/app.js -o dst/bundle.js -t [ babelify --presets [ es2015 ] ]` (creates `dst/bundle.js` JS file)

(`index.html` should be picking up the `dst/bundle` to load)

## CSS

Use [sass](http://sass-lang.com/) to generate the CSS.

`cd` into `/server/client`, run:

* `sass --watch scss:css` (creates the `css/style.css` CSS file)
