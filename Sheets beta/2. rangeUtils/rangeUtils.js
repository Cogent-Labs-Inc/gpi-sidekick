function getRange(sheet, range) {
	const { startRow, startColumn, numOfRows, numOfColumn } = range;

	if (
		decodeRange(startRow) === 0 ||
		decodeRange(startColumn) === 0 ||
		decodeRange(numOfRows) === 0 ||
		decodeRange(numOfColumn) === 0
	)
		return null;

	return {
		decodedRange: {
			startRow: decodeRange(startRow),
			startColumn: decodeRange(startColumn),
			numOfRows: decodeRange(numOfRows),
			numOfColumn: decodeRange(numOfColumn),
		},
		sheetRange: sheet.getRange(
			decodeRange(startRow),
			decodeRange(startColumn),
			decodeRange(numOfRows),
			decodeRange(numOfColumn)
		),
	};

	function decodeRange(rangeItem) {
		if (typeof rangeItem === NUMBER) return rangeItem;
		else if (typeof rangeItem === STRING) {
			switch (rangeItem) {
				case rangeSelectors.activeColumns:
					return sheet.getDataRange().getNumColumns();
				case rangeSelectors.activeRows:
					return sheet.getDataRange().getNumRows();
				case rangeSelectors.maxColumns:
					return sheet.getMaxColumns();
				case rangeSelectors.maxRows:
					return sheet.getMaxRows();
			}
		} else if (typeof rangeItem === OBJECT) {
			const { sheetRange } = getHeaderRange();
			let headingIndex;

			if (rangeItem?.heading) {
				headerValues = sheetRange.getValues()[0];
				headingIndex = headerValues.findIndex((heading) => heading === rangeItem.heading) + 1;
			}
			return headingIndex;
		}
	}

	function getHeaderRange() {
		const headerRangeConfig = {
			startRow: 1,
			startColumn: 1,
			numOfRows: 1,
			numOfColumn: 'active columns',
		};

		return getRange(sheet, headerRangeConfig);
	}
}
