import * as moment from "moment";
import * as keyword_extractor from "keyword-extractor";

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

function getKeywords(string) {
  return keyword_extractor.extract(string, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
}

export { getObjectValues, getTodaysDateLongForm, getKeywords };
