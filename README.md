# Depot-Front

TODO:
1. check `tsc` command

## Local run via NodeJS
1. Create `.env` file:
    ```
    VITE_BASE_URL=http://localhost:5500/  # link to backend instance
    ```
1. Install dependencies:
    ```bash
    npm i
    ```
1. Run project:
    ```bash
    npm run dev
    ```
1. Go to [http://localhost:44563/](http://localhost:44563/)

## Docker
### Generate config file for Docker Swarm
```bash
docker compose --file deploy/compose.yaml --file deploy/compose.prod.yaml config
```

### Build testing image
- via `docker build`
    ```bash
    docker build --tag test-depot-front --file deploy/Dockerfile .
    ```
- via `docker compose`
    ```bash
    docker compose --file deploy/compose.local.yaml build
    ```

### Run testing image
- via `docker run`
    ```bash
    docker run --publish 44563:44563 --name test-depot-front --rm --detach test-depot-front
    ```
- via `docker compose`
    ```bash
    docker compose --file deploy/compose.local.yaml up --detach
    ```

### Stop testing image
- via `docker stop`
    ```bash
    docker stop test-depot-front
    ```
- via `docker compose`
    ```bash
    docker compose --file deploy/compose.local.yaml stop
    ```
