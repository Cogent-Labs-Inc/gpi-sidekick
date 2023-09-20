function syncDocWithSheetFORDocs() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const tables = body.getTables();
  const metaDataTable = tables.pop();
  const tablesLength = tables.length;

  const spreadsheetId = getSpreadsheetIdFromUrl(
    getTableValue(metaDataTable, "Spreadsheet Url")
  );
  const sheetName = getTableValue(metaDataTable, "Sheet Name");

  const rowNumber = parseInt(getTableValue(metaDataTable, "Row Number"));

  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const sheetActiveColumns = sheet.getDataRange().getNumColumns();
  const sheetActiveRows = sheet.getDataRange().getNumRows();

  //todo - reduce number of columns by 2
  const attachedDocsColumnWidth = 2;
  const sheetNumColumnsExceptLast =
    sheetActiveColumns - attachedDocsColumnWidth;

  // if (rowDataLength > sheetNumColumnsExceptLast) {
  //   const requiredSpace = rowDataLength - sheetNumColumnsExceptLast;
  //   makeSpaceInSheet(sheet, requiredSpace);
  // } else if (sheetNumColumnsExceptLast > rowDataLength) {
  //   const numOfColumnsToClear = sheetNumColumnsExceptLast - rowDataLength;
  //   const toClearRowRange = sheet.getRange(rowNumber, rowDataLength + 1, 1, numOfColumnsToClear);

  //   toClearRowRange.clearContent();
  // }

  //for loop with tablelength
  const allTablePairs = getTablePairs();

  for (let tableIndex = 0; tableIndex < tablesLength; tableIndex++) {
    const currentTable = allTablePairs?.[tableIndex];

    const docsHeadingData = getTableDataInSheetFormat(tables[tableIndex], 0);
    if (showErrorsDocs(docsHeadingData)) return;

    const rowData = getTableDataInSheetFormat(tables[tableIndex], 1);
    const rowDataLength = rowData?.length;

    if (currentTable) {
      const findId = currentTable.heading;
      let foundIndex = -1;

      const fullData = sheet.getDataRange().getValues();

      if (findId.includes("Row ")) {
        foundIndex = parseInt(findId.split("Row ")[1]);
      } else {
        //todo- do for id column only
        for (let i = 0; i < fullData.length; i++) {
          for (let j = 0; j < fullData[i].length; j++) {
            if (fullData[i][j] === findId) {
              foundIndex = i + 1;
            }
          }
        }
      }

      if (foundIndex !== -1) {
        const rangeObj = {
          startRow: foundIndex,
          startColumn: { heading: "ID" },
          numOfRows: 1,
          numOfColumn: rangeSelectors.activeColumns,
        };

        const { sheetRange, decodedRange } = getRange(sheet, rangeObj);
        //todo - reduce number of columns by 2
        decodedRange.numOfColumn = decodedRange.numOfColumn;
        const { startRow, startColumn, numOfRows, numOfColumn } = decodedRange;

        const sheetHeadingRange = sheet.getRange(1, 1, 1, numOfColumn);
        const rowRange = sheet.getRange(
          startRow,
          startColumn,
          numOfRows,
          numOfColumn
        );

        const sheetHeadingValues = sheetHeadingRange.getValues()[0];
        let sheetRowValues = rowRange.getValues()[0];

        const abc = [];

        sheetRowValues = sheetRowValues.map((cell, index) => {
          const docsMatchedIndex = docsHeadingData.findIndex((h) => {
            return h === sheetHeadingValues[index];
          });
          console.log({ docsMatchedIndex, index }, rowData[docsMatchedIndex]);

          if (docsMatchedIndex !== -1) {
            abc.push(rowData[docsMatchedIndex]);
            return rowData[docsMatchedIndex];
          }
          abc.push(cell);
          return cell;
        });

        rowRange.setValues([sheetRowValues]);
      }
    }

    //
  }

  // sheet.getRange(1, 1, 1, rowDataLength).setValues(headingData)
  // sheet.getRange(rowNumber, 1, 1, rowDataLength).setValues(rowData)

  function makeSpaceInSheet(sheet, spaceRequired) {
    const sheetLastColumnRange = sheet.getRange(
      1,
      sheetActiveColumns,
      sheetActiveRows,
      1
    );

    const sheetLastColumnOldValues = sheetLastColumnRange.getValues();
    sheetLastColumnRange.clearContent();

    const newLastColumnRange = sheet.getRange(
      1,
      sheetActiveColumns + spaceRequired,
      sheetActiveRows,
      1
    );
    newLastColumnRange.setValues(sheetLastColumnOldValues);
  }

  function getSpreadsheetIdFromUrl(url) {
    return url
      .replace("https://docs.google.com/spreadsheets/d/", "")
      .replace("/edit", "");
  }

  function getTableValue(table, heading) {
    const numRows = table.getNumRows();
    const numColumns = table.getRow(1).getNumCells();

    let value = "";

    for (let row = 0; row < numRows; row++) {
      const tableHeadingName = table.getRow(row).getCell(0).getText();
      if (tableHeadingName === heading)
        value = table.getRow(row).getCell(1).getText();
    }

    return value;
  }

  function getTableDataInSheetFormat(table, columnNumber) {
    const numRows = table.getNumRows();
    let rows = [];

    for (let row = 0; row < numRows; row++) {
      const value = table.getRow(row).getCell(columnNumber).getText();
      rows = [...rows, value];
    }

    return rows;
  }

  function getTablePairs() {
    var doc = DocumentApp.getActiveDocument();
    var childNum = doc.getBody().getNumChildren();
    var tablePairs = [];

    let tableHeadingPair = getTableHeadingPairInitialValue();

    for (var i = 0; i < childNum; i++) {
      const type = doc.getBody().getChild(i).getType().name();
      const element = doc.getBody().getChild(i);
      const text = element.asText().getText();

      if (type === "PARAGRAPH" && text !== "") {
        tableHeadingPair.heading = text;
      } else if (type === "TABLE") {
        tableHeadingPair.table = element;
        tablePairs.push(tableHeadingPair);

        tableHeadingPair = getTableHeadingPairInitialValue();
      }
    }

    return tablePairs;

    function getTableHeadingPairInitialValue() {
      return {
        heading: "",
        table: null,
      };
    }
  }
}
