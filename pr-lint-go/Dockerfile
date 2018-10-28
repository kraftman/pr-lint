FROM golang:1.11.1
RUN apt-get update && apt-get install git

RUN go get -u github.com/golang/dep/cmd/dep

WORKDIR /go/src/app