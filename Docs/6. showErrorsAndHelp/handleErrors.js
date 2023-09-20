function handleErrors(data) {
  let errorMessage = null;

  if (data.type === "tables-count") {
    console.log({ data }, errorsList.tableRequired);
    if (data.tablesLength < 1) errorMessage = errorsList.tableRequired;
  } else if (data.type === "spreadsheet-id") {
    console.log({ data }, errorsList.spreadsheetId);
    if (!data.spreadsheetId || data.spreadsheetId === "")
      errorMessage = errorsList.spreadsheetId;
  } else if (data.type === "incorrect-spreadsheet-id") {
    console.log({ data }, errorsList.incorrectSpreadsheetId);
    if (data.spreadsheetId === "incorrect")
      errorMessage = errorsList.incorrectSpreadsheetId;
  } else if (data.type === "id-cell-not-found") {
    console.log({ data }, errorsList.idCellNotFound);
    if (data.spreadsheetId === "incorrect")
      errorMessage = errorsList.idCellNotFound;
  }

  if (errorMessage) showHelpDialogue(errorMessage);

  return errorMessage;
}

const errorsList = {
  tableRequired:
    `No data found or incorrect data format. Please go to"Extention menu" -> "Test data and guide" -> "Create test data"`,
  spreadsheetId: "Spreadsheet link is not found.",
  incorrectSpreadsheetId: "Spreadsheet link is incorrect.",
  idCellNotFound:
    "Id cell is not found in sheet or sheet has not at least two rows and two columns.",
};
