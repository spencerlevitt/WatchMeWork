import * as moment from "moment";
import * as keyword_extractor from "keyword-extractor";
import * as lodash from "lodash";
var nlp = require("compromise");

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

function getTopics(string) {
  let doc = nlp(string);
  return JSON.parse(JSON.stringify(doc.topics().out("array"), null, 2));
}

function getPropers(string) {
  let doc = nlp(string);
  const people = doc.people().json();
  const places = doc.places().json();
  const organizations = doc.organizations().json();
  return { people, places, organizations };
}

export {
  getObjectValues,
  getTodaysDateLongForm,
  getKeywords,
  getTopics,
  getPropers,
};
