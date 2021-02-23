/**
 * Runs when the document is opened.
 */
function onOpen() {
  DocumentApp.getUi().createMenu('Inspector')
    .addItem('Show sidebar', 'showSidebar')
    .addToUi();
}

/**
 * Show the sidebar.
 */
function showSidebar() {
  DocumentApp.getUi().showSidebar(
    HtmlService.createTemplateFromFile('sidebar').evaluate()
      .setTitle('Cursor Inspector')
      .setWidth(350));
}

/**
 * Returns the contents of an HTML file.
 * @param {string} file The name of the file to retrieve.
 * @return {string} The content of the file.
 */
function include(file) {
  return HtmlService.createTemplateFromFile(sidebar.html).evaluate().getContent();
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
      surroundingTextOffset: cursor.getSurroundingTextOffset()
    };
  }
  if (selection) {
    result.selection = {
      selectedElements: selection.getSelectedElements().map(function(selectedElement) {
        return {
          element: getElementInfo(selectedElement.getElement()),
          partial: selectedElement.isPartial(),
          startOffset: selectedElement.getStartOffset(),
          endOffsetInclusive: selectedElement.getEndOffsetInclusive()
        };
      })
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
    type: String(element.getType())
  };
}

/**
 * Retrieves research output.
 *
 * @return {Object} Object containing the output of the research.
 */
function getResearch() {

  Logger.log(getDocumentInfo());

  var total_doc = getDocumentInfo();
  var search_input = '';
  var side_bar_content = [];

  if (total_doc.selection) {
    Logger.log('element is selected')
    var start = total_doc.selection.selectedElements[0].startOffset;
    var end = total_doc.selection.selectedElements[0].endOffsetInclusive;

    total_doc_as_array = DocumentApp.getActiveDocument().getText().split(''); 
    search_input = total_doc_as_array.slice(start, end+1).join('');
    // Logger.log(search_input);

  }

  else {
    Logger.log('no element is selected, look at first word of par.')
    var first_word_of_par = getDocumentInfo().cursor.surroundingText.split(' ')[0]
    search_input = first_word_of_par
  }
  
  Logger.log(search_input);

  let url = `https://newsapi.org/v2/everything?q=${search_input}&from=2021-02-21&to=2021-02-21&sortBy=popularity&apiKey=8738aed08efc43b4869f63671fdcfdb3&language=en`;

  Logger.log(url)

  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);

  if (data.totalResults == 0) {
     side_bar_content = ["No data available :( ... back to work ", ''];
     Logger.log(side_bar_content)
     return {
       output: side_bar_content
     }
  }

  Logger.log(data.articles)



  var first_article = data.articles[1].description;
  var first_article_URL = data.articles[1].url;

  side_bar_content[0] = first_article;
  side_bar_content[1] = first_article_URL;

  Logger.log(side_bar_content)

  // Logger.log(first_article)
  // Logger.log(first_article_URL)
  return {
    output: side_bar_content
  };
}

getResearch();