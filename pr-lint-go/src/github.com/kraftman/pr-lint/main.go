package main

import (
	"fmt"
	"net/http"
	"log"
	"io/ioutil"
	"github.com/antonholmquist/jason"
)

func getPRs() {
	url := "https://api.github.com/repos/kraftman/create-node-app/pulls"
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	v, _ := jason.NewValueFromBytes([]byte(body))
	friends, _ := v.Array()
	for _, a := range friends {
		friendObject, _ := a.Object()
		title, _ := friendObject.GetString("title")
		body, _ := friendObject.GetString("body")
		log.Println("string value: ", title, body)
	}
}

func main() {
	a := test();
	fmt.Printf("hello, world\n" + a + "\n")
	getPRs()
}
// get the repo we care about
// load all its PRs

// for each pr
// load all reviews
// check link header for pagination
// https://developer.github.com/v3/guides/traversing-with-pagination/
// add the users if they dont exist
// add the pr if it doesnt exist
// add to sorted set
// store under date opened or date closed? - opened

//storage
// hset: user:repo:pr
// user: userID

//sorted set:
// org:repo:pr
// user:repo // so we can query by username or username:repo easily
