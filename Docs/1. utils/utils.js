function toSnakeCase(str) {
  // return str.replace(/[\s]/g, '_').toLowerCase()
  return str
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
}

function showErrors(headerRow) {
  // const repeatedColumns = headerRow.filter((heading, index) => headerRow.indexOf(heading) !== index);
  let repeatedColumns = getAllIndexesForRepeatedColumns(headerRow);
  let emptyColumns = getAllIndexes(headerRow, "");

  const repeatedColumnsError = repeatedColumns.length
    ? `Repeated headings index: ${repeatedColumns.join(", ")}`
    : null;
  const emptyColumnsError = emptyColumns.length
    ? `Empty headings index: ${emptyColumns.join(", ")}`
    : null;
  const errors = getJoinedErrors(repeatedColumnsError, emptyColumnsError);

  errors && DocumentApp.getUi().alert(errors);
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
    if (repeatedColumnsError && emptyColumnsError)
      return repeatedColumnsError + "\n" + emptyColumnsError;
    else if (repeatedColumnsError) return repeatedColumnsError;
    else if (emptyColumnsError) return emptyColumnsError;

    return null;
  }
}

function getIdTextRange(rowNumber, sheet) {
  let idTextRange;
  let range;
  const ids = ["ID", "id", "iD", "Id"];

  ids.forEach((id) => {
    if (!range) {
      try {
        idTextRange = {
          startRow: rowNumber,
          startColumn: { heading: id },
          numOfRows: 1,
          numOfColumn: rangeSelectors.activeColumns,
        };
        range = getRange(sheet, idTextRange);
        console.log({ range });
      } catch {}
    }
  });

  return range;
}
