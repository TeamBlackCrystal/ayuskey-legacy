terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

resource "docker_image" "postgresql" {
  name = "postgres:latest"
  keep_locally = false
}

resource "docker_container" "postgresql" {
  image = docker_image.postgresql.image_id
  name = "ayuskey_dev_postgres"
  env = ["POSTGRES_USER=example-misskey-user", "POSTGRES_PASSWORD=example-misskey-pass", "POSTGRES_DB=misskey"]
  ports {
    internal = 5432
    external = 5432
  }
}

resource "docker_image" "redis" {
  name = "redis:latest"
  keep_locally = false
}

resource "docker_container" "redis" {
  image = docker_image.redis.image_id
  name = "ayuskey_dev_redis"

  ports {
    internal = 6379
    external = 6379
  }
}
