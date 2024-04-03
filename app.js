const fs = require("fs");
const csv = require("csv-parser");
const tokenizeArray = require("./tokenizeArray");

const csvFilePath = "./Optmzr_Testing_Sample - Data.csv";

const stream = fs.createReadStream(csvFilePath);

let csvHolder = [];
let finalArr = {};
// In this chunk of code, I am creating a readable stream out of the csv file,
// reading it, parsing it as a csv. Then I populate my csvHolder array with
// the contents of this newly-read csv file, such that each row is represented
// as an object, where the first column serves as the key, second as value
// line number 20 to 25 handle the initial case (as csv-parser was denoting the
// first row's both columns as keys for all values in the document)
stream
  .pipe(csv())
  .on("data", (row) => {
    if (csvHolder.length === 0) {
      let keys = Object.keys(row);
      let [key, val] = keys;
      let tempObj = { [key.trim()]: val.trim() };
      csvHolder.push(tempObj);
    }
    let vals = Object.values(row);
    let [key, val] = vals;
    let tempObj = { [key.trim()]: val.trim() };
    csvHolder.push(tempObj);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");

    // now I have the csv file retrieved and stored in csvHolder array.
    // Here I handle the specific case for First Record (multiple values/key)

    for (let alphaKey in csvHolder[0]) {
      let alphaArray = [];
      let alphaValue = csvHolder[0][alphaKey];
      let splitAlphaValue = alphaValue.split("\n");
      for (let keyValPair of splitAlphaValue) {
        let keyValArray = keyValPair.split(":");
        let valArray = keyValArray[1].split(",");
        for (let value of valArray) {
          let tempObj = {
            [keyValArray[0].trim()]: value.trim(),
          };
          alphaArray.push(tempObj);
        }
      }
      //   let tempObj = {
      finalArr[alphaKey.trim()] = alphaArray;
      //   };
      //   finalArr.push(tempObj);
    }

    // here I handle remaining records of csvHolder, make objects out of them
    // and push them to finalArr

    for (let i = 1; i < csvHolder.length; i++) {
      let alphaKey = Object.keys(csvHolder[i])[0];
      let alphaArray = [];
      let alphaValue = csvHolder[i][alphaKey];
      let splitAlphaValue = alphaValue.split("\n");
      for (let keyValPair of splitAlphaValue) {
        let keyValArray = keyValPair.split(":");
        let tempObj = {
          [keyValArray[0].trim()]: keyValArray[1].trim(),
        };
        alphaArray.push(tempObj);
      }
      //   let tempObj = {
      finalArr[alphaKey.trim()] = alphaArray;
      //   };
      //   finalArr.push(tempObj);
    }

    let combinations = tokenizeArray(finalArr);
    const csvString = combinations.map((row) => row.join(",")).join("\n");
    fs.writeFile("output.csv", csvString, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("CSV file successfully created");
      }
    });
  });
