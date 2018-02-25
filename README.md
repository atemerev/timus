# Timus: A dumb time series storage server

Timus is an exceedingly simplistic time series data storage server. Currently it stores all
data using sqlite3 ("main.db" database file is created in the working directory immediately 
after launch).

Presently there is no request validation/sanitization, no error handling, no nothing.

# Installation

Well, clone the repository, run `node install`, then `node server.js`. Whatever, it works,
but it definitely not production-ready yet.

# Storing data

To store a time series event:

`POST /put/:tag`: store arbitrary JSON data, tagged by a 'tag' parameter.

returns:

`{"time": 1519522799951}` (an assigned timestamp in epoch milliseconds)

# Retrieving data

To get your content stored at specific time interval:

`GET /get/:tag/:from/:to` (:from and :to are in epoch milliseconds)

returns:

a multiline JSON looking like this:
```
{"time":1519522799951,"content":{"some":"data"}} 
{"time":1519522801122,"content":{"also":"data"}}
```
(JSON content is not escaped)  

## Todo

### Version 0.2:

- parameters validation
- error handling

### Version 0.3

- pagination

### Version 0.4 

- performance tests
- if can't handle e.g. 10 GB data / 50 tags, add PostgreSQL / TimescaleDB support

### Version 0.5

- primitive aggregator functions (at least exists/count), passed to SQL
- dockerfile

### Version 0.6

- Javascript aggregator functions

### Version 0.7

- Websocket data ingestion

### Version 0.8

- Websocket subscriptions for tag

### Version 1.0

- Webscale backend (Cassandra/Kafka), DCOS/kubernetes support, establishing new standard
for time series storage, TechCrunch, Y Combinator, series A, ???, profit!