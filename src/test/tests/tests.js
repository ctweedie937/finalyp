module.exports = {
    after(client) {
        client.end();
    },

    loginToFND(client) {
        client
            .url("http://localhost:3000/")
            .waitForElementVisible("body", 1000)
            .waitForElementVisible("div[name='mainTitle']")
            .click("a[href='/login']")
            .waitForElementVisible("h1[class='ui header']", 1000)
            .setValue("input[name='email']", "hej@123.com")
            .pause(100)
            .setValue("input[name='password']", "password")
            .pause(100)
            .click("button[type='submit']")
            .waitForElementVisible("div[name='prevArticles']")
    },

    analyseArticle(client) {
        client
            .url("http://localhost:3000/")
            .click("a[href='/analyse']")
            .waitForElementVisible("input[placeholder='Title']", 100000)
            .setValue("input[placeholder='Title']", "Coronavirus: Weekly jobless claims hit 5.2 million")
            .waitForElementVisible("input[placeholder='Content']")
            .setValue(
                "input[placeholder='Content']", "Another 5.2 million Americans registered for unemployment benefits last week as businesses remain shut amid the coronavirus lockdown. The new Department of Labor filings bring the number of jobless claims over the last four weeks to more than 20 million. That amounts to roughly as many jobs as employers had added over the previous decade. The economic crisis comes as the number of US virus cases exceeds 629,000. The surging joblessness is a stark reversal for the world's biggest economy where the unemployment rate had been hovering around 3.5%. Economists now expect that rate to have hit double digits. While the 5.2 million new claims in the week ended 11 April were down from 6.6 million the previous week, the numbers still eclipse prior records. Many economists warn that elevated numbers will linger, with Goldman Sachs researchers expecting some 37 million claims by the end of May.")
            .waitForElementVisible("input[placeholder='URL']")
            .setValue("input[placeholder='URL']", "https://www.bbc.co.uk/news/business-52312367")
            .click("button[name='analyseButton']")
            .pause(100)
            .waitForElementVisible("h5[class='ui center aligned header']")
    },

    saveArticle(client) {
        this.loginToFND(client)
        this.analyseArticle(client)
        client
            .assert.urlEquals("http://localhost:3000/analyse")
            .click("button[name='saveButton']")
            .click("a[href='/login']")
            
    },

    testAllMenuItems(client) {
        client
            .url("http://localhost:3000/")
            .click("a[href='/analyse']")
            .assert.urlEquals("http://localhost:3000/analyse")
            .click("a[href='/login']")
            .assert.urlEquals("http://localhost:3000/login")
            .click("a[href='/help']")
            .assert.urlEquals("http://localhost:3000/help")
            .click("a[href='/']")
            .assert.urlEquals("http://localhost:3000/")
    }
}