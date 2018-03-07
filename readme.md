# hogwarts templates import tool

# Usage, for docker-compose
```sh
    # REPLACE 'node-v8' with template supposed to import
    docker run -it --name importer --rm -v $(pwd):/app --network=server_backend -w /app node node import.js -t node-v8
```

# Usage, for docker swarm
```sh
    # REPLACE 'node-v8' with template-folder-name supposed to import
    docker service create --name importer --mount type=bind,src=$(pwd),target=/app --network=hogwarts_backend --restart-condition=none -w /app node node import.js -t node-v8

    docker service rm importer
```