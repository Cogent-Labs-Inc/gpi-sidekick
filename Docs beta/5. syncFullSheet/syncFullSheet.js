function syncFullSheet() {
	// const doc = DocumentApp.getActiveDocument();
	// const body = doc.getBody();
	// const tables = body.getTables();
	// const metaDataTable = tables[tables.length - 1];

	// const spreadsheetId = getSpreadsheetIdFromUrl(getTableValue(metaDataTable, 'Spreadsheet Url'));
	// const sheetName = getTableValue(metaDataTable, 'Sheet Name');
	// const rowNumber = parseInt(getTableValue(metaDataTable, 'Row Number'));

	// const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
	// const sheetActiveColumns = sheet.getDataRange().getNumColumns();
	// const sheetActiveRows = sheet.getDataRange().getNumRows();

	// const headingData = getTableDataInSheetFormat(tables[0], 0);
	// const rowData = getTableDataInSheetFormat(tables[0], 1);
	// const rowDataLength = rowData[0]?.length;

	// const attachedDocsColumnWidth = 1;
	// const sheetNumColumnsExceptLast = sheetActiveColumns - attachedDocsColumnWidth;

	// if (rowDataLength > sheetNumColumnsExceptLast) {
	// 	const requiredSpace = rowDataLength - sheetNumColumnsExceptLast;
	// 	makeSpaceInSheet(sheet, requiredSpace);
	// } else if (sheetNumColumnsExceptLast > rowDataLength) {
	// 	const numOfColumnsToClear = sheetNumColumnsExceptLast - rowDataLength;
	// 	const toClearRowRange = sheet.getRange(rowNumber, rowDataLength + 1, 1, numOfColumnsToClear);

	// 	toClearRowRange.clearContent();
	// }

	// const allTablePairs = getTablePairs();

	// const firstTable = allTablePairs?.[0];
	// if (firstTable) {
	// 	const rangeObj = {
	// 		startRow: { element: firstTable.heading, heading: 'ID' },
	// 		startColumn: { heading: 'ID' },
	// 		numOfRows: 1,
	// 		numOfColumn: rangeSelectors.activeColumns,
	// 	};

	// 	const { sheetRange, decodedRange } = getRange(sheet, rangeObj);
	// 	//todo - reduce number of columns by 2
	// 	decodedRange.numOfColumn = decodedRange.numOfColumn - 2;
	// 	const { startRow, startColumn, numOfRows, numOfColumn } = decodedRange;
	// 	sheet.getRange(startRow, startColumn, numOfRows, numOfColumn).setValues(rowData);

	// 	// console.log({ range });
	// }

	// // sheet.getRange(1, 1, 1, rowDataLength).setValues(headingData)
	// // sheet.getRange(rowNumber, 1, 1, rowDataLength).setValues(rowData)

	// function makeSpaceInSheet(sheet, spaceRequired) {
	// 	const sheetLastColumnRange = sheet.getRange(1, sheetActiveColumns, sheetActiveRows, 1);

	// 	const sheetLastColumnOldValues = sheetLastColumnRange.getValues();
	// 	sheetLastColumnRange.clearContent();

	// 	const newLastColumnRange = sheet.getRange(1, sheetActiveColumns + spaceRequired, sheetActiveRows, 1);
	// 	newLastColumnRange.setValues(sheetLastColumnOldValues);
	// }

	// function getSpreadsheetIdFromUrl(url) {
	// 	return url.replace('https://docs.google.com/spreadsheets/d/', '').replace('/edit', '');
	// }

	// function getTableValue(table, heading) {
	// 	const numRows = table.getNumRows();
	// 	const numColumns = table.getRow(1).getNumCells();

	// 	let value = '';

	// 	for (let row = 0; row < numRows; row++) {
	// 		const tableHeadingName = table.getRow(row).getCell(0).getText();
	// 		if (tableHeadingName === heading) value = table.getRow(row).getCell(1).getText();
	// 	}

	// 	return value;
	// }

	// function getTableDataInSheetFormat(table, columnNumber) {
	// 	const numRows = table.getNumRows();
	// 	let rows = [];

	// 	for (let row = 0; row < numRows; row++) {
	// 		const value = table.getRow(row).getCell(columnNumber).getText();
	// 		rows = [...rows, value];
	// 	}

	// 	return [rows];
	// }

	// function getTablePairs() {
	// 	var doc = DocumentApp.getActiveDocument();
	// 	var childNum = doc.getBody().getNumChildren();
	// 	var tablePairs = [];

	// 	let tableHeadingPair = getTableHeadingPairInitialValue();

	// 	for (var i = 0; i < childNum; i++) {
	// 		const type = doc.getBody().getChild(i).getType().name();
	// 		const element = doc.getBody().getChild(i);
	// 		const text = element.asText().getText();

	// 		if (type === 'PARAGRAPH' && text !== '') {
	// 			tableHeadingPair.heading = text;
	// 		} else if (type === 'TABLE') {
	// 			tableHeadingPair.table = element;
	// 			tablePairs.push(tableHeadingPair);

	// 			tableHeadingPair = getTableHeadingPairInitialValue();
	// 		}
	// 	}

	// 	console.log(tablePairs);
	// 	console.log(tablePairs.length);

	// 	return tablePairs;

	// 	function getTableHeadingPairInitialValue() {
	// 		return {
	// 			heading: '',
	// 			table: null,
	// 		};
	// 	}
	// }
}
