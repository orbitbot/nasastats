# nasastats
> Explore the NASA NEO API

API information: https://api.nasa.gov/api.html#neows-feed

<br>

### Demo

- [Live demo on Github Pages: https://orbitbot.github.io/nasastats](https://orbitbot.github.io/nasastats)

<br>

### This repository

```
    assets/   <-- static assets for web client
    config/   <-- build/development scripts
    docs/     <-- build folder, automatically generated
    src/      <-- web client source
```

<br>

### Usage

Check out the [Demo](https://orbitbot.github.io/nasastats) or install or run the project locally. Select a date range and press "Load dataset" to fetch data from the API. Once the request has completed, select one to view the retreived data and some calculated information based on the current set. Downloaded data will be stored in localstorage. If you exhaust your request quota, you can request an API key that can be entered on the webpage to be able to load more data by visiting https://api.nasa.gov/index.html#apply-for-an-api-key .

<br>

### Development setup

Install NPM dependencies with

```sh
$ npm install
```

After installing the dependencies, you can run a HMR-enabled dev server with

```sh
$ npm run dev
```

Make a final build with

```sh
$ npm run build
```

<br>

### License

MIT your heart out
