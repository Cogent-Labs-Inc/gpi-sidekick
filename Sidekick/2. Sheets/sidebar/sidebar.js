
function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebarPage').setTitle('Select a folder from Google Drive');
  SpreadsheetApp.getUi().showSidebar(html);
}

function getFolderOptions() {
  console.log('started')
  var folders = DriveApp.getFolders();
  console.log({ folders })
  var options = '<option value="">--Select--</option>';
  console.log(folders.hasNext())
  console.log(folders.next())
  while (folders.hasNext()) {
    var folder = folders.next();
    options += '<option value="' + folder.getId() + '">' + folder.getName() + '</option>';
  }

  return options;
}

function createPullRequest(folderId) {
  console.log('in code', { folderId });

  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var contentList = [];

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var fileExtention = isFileSpreadsheet(file) ? '.xlsx' : '';

    const base64Data = Utilities.base64Encode(file.getBlob().getBytes());

    contentList = [
      ...contentList,
      {
        fileName: fileName + fileExtention,
        folderName: folder.getName(),
        content: base64Data,
      },
    ];
  }

  return contentList;
}

function isFileSpreadsheet(file) {
	return file.getMimeType() === 'application/vnd.google-apps.spreadsheet';
}
