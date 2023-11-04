# Apimo.js

Apimo.js is a Node.js module for interacting with the Apimo API.

## Usage
    
```javascript
var Apimo = require('apimo.js/dist');

const api = new Apimo(
    '<BRIDGE_ID>',
    '<API_TOKEN>',
    {
        debug: true,
        cultures: [
            'fr_FR',
            'en_GB',
        ],
        updateIntervals: {
            properties: 1000 * 60 * 5, // 5 minutes
            catalogs: 1000 * 60 * 60 * 24, // 24 hours
        }
    }
);
```

The `BRIDGE_ID` and `API_TOKEN` can be asked on the support page of Apimo.

## API
The API endpoints are described on the [Apimo API documentation](https://apimo.net/en/api/webservice/).

## Wrapper
The wrapper is a set of methods that will help you to interact with the API.
It can cache requests in order to avoid reaching the API rate limit, which are pretty low (1000 requests per day).
The data can be set to be updated automatically, given a certain interval.

## Methods

### `get`
Helper method to get a property from the API.

```javascript
api.get(['properties', 123]).then(property => {
    console.log(property); // == Property(id: 123, ...)
});
```


### `getProperties`
Get all properties from the API.

```javascript
api.getProperties().then(properties => {
    console.log(properties); // [Property(...), Property(...), ...]
});
```
A `Property` is the data of a property, as stored in the Apimo API, it is described in the [Apimo API documentation](https://apimo.net/en/api/webservice/?child=agencies/properties#get-agencies/propertiesagencies-{agency_id}-properties).

### `getAgencies`
Returns the agencies linked to the bridge.

```javascript
api.getAgencies().then(agencies => {
    console.log(agencies); // [Agency(...), Agency(...), ...]
});
```
An `Agency` is the data of an agency, as stored in the Apimo API, it is described in the [Apimo API documentation](https://apimo.net/en/api/webservice/?child=agencies#get-agenciesagencies).

### `convertDate`
Converts a Apimo date to a `Date` object.

```javascript
api.convertDate('2018-01-01').then(date => {
    console.log(date); // == Date(2018, 0, 1)
});
```

## Installation

```bash
npm install github:Neikow/apimo.js
```