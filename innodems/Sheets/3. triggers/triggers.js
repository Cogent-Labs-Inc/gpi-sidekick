function scriptApp() {
  const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  console.log(scriptApp);
  console.log(
    { authInfo },
    "status",
    authInfo.getAuthorizationStatus().toString()
  );
  if (!authInfo || !authInfo.getAuthorizationStatus()) {
    // Request authorization from the user
    const authorizationUrl = authInfo.getAuthorizationUrl();
    Logger.log("Please visit the following URL to authorize the script:");
    Logger.log(authorizationUrl);
    return;
  }
}

function checkAuthorization() {
  const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  if (true) {
    const authorizationUrl = authInfo.getAuthorizationUrl();
    // const response = UrlFetchApp.fetch(authorizationUrl);
    const ui = SpreadsheetApp.getUi();

    SpreadsheetApp.getUi().showModalDialog(
      HtmlService.createHtmlOutput(
        `Please grant the necessary permissions by opening the following URL: <a href="${authorizationUrl}" target="_blank">${authorizationUrl}</a>`
      ),
      "Authorization Required"
    );
  }
}

const sheetIds = {
  global: 4,
  template: 1,
  dataList: 3,
  contentList: 2,
  sidekick: 0,
  sheetId: "19cL55L5XFKd7rNEFd_bPvcXvCeBybQRRkK4nIK3CUX8",
  // sheetId: '11BwQ2N3vNjPP-ekWEuhPaIzB61m7dxWwgZgcecbuuvU',

  // global: '1Uwc-oI-hI9__hZzpQL2nX_Q2RAY6nFIp9hexb8uO2Mo',
  // template: '1LFiihPXfx5kt7GiH0uckHXmt2Pz1bX-UIW2fxbJ3FOY',
  // // contentList: '1SUZMKEQBjz1JEWjKnR_j7rjXXMHMKw-60_IRqTyV9x8',
  // contentList: '1GaBrVbu9y8UmFi78DBVD0go7nlhupR30m0ezf5ZtL0A',
  // dataList: '1b-udobwH6nsqFzKXgRFotSe8WgO4sI5EBc1NE3dZxGQ',
  // sidekick: '1gbXKXixQP9fymjVLmYwvJvIW9IZ63PkFhA4ut65Z2BI',
};

const sheetNames = {
  contentList: "Content  List",
  global: "Global",
  template: "Template",
  dataList: "Data List",
  sidekick: "Sidekick",
};

const sheetIdsList = Object.keys(sheetIds).slice(0, 3);
const actionGroupsList = sheetIdsList.map((key) => {
  return [key, `${camelCase2Name(key)} Sheet`];
});

function camelCase2Name(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([a-z])/g, " $1$2")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

class DynamicMenu {
  constructor(isShowInitialize = true) {
    this.createMenu = (ui) => {
      // const menu = ui.createMenu();
      const menu = ui.createAddonMenu();
      if (isShowInitialize) menu.addItem("Initialize", "initializeSidekick");
      const subMenu = ui.createMenu("Insert");
      // const subMenu2 = ui.createMenu("Github Actions");
      const subMenu3 = ui.createMenu("Sync With Docs");

      const subMenu4 = ui.createMenu("Test data and guide");
      subMenu4.addItem("Create test data", "createTestData");
      subMenu4.addItem("Sample data and guide", "showHelpDialogue");

      subMenu3.addSubMenu(
        SpreadsheetApp.getUi()
          .createMenu("One doc for each row")
          .addItem("Initialize docs for each row", "initializeDocsForEachRow")
          .addItem("Sync sheet with all docs", "syncSheetWithDocs")
      );

      subMenu3.addSubMenu(
        SpreadsheetApp.getUi()
          .createMenu("One doc for whole sheet")
          .addItem("Initialize doc for sheet", "initializeDocForSheet")
          .addItem("Sync doc with sheet", "syncDocWithSheet")
      );

      actionGroupsList.forEach((param) => {
        const functionName = `function${param[0]}`;
        const entryName = `${param[1]}`;
        subMenu.addItem(entryName, `menuActions.${functionName}`);
      });

      menu.addSubMenu(subMenu);
      // menu.addSubMenu(subMenu2);
      menu.addSubMenu(subMenu3);
      menu.addSubMenu(subMenu4);

      menu.addToUi();
    };

    this.createActions = () => {
      const menuActions = {};
      actionGroupsList.forEach((param) => {
        const functionName = `function${param[0]}`;
        menuActions[functionName] = function () {
          myParametrizedFunction(param[0]);
        };
      });

      console.log({ menuActions });
      return menuActions;
    };

    function myParametrizedFunction(sheetName) {
      const sheets = SpreadsheetApp.getActive().getSheets();

      sheetName !== "contentList" &&
      isSheetNotExistBefore(sheets, "content_list")
        ? SpreadsheetApp.getUi().alert("Please add content list sheet first")
        : sheetDuplicate(sheetName);
    }
  }
}

function initializeSidekick() {
  const sheets = SpreadsheetApp.getActive().getSheets();

  if (isSheetNotExistBefore(sheets, "sidekick")) sheetDuplicate("sidekick");
  if (isSheetNotExistBefore(sheets, "content_list"))
    sheetDuplicate("contentList");

  let menu1 = new DynamicMenu(false);
  menu1.createActions();

  menu1.createMenu(SpreadsheetApp.getUi());
}

function isSheetNotExistBefore(sheets, checkName) {
  return sheets.every((sheet) => {
    return !sheet.getName().includes(checkName);
  });
}

function checkIsSheetNameNotExistBefore(sheets, checkName) {
  return sheets.every((sheet) => {
    return sheet.getName() !== checkName;
  });
}

let count = 1;
function getSheetName(sheets, sheetNameWithVersion, sheetNameEnd = "") {
  if (
    checkIsSheetNameNotExistBefore(sheets, sheetNameWithVersion + sheetNameEnd)
  )
    return sheetNameWithVersion + sheetNameEnd;
  else return getSheetName(sheets, sheetNameWithVersion, ` (${count++})`);
}

function sheetDuplicate(sheetName) {
  const sheetId = sheetIds["sheetId"];
  var source = SpreadsheetApp.openById(sheetId);

  const sheetIndex = sheetIds[sheetName];
  var sheet = source.getSheets()[sheetIndex];

  const sheetNameWithVersion = camelCase2Name(sheetName) + " v1";
  let sheets = SpreadsheetApp.getActive().getSheets();
  const sheetNameFinal = getSheetName(sheets, sheetNameWithVersion);

  var destination = SpreadsheetApp.getActiveSpreadsheet();
  sheet.copyTo(destination);

  sheets = SpreadsheetApp.getActive().getSheets();
  const sheetsLength = sheets.length;
  const lastSheet = sheets[sheetsLength - 1];
  lastSheet.setName(sheetNameFinal);
  const updatedName = lastSheet.getName().replace("Copy of ", "");
  const finalName = renameSheets(updatedName);

  if (finalName) {
    lastSheet.setName(finalName);
    addSheetToContentList(finalName, sheetName);

    if (finalName.includes("sidekick")) lastSheet.hideSheet();
  }
}

// const sheets = SpreadsheetApp.getActive().getSheets()
// const isShowInitialize = isSheetNotExistBefore(sheets, 'content_list') || isSheetNotExistBefore(sheets, 'sidekick')

// const menu = new DynamicMenu(isShowInitialize);
// const menuActions = menu.createActions();

function addSheetToContentList(sheetName, sheetNameKey) {
  if (sheetName.includes("content_list") || sheetName.includes("sidekick"))
    return;

  const insertNames = {
    flow_type: toSnakeCase(sheetNameKey),
    flow_name: sheetName,
    status: "released",
  };

  const sheets = SpreadsheetApp.getActive().getSheets();
  let sheetIndex = null;
  sheets.every((sheet, index) => {
    if (sheet.getName().includes("content_list")) {
      sheetIndex = index;
      return false;
    }
    return true;
  });

  if (sheetIndex === null) return;
  const contentListSheet = sheets[sheetIndex];

  const activeRows = contentListSheet.getDataRange().getNumRows();
  const activeColumns = contentListSheet.getDataRange().getNumColumns();

  const firstRow = contentListSheet
    .getRange(1, 1, 1, activeColumns)
    .getValues();

  const valuesForNewRow = firstRow[0].map((heading) => {
    return insertNames?.[heading] || "";
  });
  contentListSheet
    .getRange(activeRows + 1, 1, 1, activeColumns)
    .setValues([valuesForNewRow]);
}

function renameSheets(sheetName) {
  if (sheetName.includes("Content  List")) return "==content_list==";
  else if (sheetName.includes("Sidekick")) return "==sidekick==";
  return sheetName;
}

let isShowInitialize;

//todo: can add manual auth
try {
  const sheets = SpreadsheetApp.getActive().getSheets();
  isShowInitialize =
    isSheetNotExistBefore(sheets, "content_list") ||
    isSheetNotExistBefore(sheets, "sidekick");
} catch {
  isShowInitialize = true;
}

const menu = new DynamicMenu(isShowInitialize);
const menuActions = menu.createActions();

function createUi() {
  let ui;
  ui = SpreadsheetApp.getUi();
  menu.createMenu(ui);
}

function onOpen(e) {
  console.log({ e });
  createUi();
}

function onInstall(e) {
  onOpen(e);
}
