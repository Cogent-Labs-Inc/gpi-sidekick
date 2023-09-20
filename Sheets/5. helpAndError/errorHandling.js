function handleErrors(sheet) {
  const errorsList = {
    id: `'A1' cell needs to have value 'ID' to run this functioanlity. Or to create test data please go to"Extention menu" -> "Test data and guide" -> "Create test data" `,
    minimumData: `Spreadsheet should have minimum two rows and columns to continue with. Or to create test data please go to"Extention menu" -> "Test data and guide" -> "Create test data" `,
  };

  const isIdError = checkIsIdError(sheet);
  const isDataError = checkIsMinDataError(sheet);

  if (isIdError) showHelpDialogue(errorsList.id);
  else if (isDataError) showHelpDialogue(errorsList.minimumData);

  return isIdError || isDataError;
}

function checkIsIdError(sheet) {
  const firstCellValue = sheet.getRange(1, 1).getValue();
  return !ids.includes(firstCellValue);
}

function checkIsMinDataError(sheet) {
  console.log({ sheet });
  const lastRow = sheet.getDataRange().getNumRows();
  const lastColumn = sheet.getDataRange().getNumColumns();

  console.log({ lastRow, lastColumn }, lastRow <= 2 || lastColumn <= 2);

  return lastRow <= 1 || lastColumn <= 1;
}
