## Docker Setup
* Follow this guide to setup [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
    * If on Windows, download [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) to get the docker engine.
* Please also install [Docker Compose](https://docs.docker.com/compose/install/linux/) for easy running. If not, there are [scripts](#manual-run-with-docker) to set everything up.

> [!IMPORTANT]  
> Currently, it seems like wsl does not like Nvidia Container Toolkit. It will work initially then reset it for some odd reason. For now, it is advised to use an actually Linux machine to run using Docker. If you do not care about utilizing your GPU or don't even have a Nvidia GPU then disregard this.

## Nvidia Container Toolkit Setup
### Installation with Apt
* Instructions can be found [here](https://github.com/kevinthedang/discord-ollama/issues/23) in **Steps to reproduce** or below:
  * Step 1. Configure the production repository on machine:
```sh
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```
  * Step 2. Update the packages list from the repository:
```sh
sudo apt-get update
```
  * Step 3. Install the Nvidia Container Toolkit:
```sh
sudo apt-get install -y nvidia-container-toolkit
```

### Configurating with Docker
Step 1.Configure the container runtime by using the `nvidia-ctk` command:
```sh
sudo nvidia-ctk runtime configure --runtime=docker
```

The `nvidia-ctk` command modifies the `/etc/docker/daemon.json` file on the host. The file is updated so that Docker can use the NVIDIA Container Runtime.

Step 2. Restart the Docker daemon:
```sh
sudo systemctl restart docker
```

### References for setup
* Guide to installing [Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
* [GitHub repository](https://github.com/NVIDIA/nvidia-container-toolkit?tab=readme-ov-file) for Nvidia Container Toolkit

## To Run (with Docker and Docker Compose)
* With the inclusion of subnets in the `docker-compose.yml`, you will need to set the `SUBNET_ADDRESS`, `OLLAMA_IP`, `OLLAMA_PORT`, and `DISCORD_IP`. Here are some default values if you don't care:
    * `SUBNET_ADDRESS = 172.18.0.0`
    * `OLLAMA_IP = 172.18.0.2`
    * `OLLAMA_PORT = 11434`
    * `DISCORD_IP = 172.18.0.3`
    * Don't understand any of this? watch a Networking video to understand subnetting.
    * You also need all environment variables shown in [`.env.sample`](../.env.sample)
* Otherwise, there is no need to install any npm packages for this, you just need to run `npm run start` to pull the containers and spin them up.
* For cleaning up on Linux (or Windows), run the following commands:
    * `docker compose stop`
    * `docker compose rm`
    * `docker ps` to check if containers have been removed.
    * This may not work if the nvidia installation was done incorrectly. If this is the case, please utilize the [Manual "Clean-up"](#manual-run-with-docker) shown below.
* You can also use `npm run clean` to clean up the containers and remove the network to address a possible `Address already in use` problem. This script does not have to end without error to work.

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