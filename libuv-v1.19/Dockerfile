FROM ubuntu:16.04
RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g mocha

RUN apt install -y git gyp automake libtool make
RUN cd /root && git clone https://github.com/libuv/libuv.git
RUN cd /root/libuv && sh autogen.sh
RUN cd /root/libuv && ./configure
RUN cd /root/libuv && make
RUN cd /root/libuv && make install

ADD codes /app/codes