import * as moment from "moment";

function getObjectValues() {
  let options = Object.assign(
    {},
    { source_url: null, header_row: 1 },
    { content: "Hello, World" }
  );

  return JSON.stringify(options);
}

function getTodaysDateLongForm() {
  return moment().format("LLLL");
}

export { getObjectValues, getTodaysDateLongForm };
