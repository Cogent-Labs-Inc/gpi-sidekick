function initializeDocForSheet() {
  const sheets = SpreadsheetApp.getActive().getSheets();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedSheetName = sheet.getName();
  const spreadsheetName = SpreadsheetApp.getActiveSpreadsheet().getName();
  const numOfActiveColumns = sheet.getDataRange().getNumColumns();
  const numOfActiveRows = sheet.getDataRange().getNumRows();
  const isInitializedBefore = !(
    isSheetNotExistBefore(sheets, "content_list") &&
    isSheetNotExistBefore(sheets, "sidekick")
  );

  if (handleErrors(sheet)) return;

  const docLinkColumnIndex = findOrCreateHeading("attached_single_doc");
  // if (isInitializedBefore) return

  const headerRow = getRowByNumber(1);
  if (showErrors(sheet, headerRow)) return;

  const excludeColumnsCount =
    headerRow.includes("attached_doc") +
    headerRow.includes("attached_single_doc");
  headerRow.splice(headerRow.length - excludeColumnsCount);

  let intialTable = headerRow.map((heading) => [heading]);

  let rowNumberWithLink = 2;
  const docLinkRange = sheet.getRange(rowNumberWithLink, docLinkColumnIndex);
  const isDocLinkAlreadyExist = docLinkRange.getValue() !== "";

  if (!isDocLinkAlreadyExist) {
    const docName =
      spreadsheetName + " - " + selectedSheetName + " - " + "All rows";
    const doc = DocumentApp.create(docName);
    moveDocToSubFolder(doc);
    const body = doc.getBody();

    const docUrl = "https://docs.google.com/document/d/" + doc.getId();
    docLinkRange.setValue(docUrl);

    for (let rowNumber = 2; rowNumber <= numOfActiveRows; rowNumber++) {
      const currentRow = getRowByNumber(rowNumber);
      currentRow.splice(currentRow.length - excludeColumnsCount);

      const tableCells = [];
      intialTable.forEach((heading, index) => {
        if (!ids.includes(heading[0]))
          tableCells.push([...heading, currentRow[index]]);
      });

      addHeading(getRowIdCell(rowNumber), body);
      addTable(tableCells, body);
    }

    addHeading("Metadata", body);
    const metaData = [
      ["Spreadsheet Url", SpreadsheetApp.getActive().getUrl()],
      ["Sheet Name", selectedSheetName],
    ];
    addTable(metaData, body);
  }

  function getRowIdCell(rowNo) {
    const { sheetRange } = getIdTextRange(rowNo, sheet);
    let idValue = sheetRange.getValue();
    if (typeof idValue === "number") idValue = String(idValue);

    return idValue !== "" ? idValue : "Row " + rowNo;
  }

  function addHeading(heading, body) {
    var paragraph = body.appendParagraph(heading);
    paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  }

  function addTable(tableCells, body) {
    const table = body.appendTable(tableCells);
    table.setBorderColor("#000000");
    table.setBorderWidth(1);
    table.setColumnWidth(0, 150);
  }

  function getRowByNumber(rowNumber) {
    const values = sheet
      .getRange(rowNumber, 1, 1, numOfActiveColumns)
      .getValues();
    return values[0];
  }

  function findOrCreateHeading(headingName) {
    const headingRow = getRowByNumber(1);
    const columnIndex = headingRow.findIndex(
      (heading) => heading === headingName
    );

    if (columnIndex !== -1) {
      return columnIndex + 1;
    }

    const newColumnIndex = numOfActiveColumns + 1;
    sheet.getRange(1, newColumnIndex).setValue(headingName);
    return newColumnIndex;
  }
}
