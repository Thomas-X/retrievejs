# retrievejs
A package for retrieving data in a nicely interpretive way.

## quick usage
define your endpoints and create your api
in `/api.js` per example
```js
const endpoints = {
    getMockData: { path: 'http://www.mocky.io/v2/5aaa749a3300005d202da965', method: GET },
};

export const api = createApi(endpoints);sc
```

## query an endpoint

```js
api.getMockData()
  .then(response => { /*..*/ })
  .catch(error => { /*..*/ }); 
```

## the gist
I got frustrated with constantly repeating myself during my exams so I made this package. Undoubtably there's better ones out there but this one works for me and fits to what I need.

### [API](https://thomas-x.github.io/retrievejs/)
