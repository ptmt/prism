![prism project](https://raw.githubusercontent.com/unknownexception/prism/master/app/images/prism.jpg)

# TLDR

PRISM is like a TodoMVC sandbox but a slightly more complex app which operates with data in-memory only
to decrease privacy issues. Current version is written in typed ES6 for React and Node.js.

# Privacy

There is no databases yet. All data obtained from third-party providers
stored in memory-only.

# Motivation

I love checkins, though it seems Foursquare doesn't anymore.

# Stack

- React.js + React-hot-loader + Webpack for *view*;
- Alt as a Flux implementation for *data flow*;
- Material Design (Material UI) for *style*;
- Subset of React ES6 for server and client (classes, lambdas) as a *language*;
- `connect` and `connect-rest` for server-side *API*;
- Facebook Flow for *static type checking*;
- Gulp for *build pipeline*;
- Leaflet + toner for *maps*;
- Bluebird for *promises*;

# Roadmap

- Immutable.js
- Download snapshot via `alt.takeSnapshot()` (on Dropbox, for example)

# Changelog

# License

MIT License
