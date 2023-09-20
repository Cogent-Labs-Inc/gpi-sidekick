function toSnakeCase(str) {
  // return str.replace(/[\s]/g, '_').toLowerCase()
  return str
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
}

function showErrorsSheets(sheet, headerRow) {
  // const repeatedColumns = headerRow.filter((heading, index) => headerRow.indexOf(heading) !== index);
  let repeatedColumns = getAllIndexesForRepeatedColumns(headerRow);
  repeatedColumns = repeatedColumns.map((index) =>
    sheet.getRange(1, index + 1).getA1Notation()
  );

  let emptyColumns = getAllIndexes(headerRow, "");
  emptyColumns = emptyColumns.map((index) =>
    sheet.getRange(1, index + 1).getA1Notation()
  );

  const repeatedColumnsError = repeatedColumns.length
    ? `Repeated headings: ${repeatedColumns.join(", ")}`
    : null;
  const emptyColumnsError = emptyColumns.length
    ? `Empty headings: ${emptyColumns.join(", ")}`
    : null;
  const errors = getJoinedErrors(repeatedColumnsError, emptyColumnsError);

  errors && SpreadsheetApp.getUi().alert(errors);
  return errors;

  function getAllIndexes(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  }

  function getAllIndexesForRepeatedColumns(arr) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (val !== "") {
        if (arr.indexOf(val) !== i) indexes.push(i);
      }
    }
    return indexes;
  }

  function getJoinedErrors(repeatedColumnsError, emptyColumnsError) {
    const initialError =
      "Please fix the following errors in the header row: \n \n";
    let error = null;

    if (repeatedColumnsError && emptyColumnsError)
      error = repeatedColumnsError + "\n" + emptyColumnsError;
    else if (repeatedColumnsError) error = repeatedColumnsError;
    else if (emptyColumnsError) error = emptyColumnsError;

    return error ? initialError + error : null;
  }
}

function moveDocToSubFolder(doc) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetName = SpreadsheetApp.getActiveSpreadsheet().getName();

  var spreadsheetId = spreadsheet.getId();
  var file = DriveApp.getFileById(spreadsheetId);
  var folder = file.getParents().next();
  const subFolder = getOrCreateSubFolder(
    folder,
    spreadsheetName + " attached docs"
  );

  var docFile = DriveApp.getFileById(doc.getId());
  moveFileToFolder(docFile, subFolder);

  function getOrCreateSubFolder(folder, subFolderName) {
    const allFolders = folder.getFolders();
    while (allFolders.hasNext()) {
      const nextFolder = allFolders.next();
      if (nextFolder.getName() === subFolderName) {
        return nextFolder;
      }
    }
    return folder.createFolder(subFolderName);
  }

  function moveFileToFolder(file, folder) {
    file.moveTo(folder);
  }
}
