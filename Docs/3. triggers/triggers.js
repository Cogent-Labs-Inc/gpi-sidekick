class DynamicMenu {
  constructor() {
    this.createMenu = (ui) => {
      const menu = ui.createAddonMenu();

      const subMenu = ui.createMenu("Sync");
      subMenu.addItem("Sync with sheet", "syncDocWithSheet");
      menu.addSubMenu(subMenu);

      const subMenu1 = ui.createMenu("Test data and guide");
      subMenu1.addItem("Create test data", "createTestData");
      subMenu1.addItem("Sample data and guide", "showHelpDialogue");
      menu.addSubMenu(subMenu1);

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

function onOpen(e) {
  const menu = new DynamicMenu();
  const ui = DocumentApp.getUi();
  menu.createMenu(ui);
}

function onInstall(e) {
  onOpen(e);
}
