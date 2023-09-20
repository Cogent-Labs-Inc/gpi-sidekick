function createTestData() {
  var sourceDocId = "1LcrkWg6F3BLP9uMZwp9Abjk60zQr93u_2iQ2fOGA92k";
  var sourceDoc = DocumentApp.openById(sourceDocId);
  var sourceBody = sourceDoc.getBody();

  const destinationDoc = DocumentApp.getActiveDocument();
  const destinationBody = destinationDoc.getBody();

  // Clear the existing content in the destination document
  destinationBody.clear();

  // Copy the content and formatting from the source document to the destination document
  for (var i = 0; i < sourceBody.getNumChildren(); i++) {
    var child = sourceBody.getChild(i).copy();
    var childType = child.getType();

    if (childType === DocumentApp.ElementType.PARAGRAPH) {
      destinationBody.appendParagraph(child.asParagraph());
    } else if (childType === DocumentApp.ElementType.TABLE) {
      destinationBody.appendTable(child.asTable());
    } else if (childType === DocumentApp.ElementType.LIST_ITEM) {
      destinationBody.appendListItem(child.asListItem());
    } else if (childType === DocumentApp.ElementType.INLINE_IMAGE) {
      destinationBody.appendImage(child.asInlineImage());
    }
    // Add more conditions if needed to handle other element types

  }
}
