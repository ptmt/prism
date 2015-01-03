provider is a social network's data consumer

When app starts it scanning all providers. When provider is connected
it fills server user's cache which is basically Map<date, data>.

So each provider should consist:

- /provider/index.js module with at least two methods `auth` and `getData`
