# docker-mongo-hydration

I'm trying to use `docker-compose` to handle some integration tests for a project that involves
several different microservices, some of which need to talk to a pre-existing MongoDB.

There's already a lot of stuff in Mongo, and they don't work well if the data and collections
they expect are missing.

So here's how I get a fresh Mongo container with a database, a user and a collection.


```yaml
version: "3.7"
services:
  the_actual_db:
    image: "mongo:4.0-xenial"
    ports:
      - "27017:27017"

  mongo:
    image: "mongo:4.0-xenial"
    depends_on:
      - the_actual_db
    volumes:
      - .:/work
    command: sh -c "sleep 2 && mongo mongodb://the_actual_db /work/hydrate.js"
``` 

So first we bring up the actual MongoDB, which should be empty.

The `mongo` service `depends_on` the database. It runs the same Docker container, but overrides
the default start-up command (usually `mongod`).

`sh -c "sleep 2 && mongo mongodb://the_actual_db /work/hydrate.js"`

Sleep for two seconds to let the database finish booting up. Then instead of running `mongod`, run the
mongo shell. Connect using the docker networking service name: `the_actual_db`. Then run the provided
script, which must be volume mounted somehow.

Note that inside the script we need to use the service name, too:

```javascript
conn = new Mongo('the_actual_db');
```

One final note: if you're doing rapid local development and you run `docker-compose up` and are
used to quitting out of it with CTRL-C, the database will hang around. So a second `docker-compose up`
will try to create the same user a second time.

You can make the hydration script more resilient or just manually `docker-compose down` in between.

Hope this helps; it took me an entire workday to piece all this together.

-Graham
