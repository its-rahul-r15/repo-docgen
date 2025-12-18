#!/usr/bin/env node
import { run } from "../index.js";

const args = process.argv.slice(2);

const options = {
  output: "",
  overwrite: false
};

args.forEach(arg => {
  if (arg.startsWith("--output=")) {
    options.output = arg.split("=")[1];
  }
  if (arg === "--overwrite") {
    options.overwrite = true;
  }
});

run(options);
