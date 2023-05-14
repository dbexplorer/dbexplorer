"use strict";

const Papa = require("papaparse");
const { transform } = require("@babel/core");
const jestPreset = require("babel-preset-jest");

module.exports = {
  process(fileContent) {
    let data = Papa.parse(fileContent).data;
    let fields = data.shift();
    return ({
      code: "module.exports = " + JSON.stringify({fields: fields, data: data}) + ";"
    });
  },
};