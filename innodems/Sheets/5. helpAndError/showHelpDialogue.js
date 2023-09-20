function showHelpDialogue(errorText = "") {
  const title =
    errorText === ""
      ? "Sample data and guideline"
      : "Please correct follwing error";

  const sidekickPageLink =
    "https://www.sidekick.idems.international/sidekick-guide.html";
  const html = `${errorText ? `<p>${errorText}</p>` : ""} 
                For guide go to 
                <a href=${sidekickPageLink} target="_blank">this site</a> 
                to see the sample data on which extention works and also basic extention working guideline.`;

  const lineCount = Math.ceil(errorText.length / 60);
  const additionalHeight = lineCount * 18;

  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(100 + additionalHeight);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, title);
}
