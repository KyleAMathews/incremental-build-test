# createPages benchmark

Stress tests creating lots of tiny pages.

Defaults to building a site with 5k pages. Set the `NUM_PAGES2` environment variable to change that e.g. `NUM_PAGES2=25000 gatsby build`

# Running the benchmark

First, install node modules required by package.json. This is needed only one time. Then run the build

```shell
yarn
npm run build
```

Alternatively;

```shell
NUM_PAGES2=2000 yarn bench
```
