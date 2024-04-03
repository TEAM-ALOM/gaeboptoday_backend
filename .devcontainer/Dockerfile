FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /root

RUN apt update \
  && apt upgrade -y \
  && apt install -y \
    ca-certificates dnsutils iproute2 iputils-ping locales lsb-release net-tools sudo tzdata \
    curl git gnupg htop screen unzip vim wget zsh libssl-dev

RUN mkdir -p /workspace/.pnpm-store
RUN chown -R 1001:1001 /workspace/.pnpm-store

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN sudo npm install -g pnpm
RUN sudo corepack enable
RUN sudo corepack enable npm

RUN sudo npm install -g typescript

RUN sudo npm install -g @nestjs/cli