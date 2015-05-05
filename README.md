[![Build Status](https://travis-ci.org/unknownexception/prism.svg)](https://travis-ci.org/unknownexception/prism)

![prism project](https://raw.githubusercontent.com/unknownexception/prism/master/app/images/prism.jpg)

# TLDR

PRISM is sort of a TodoMVC sandbox but a slightly more complex. Current version is written in typed ES6 using React and Node.js.

# Privacy

There is no databases yet. All data obtained from third-party providers stored in memory only.

# Motivation

I love checkins even more than Foursquare do. Blog post coming.

# Self-hosted version

To build and run PRISM inside docker container (ensure you have Docker daemon running):
```
make
make run
```
See [this blog]() post about hosting it into your cloud.

# Buzzwords

Current stack:

- React.js + React-hot-loader + Webpack for *view*;
- Alt as a Flux implementation for *data flow*;
- Material Design (Material UI) as a *styles*;
- Subset of React ES6 for server and client (classes, lambdas) as a *language*;
- `connect` and `connect-rest` for server-side *API*;
- Facebook Flow for *static type checking*;
- Gulp for *build pipeline*;
- Leaflet + toner for *maps*;
- Bluebird for *promises*;
- Jest&Mocha for *tests*;

# Roadmap

- Immutable.js
- Download snapshot via `alt.takeSnapshot()` (on Dropbox, for example)

# Changelog

# License

MIT License
