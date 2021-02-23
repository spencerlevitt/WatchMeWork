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
  Logger.log(
    AppLib.getKeywords(
      "President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."
    )
  );
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
      .setTitle("Cursor Inspector")
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
