FROM golang:1.4.2
RUN apk update; apk upgrade
RUN apk add git

RUN go get -u github.com/golang/dep/cmd/dep

WORKDIR /go/src/app