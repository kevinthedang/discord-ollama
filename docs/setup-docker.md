## Docker Setup
* Follow this guide to setup [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
    * If on Windows, download [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) to get the docker engine.
* Please also install [Docker Compose](https://docs.docker.com/compose/install/linux/) for easy running. If not, there are [scripts](#manual-run-with-docker) to set everything up.

## To Run (with Docker and Docker Compose)
* You will need a model in the container for this to work properly, on Docker Desktop go to the `Containers` tab, select the `ollama` container, and select `Exec` to run as root on your container. Now, run `ollama pull [model name]` to get your model.
    * For Linux Servers, you need another shell to pull the model, or if you run `docker compose build && docker compose up -d`, then it will run in the background to keep your shell. Run `docker exec -it ollama bash` to get into the container and run the samme pull command above.
* Otherwise, there is no need to install any npm packages for this, you just need to run `npm run start` to pull the containers and spin them up.
* For cleaning up on Linux (or Windows), run the following commands:
    * `docker compose stop`
    * `docker compose rm`
    * `docker ps` to check if containers have been removed.
* You can also use `npm run clean` to clean up the containers and remove the network to address a possible `Address already in use` problem.

## Manual Run (with Docker)
* Run the following commands:
    * `npm run docker:build`
    * `npm run docker:ollama`
    * `npm run docker:client`
    * `docker ps` to see if the containers are there!
        * Names should be **discord** and **ollama**.
    * You can also just run `npm run docker:start` now for the above commands.
* Clean-up:
    * `docker ps` for the conatiner id's. Use `-a` flag as necessary.
    * `docker rm -f discord && docker rm -f ollama` to remove the containers.
        * `docker rm -f CONTAINER_ID` do for both containers if naming issues arise.
    * `docker network rm ollama-net` removes the network.
        * `docker network prune` will also work so long as the network is unused.
* Remove Image:
    * If you need to remove the image run `docker image rm IMAGE_ID`. You can get the image id by running `docker images`.