# Iterate Conference Schedule App

## Color schemes and typography
Iterate blue is used as the main color. Derivatives from this can be found on
[Colorhexa][].

The [Ubuntu][] face is used for both titles and paragraph text.

[Colorhexa]: http://www.colorhexa.com/006fac
[Ubuntu]: http://www.google.com/fonts/specimen/Ubuntu


## Dependencies and developing
Client side, this project is using [VanillaJS][].
You can use the latest and greatest from ES6, including modules, thanks to
transpiling.

Enter [Grunt][]. It is used to build the app and has alot of other utilities
built in as well. It has to be installed globally using
`npm install -g grunt-cli`.

Run `npm install` in the project root to download the rest of the needed
dependencies.

For CSS, the grid and reset are borrowed from the [Foundation 5 framework][].
Other than that -- you're on your own.

[VanillaJS]: http://vanilla-js.com/
[Grunt]: http://gruntjs.com/
[Foundation framework]: http://foundation.zurb.com/


## Deploy
The [nginx buildpack][] is included as a way of deployment to
[app.iterate.no][]:

```shell
$ git remote add iterate dokku@app.iterate.no:konferanse
$ git push iterate master
```

[Nginx buildpack]: https://github.com/rhy-jot/buildpack-nginx
[app.iterate.no]: https://app.iterate.no/


## Updating the conference program
The program is scraped from a Google Spreadsheet using this command:

    npm run-script update-schedule

The result is injected into `app/index.html`.
See `bin/update-schedule.js` on how that works.


## TODO / Ideas
Nothing here, all done? :o)


## Authors
* [Pål Ruud](https://github.com/ruudud) / [@ruudud](https://twitter.com/ruudud)


## License
**Iterateconf** is released under the
[MIT](https://github.com/iterate/iterateconf/blob/master/LICENSE-MIT) license.
