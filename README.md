-------------------------------------------------------------------------------------------------------------------
Final year project - Claudia Tweedie
--------------------------------------------------------------------------------

This software detects fake news and gives it a "fakeness" rating. I developed this project for my Final Year Project for university.

## Prerequisites
1. Get Fakebox key from https://machinebox.io/
- Sign up for a Veritone Account
- Navigate to the Dashboard -> Machine box -> Your key -> Reveal your key
- Copy the key
2. In Terminal (or equivalent), execute this command: export MB_KEY=...
Replace "..." with the key received from Machinebox.

## Installation
1. Download the .zip file and save it onto the computer
2. Unzip the file
3. Navigate to the directory of the unzipped file
4. Run: make
5. Navigate to the browser and set the URL to "http://localhost:3000/" (this might take a few moments to load)
6. Use the software

## Testing
### Run all tests
- Run: ./node_modules/.bin/nightwatch src/test/tests/tests.js --config ./nightwatch.conf.js --env chrome

### Run individual tests
- Run: ./node_modules/.bin/nightwatch src/test/tests/tests.js --config ./nightwatch.conf.js --env chrome --testcase "TESTNAMEHERE"
- Substitute "TESTNAMEHERE" with the name of the test that you want to run–include quotes

