const CracoAlias = require("craco-alias");
const CracoAntDesignPlugin = require("craco-antd");

const fs = require("fs");
const path = require("path");

const rawVar = fs.readFileSync(
  path.join(__dirname, "src/styles/var.scss"),
  "utf8"
);
const vars = rawVar
  .split("\r\n")
  .filter((line) => line.length > 0)
  .map((line) => line.split(": "))
  .map(([key, value]) => ({
    key: key.replace("$", "@"),
    value: value.replace(";", ""),
  }))
  .reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {});

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./",
        /* tsConfigPath should point to the file where "baseUrl" and "paths" 
           are specified*/
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: vars,
      },
    },
  ],
};
