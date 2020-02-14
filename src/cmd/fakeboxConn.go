package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

const postURL = "http://localhost:8080/fakebox/check/"

type ArticleData struct {
	URL     string `json:"url"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func main() {
	articleData := ArticleData{
		URL:     "https://www.bbc.co.uk/news/world-europe-50653597",
		Title:   "Nato summit: Leaders meet for 70th anniversary amid rows",
		Content: "Nato leaders are meeting near London...",
	}
	jsonStr, err := json.Marshal(&articleData)

	req, err := http.NewRequest("POST", postURL, bytes.NewBuffer(jsonStr))
	req.Header.Set("X-Custom-Header", "myvalue")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
	fmt.Println("Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Body:", string(body))
	getTitle(articleData.URL)
}

func getTitle(response string) {
	// converts byte into string
	articleContent := string(response)

	// searches for title index
	titleStartIndex := strings.Index(articleContent, "<h1>")

	// if no titles found
	if titleStartIndex == -1 {
		fmt.Println("No title element found")
		os.Exit(0)
	}

	// offset by 7 characters (aka the amount of characters in <title>)
	titleStartIndex += 7

	// searches for title closing tag
	titleEndIndex := strings.Index(articleContent, "</h1>")
	if titleEndIndex == -1 {
		fmt.Println("No closing tag for title found")
		os.Exit(0)
	}

	pageTitle := []byte(articleContent[titleStartIndex:titleEndIndex])
	fmt.Println("Title: %s", pageTitle)
}
