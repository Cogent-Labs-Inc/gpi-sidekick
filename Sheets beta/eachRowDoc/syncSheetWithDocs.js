function syncSheetWithDocs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selectedSheetName = sheet.getName();
  const spreadsheetName = SpreadsheetApp.getActiveSheet().getName();
  const numOfActiveColumns = sheet.getDataRange().getNumColumns();
  const numOfActiveRows = sheet.getDataRange().getNumRows();

  if (handleErrors(sheet)) return;

  const docLinkColumnIndex = findOrCreateHeading("attached_doc");
  const headerRow = getRowByNumber(1);
  if (showErrors(sheet, headerRow)) return;

  const excludeColumnsCount =
    headerRow.includes("attached_doc") +
    headerRow.includes("attached_single_doc");
  headerRow.splice(headerRow.length - excludeColumnsCount);

  let intialTable = headerRow.map((heading) => [heading]);

  for (let rowNumber = 2; rowNumber <= numOfActiveRows; rowNumber++) {
    const docLinkRange = sheet.getRange(rowNumber, docLinkColumnIndex);
    const docUrl = docLinkRange.getValue();
    const isDocLinkExist = docLinkRange.getValue() !== "";

    if (isDocLinkExist) {
      const currentRow = getRowByNumber(rowNumber);
      currentRow.splice(currentRow.length - excludeColumnsCount);

      const tableCells = [];
      intialTable.forEach((heading, index) => {
        if (!ids.includes(heading[0]))
          tableCells.push([...heading, currentRow[index]]);
      });

      console.log({ docUrl });

      const doc = DocumentApp.openByUrl(docUrl + "/edit");
      const body = doc.getBody();
      const tablePairs = getTablePairs(doc);
      const firstTablePair = tablePairs[1];
      const { sheetRange } = getIdTextRange(rowNumber, sheet);

      let idText = sheetRange.getValue();
      if (idText === "") idText = `Row ${rowNumber}`;

      const {
        heading: firstTableHeading,
        headingElement: firstTableHeadingElement,
        table: firstTable,
        tableElement: firstTableElement,
      } = firstTablePair;

      console.log({ idText });

      if (firstTableHeadingElement && idText !== "") {
        firstTableHeadingElement.setText(idText);
      }

      replaceTableWithNewTable(0, tableCells, doc);
    }
  }

  function replaceTableWithNewTable(oldTableIndex, newTableCells, doc) {
    var oldTable = doc.getBody().getTables()[oldTableIndex]; // select the old table

    var parent = oldTable.getParent();
    var parentIndex = parent.getChildIndex(oldTable);

    parent.removeChild(oldTable);

    parent.insertTable(parentIndex, newTableCells);
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

  function getTablePairs(doc) {
    var childNum = doc.getBody().getNumChildren();
    var tablePairs = [];

    let tableHeadingPair = getTableHeadingPairInitialValue();

    for (var i = 0; i < childNum; i++) {
      const type = doc.getBody().getChild(i).getType().name();
      const element = doc.getBody().getChild(i);
      const text = element.asText().getText();

      if (type === "PARAGRAPH" && text !== "") {
        tableHeadingPair.heading = text;
        tableHeadingPair.headingElement = element;
      } else if (type === "TABLE") {
        tableHeadingPair.table = element;
        tableHeadingPair.tableElemet = element;

        tablePairs.push(tableHeadingPair);
        tableHeadingPair = getTableHeadingPairInitialValue();
      }
    }

    return tablePairs;

    function getTableHeadingPairInitialValue() {
      return {
        heading: "",
        table: null,
        headingElement: null,
        tableElemet: null,
      };
    }
  }
}
