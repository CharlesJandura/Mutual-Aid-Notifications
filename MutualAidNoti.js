// send edit notifs from google sheets to discord
// do not remove these comments
// code created by rvbautista on github
// code edited by charlesjandura on github
// https://github.com/rvbautista/google-sheets-alert-to-discord/
function postDiscord(message) {
    // Define the Discord webhook URL
    var discordUrl = "https://discord.com/api/webhooks/1194685746456572084/rgFhT50xRj0_18LdIh1gG5FJm1H_8Rx0RV4UbjRXItApH6d2wODX-br7iPjphnqy1xZB";
  
    // Set up the payload with the message content to send to Discord
    var payload = JSON.stringify({content: message});
  
    // Configure request parameters
    var params = {
      method: "POST",                // HTTP method
      payload: payload,              // Payload containing the message
      muteHttpExceptions: true,      // Mute HTTP exceptions for better error handling
      contentType: "application/json" // Content type for JSON format
    };
  
    // Send the POST request to the Discord webhook URL
    var response = UrlFetchApp.fetch(discordUrl, params);
  }
  
  function copyData() {
    // Get the active Google Spreadsheet and required sheets
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var form_sheet = sheet.getSheetByName("OG Form Responses");      // Source sheet
    var current_sheet = sheet.getSheetByName("Requests (Copy,Can Edit)"); // Destination sheet
  
    // Get the last row with data in each sheet
    var last_request = form_sheet.getLastRow();
    var latest_update = current_sheet.getLastRow();
  
    // Check if there are new requests to process
    if (last_request - latest_update == 0) {
      Logger.log("Number of form requests: " + (last_request - 1));
      Logger.log("Number of records: " + (latest_update - 1));
      return; // Exit if no new requests
    } else if (last_request - latest_update < 0) {
      Logger.log("Number of records exceeds number of form submissions");
      Logger.log("Number of form requests: " + (last_request - 1));
      Logger.log("Number of records: " + (latest_update - 1));
      return; // Exit if the number of records exceeds the number of requests
    }
  
    // Get the new data from the form sheet, only the rows that haven’t been copied yet
    var new_requests = form_sheet.getRange(latest_update + 1, 1, last_request - latest_update, 13);
    var empty_rows = current_sheet.getRange(latest_update + 1, 1, last_request - latest_update, 13);
  
    // Get the values from the new requests as a 2D array
    var values = new_requests.getValues();
  
    // Loop over each row in the new requests
    values.forEach(function(row, rowId) {
      // Initialize the message to send to Discord for each row
      var discord_message = "Request received at ";
  
      // Loop over each column in the row
      row.forEach(function(col, colId) {
        // Copy the cell value from the source to the destination sheet
        empty_rows.getCell(rowId + 1, colId + 1).setValue(col);
  
        // Add column values to the message, but skip specific columns (2, 3, 7, and 11)
        if (![2, 3, 7, 11].includes(colId + 1)) {
          discord_message += col + " "; // Append column data to the message
        }
      });
  
      // Send the compiled message for this row to Discord
      postDiscord(discord_message);
    });
  }
  