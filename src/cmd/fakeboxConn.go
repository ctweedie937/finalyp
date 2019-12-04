package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

const postURL = "http://localhost:8080/fakebox/check/"

func main() {

	resp, err := http.Post(url)
}

// gets article and makes request
func GetArticle(articleURL, title, content string) *http.Response {
	url := os.Getenv("{}/{}/{}/{}")
	retrievedURL := fmt.Sprintf(postURL, articleURL, title, content)

	res, err := http.Post(retrievedURL)
	if err != nil {
		log.Fatal(err)
		println("Unable to fetch request. Error: ", err)
	}

	return res
}
