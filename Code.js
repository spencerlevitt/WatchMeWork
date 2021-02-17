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
  // let request = new XMLHTTPRequest();
  // request.open('GET', 'https://uraqwfo1nd.execute-api.us-east-1.amazonaws.com/api/search?search_string={Obama}&key=vQZIl7B3kFfHloC6BTOXd1NYqan1ouZ2');
  // // request.setRequestHeader('x-api-key', '9HeBB23LR4a8mruNNf3kq17fFuR9b4JP1q5KSMCC');
  // request.send();
  
  let url = 'https://uraqwfo1nd.execute-api.us-east-1.amazonaws.com/api/search?search_string=northwestern%20university&key=vQZIl7B3kFfHloC6BTOXd1NYqan1ouZ2';
//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data)
//     })
// } 
  loadJSON(url, gotBritData);
  function gotBritData(data) {
    println(data);
  }


//   return {
//     output: "Hello world !"
//   };
}