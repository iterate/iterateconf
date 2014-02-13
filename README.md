# Iterate Conference Schedule App

## Color schemes and typography

Iterate blue is used as the main color. Derivatives from this can be found on
[Colorhexa][].

The serif Georgia should be used for all main text content.
[Droid Serif][] is used for titles.


[Colorhexa]: http://www.colorhexa.com/006fac
[Droid Serif]: http://www.google.com/fonts/specimen/Droid+Serif


## Dependencies and developing

Client side, this project is using [VanillaJS][], with some transpiling to get
the latest and greatest from ES6.

[Grunt][] is used to build the app and has alot of other utilities built in as
well. It can be installed by doing `npm install -g grunt-cli`.

Run `npm install` in the project root to download the rest of the needed
dependencies.

For CSS, the [Foundation framework][] is used, which included the use of
[Sass][] and [Compass][]. All JavaScript plugins are removed, though.


[VanillaJS]: http://vanilla-js.com/
[Grunt]: http://gruntjs.com/
[Foundation framework]: http://foundation.zurb.com/
[Sass]: http://sass-lang.com/
[Compass]: http://compass-style.org/

## Deploy

```shell
$ git remote add iterate dokku@app.iterate.no:konferanse
$ git push iterate master
```

## Updating the conference program

The program is scraped from a Google Spreadsheet using this command:

    npm run-script update-schedule

See `bin/update-schedule.js` for how that works.


## TODO / Ideas

* Improve sidebar
* Use ES6 instead of RJS
* Short program at the top
* Better visualization of workshops, too much repeating now
  - When choosing a workshop, "swipe" the rest of the track as well?
* Handle routing on initial load, jump to current time
