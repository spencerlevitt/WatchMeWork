/**
 * Runs when the document is opened.
 */
 function onOpen() {
  DocumentApp.getUi()
    .createMenu("Inspector")
    .addItem("Show sidebar", "showSidebar")
    .addToUi();
  Logger.log(AppLib.getTodaysDateLongForm());
}

function testKeywordExtraction() {
  /*Logger.log(
    AppLib.getKeywords(
      "President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."
    )
  );*/
  var body = DocumentApp.getActiveDocument().getBody();
  Logger.log("BODY: ");
  Logger.log(body);
  var text = DocumentApp.getActiveDocument().getText();
  Logger.log("TEXT: ");
  Logger.log(text);
}

function testGetTopics() {
  Logger.log(
    AppLib.getTopics(
      "Elon Reeve Musk FRS (/ˈiːlɒn/ EE-lon; born June 28, 1971) is a business magnate, industrial designer, and engineer.[3] He is the founder, CEO, CTO, and chief designer of SpaceX; early investor,[b] CEO, and product architect of Tesla, Inc.; founder of The Boring Company; co-founder of Neuralink; and co-founder and initial co-chairman of OpenAI. A centibillionaire, Musk is one of the richest people in the world. Musk was born to a Canadian mother and South African father and raised in Pretoria, South Africa. He briefly attended the University of Pretoria before moving to Canada aged 17 to attend Queen's University. He transferred to the University of Pennsylvania two years later, where he received dual bachelor's degrees in economics and physics. He moved to California in 1995 to attend Stanford University but decided instead to pursue a business career, co-founding web software company Zip2 with his brother Kimbal. The start-up was acquired by Compaq for $307 million in 1999. Musk co-founded online bank X.com that same year, which merged with Confinity in 2000 to form the company PayPal and was subsequently bought by eBay in 2002 for $1.5 billion. In 2002, Musk founded SpaceX, an aerospace manufacturer and space transport services company, of which he is CEO, CTO, and lead designer. In 2004, he joined electric vehicle manufacturer Tesla Motors, Inc. (now Tesla, Inc.) as chairman and product architect, becoming its CEO in 2008. In 2006, he helped create SolarCity, a solar energy services company and current Tesla subsidiary. In 2015, he co-founded OpenAI, a nonprofit research company that promotes friendly artificial intelligence. In 2016, he co-founded Neuralink, a neurotechnology company focused on developing brain–computer interfaces, and founded The Boring Company, a tunnel construction company. Musk has also proposed the Hyperloop, a high-speed vactrain transportation system."
    )
  );
}

/**
 * Show the sidebar.
 */
function showSidebar() {
  DocumentApp.getUi().showSidebar(
    HtmlService.createTemplateFromFile("sidebar")
      .evaluate()
      .setTitle("Watch Me Work")
      .setWidth(350)
  );
}

/**
 * Returns the contents of an HTML file.
 * @param {string} file The name of the file to retrieve.
 * @return {string} The content of the file.
 */
function include(file) {
  return HtmlService.createTemplateFromFile(sidebar.html)
    .evaluate()
    .getContent();
}

/**
 * Gets the current cursor and selector information for the document.
 * @return {Object} The infomration.
 */
function getDocumentInfo() {
  var document = DocumentApp.getActiveDocument();
  var cursor = document.getCursor();
  var selection = document.getSelection();
  var result = {};
  if (cursor) {
    result.cursor = {
      element: getElementInfo(cursor.getElement()),
      offset: cursor.getOffset(),
      surroundingText: cursor.getSurroundingText().getText(),
      surroundingTextOffset: cursor.getSurroundingTextOffset(),
    };
  }
  if (selection) {
    result.selection = {
      selectedElements: selection
        .getSelectedElements()
        .map(function (selectedElement) {
          return {
            element: getElementInfo(selectedElement.getElement()),
            partial: selectedElement.isPartial(),
            startOffset: selectedElement.getStartOffset(),
            endOffsetInclusive: selectedElement.getEndOffsetInclusive(),
          };
        }),
    };
  }
  return result;
}

/**
 * Gets information about a given element.
 * @param {Element} element The element.
 * @return {Object} The information.
 */
function getElementInfo(element) {
  return {
    type: String(element.getType()),
  };
}

/**
 * Retrieves research output.
 *
 * @return {Object} Object containing the output of the research.
 */
function getResearch(searchTerm) {
  Logger.log(getDocumentInfo());

  var total_doc = getDocumentInfo();
  var search_input = "";
  var side_bar_content = [];
  var documentProperties = PropertiesService.getDocumentProperties();

  if (searchTerm) {
    search_input = searchTerm;
  } else if (total_doc.selection) {
    Logger.log("element is selected");
    var start = total_doc.selection.selectedElements[0].startOffset;
    var end = total_doc.selection.selectedElements[0].endOffsetInclusive;

    total_doc_as_array = DocumentApp.getActiveDocument().getText().split("");
    search_input = total_doc_as_array.slice(start, end + 1).join("");
  } else {
    Logger.log("no element is selected, look at all text.");
    var allText = DocumentApp.getActiveDocument().getText();
    const keywords = AppLib.getTopics(allText);
    Logger.log("----ALL KEYWORDS IDENTIFIED: " + keywords);
    Logger.log("KEYWORDS[0]: " + keywords[0]);
    search_input = keywords[0];
    const keywordData = keywords.map((item) => {
      return { name: item, articles: [] };
    });
    documentProperties.setProperty("KEYWORD_ARR", JSON.stringify(keywordData));
  }

  Logger.log(search_input);

  let url = `https://newsapi.org/v2/everything?q=${search_input}&from=2021-02-21&to=2021-02-21&sortBy=popularity&apiKey=8738aed08efc43b4869f63671fdcfdb3&language=en`;

  Logger.log(url);

  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);

  if (data.totalResults == 0) {
    // side_bar_content = ["No data available :( ... back to work ", ""];
    // Logger.log(side_bar_content);
    let first_three = [];
    while (first_three.length < 3) {
      first_three.push({
        title: "No data available :( ... back to work",
        url: ""
    });
    }
    // return {
    //   output: side_bar_content,
    // };
    return {
      output: first_three,
    };
  }

  var first_article = data.articles[0].description;
  var first_article_URL = data.articles[0].url;
  let first_three = [];

  for (let i = 0; i < data.totalResults && i < 3; i++) {
    first_three.push({
      title: data.articles[i].title,
      url: data.articles[i].url,
    });
  }

  const savedKeywordArr = JSON.parse(
    documentProperties.getProperty("KEYWORD_ARR")
  );
  savedKeywordArr[0].articles = first_three;
  documentProperties.setProperty(
    "KEYWORD_ARR",
    JSON.stringify(savedKeywordArr)
  );

  while (first_three.length < 3) {
    first_three.push({
      title: "No data available :( ... back to work",
      url: ""
    });
  }

  // side_bar_content[0] = first_article;
  // side_bar_content[1] = first_article_URL;

  // Logger.log(first_article)
  // Logger.log(first_article_URL)
  return {
    output: first_three,
  };
}

function getKeywords() {
  var documentProperties = PropertiesService.getDocumentProperties();
  var keywordArr = documentProperties.getProperty("KEYWORD_ARR");
  Logger.log(JSON.parse(keywordArr));
  return JSON.parse(keywordArr);
}

function fetchIndividualKeyword(keyword) {
  var documentProperties = PropertiesService.getDocumentProperties();
  let searchTerm = keyword;
  let url;
  let first_three = [];
  try {
    url = `https://newsapi.org/v2/everything?q=${searchTerm}&from=2021-02-21&to=2021-02-21&sortBy=popularity&apiKey=8738aed08efc43b4869f63671fdcfdb3&language=en`;
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    if (data.totalResults > 0) {
      for (let i = 0; i < data.totalResults && i < 3; i++) {
        first_three.push({
          title: data.articles[i].title,
          url: data.articles[i].url,
        });
      }

      // while (first_three.length < 3) {
      //   first_three.push({
      //     title: "No data available :( ... back to work",
      //     url: ""
      //   });
      // }

    } else {
      Logger.log("No results found");
      return;
    }
  } catch (e) {
    Logger.log(e);
  }

  const keywordArr = getKeywords();
  let arrIndex = -1;
  for (let i = 0; i < keywordArr.length; i++) {
    Logger.log(`${keywordArr[i].name}` == `${searchTerm}`);
    if (`${keywordArr[i].name}` == `${searchTerm}`) {
      arrIndex = i;
    }
  }
  if (arrIndex != -1) {
    Logger.log("FOUND INDEX");
    keywordArr[arrIndex].articles = first_three;
    Logger.log(keywordArr);
    documentProperties.setProperty("KEYWORD_ARR", JSON.stringify(keywordArr));
    return keywordArr[arrIndex].articles;
  }
}
