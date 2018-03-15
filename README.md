# retrievejs
A package for retrieving data in a nicely interpretive way. Uses [axios](https://www.npmjs.com/package/axios) under the hood.

## quick usage
<br/>
define your endpoints and create your api
```javascript
/api.js

const endpoints = {
    getMockData: { path: 'http://www.mocky.io/v2/5aaa749a3300005d202da965', method: GET },
};

export const api = createApi(endpoints);
```

## query an endpoint
```javascript
api.getMockData()
  .then(response => { /*..*/ })
  .catch(error => { /*..*/ }); 
```

## the gist
I got frustrated with constantly repeating myself during my exams so I made this package. Undoubtably there's better ones out there but this one works for me and fits to what I need.

## api

### query
A HOC to use with react components
#### parameters:
* func:
<br/> -Api endpoint 
*propName:
<br/> -The propname to pass down to your component
*requestConfig:
<br/>-axios request config
*params:
<br/>-an object of params

### createApi
A factory that returns an object containing functions that do a request from said endpoints
parameters:
* endpoints:
<br/> -Your endpoints

## todos:
* Rewrite to Typescript and include definitions.
* Write tests.
* Redux integration.
* Update documentation / api (using [TypeDoc](https://github.com/TypeStrong/typedoc))

