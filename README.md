# zdb-console-web

## Build Setup

```bash
# run json-server
$ npm install -g json-server
$ yarn json-table
$ yarn json-detail

# install dependencies
$ npm install --save package.json

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# build
$ docker build -t registry.au-syd.bluemix.net/cloudzdb/zdb-console-web:pilot .
$ docker image push registry.au-syd.bluemix.net/cloudzdb/zdb-console-web:pilot


# apply deployment
$ kubectl apply -f zdb-console-web.yaml
$ kubectl -n zdb-system scale deploy zdb-console-web --replicas 0
$ kubectl -n zdb-system scale deploy zdb-console-web --replicas 1

# k8s svc port forwarding
$ kubectl port-forward -n zdb-system svc/zdb-console-web-service 8080
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
