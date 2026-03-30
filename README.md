# thaytung16thang3

## Run app

- MongoDB: make sure local MongoDB is running as replica set `rs0` on `mongodb://127.0.0.1:27017/NNPTUD-S2?replicaSet=rs0`
- App default port: `3001`
- Start app: `npm start`

## MongoDB replica set on Windows service

- MongoDB config file: `C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg`
- Add this block:

```yml
replication:
  replSetName: rs0
```

- Restart service as Administrator: `Restart-Service MongoDB`
- Initialize replica set once: `npm run mongo:rs:init`
- Check status: `npm run mongo:rs:status`

## Run Redis

- Default Redis URL used by app: `redis://127.0.0.1:6379`

Redis is used to cache the `GET /products` response. If Redis is not running, the app still works and falls back to MongoDB only.
