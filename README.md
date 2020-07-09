# scratchpad

## Buy Black

### Docker

#### Run a simple NGINX instance with a local folder mounted

In the following example, we'll mount the current directory (`buy-black`) as `/home/learn-python` in a Docker container running the `latest` version of Python from DockerHub.

`docker run -p 9000:8080 --mount type=bind,source="$(pwd)",target=/app bitnami/nginx:latest`
`docker run -it --mount type=bind,source="$(pwd)",target=/app --rm python bash`

### Copyleft

https://copyleft.org/guide/comprehensive-gpl-guidech3.html
