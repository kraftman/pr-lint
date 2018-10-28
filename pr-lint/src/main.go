package main
import (
     "os"
     "log"
     "fmt"
     "net/http"
)
func handler (w http.ResponseWriter, r *http.Request) {
    log.Println("Received Request: ", r.URL.Path)
    fmt.Sprintf(w, "Hello World!")
}
func main () {
    http.HandleFunc("/", handler)
   
    port := 8080
    err := http.ListenAndServe(":"+port, nil)
    if err != nil {
        log.Fatal("Could not listen: ", err)
    }
}