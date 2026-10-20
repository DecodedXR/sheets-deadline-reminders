/**
 * Deadline Reminders for Google Sheets: emails each row's owner before a due date.
 *
 * Setup: header row with "Email" and "Due Date" columns. A "Reminder Status"
 * column is created automatically. Compose a Gmail DRAFT with {{Column Name}}
 * placeholders, then use 📅 Reminders → Turn On Daily Reminders.
 * Change a row's due date and it is reminded again for the new date.
 */

const EMAIL_COL = 'Email';
const DUE_COL = 'Due Date';
const STATUS_COL = 'Reminder Status';
const DAYS_BEFORE = 3; // remind when the due date is this many days away or less (overdue rows too)
const RUN_HOUR = 8;    // daily run, in the script's time zone

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📅 Reminders')
    .addItem('Turn On Daily Reminders', 'turnOn')
    .addItem('Send Due Reminders Now', 'runNow')
    .addItem('Turn Off', 'turnOff')
    .addToUi();
}

function turnOn() {
  const ui = SpreadsheetApp.getUi();
  const draft = pickDraft_(ui);
  if (!draft) return;
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('draftSubject', draft.getMessage().getSubject());
  props.setProperty('sheetName', SpreadsheetApp.getActiveSheet().getName());
  deleteTriggers_();
  ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(RUN_HOUR).create();
  const n = sendReminders();
  ui.alert('Daily reminders are on (around ' + RUN_HOUR + ':00). Sent ' + n + ' now.');
}

function runNow() {
  if (!PropertiesService.getDocumentProperties().getProperty('draftSubject')) {
    SpreadsheetApp.getUi().alert('Use "Turn On Daily Reminders" first to pick the template draft.');
    return;
  }
  SpreadsheetApp.getUi().alert('Sent ' + sendReminders() + ' reminder(s).');
}

function turnOff() {
  deleteTriggers_();
  SpreadsheetApp.getUi().alert('Daily reminders are off.');
}

/** Runs from the daily trigger (no UI available), so errors go into the status column. */
function sendReminders() {
  const props = PropertiesService.getDocumentProperties();
  const subject = props.getProperty('draftSubject');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(props.getProperty('sheetName'));
  if (!subject || !sheet) return 0;
  const draft = GmailApp.getDrafts().find(d => d.getMessage().getSubject() === subject);
  if (!draft) return 0;

  const range = sheet.getDataRange();
  const values = range.getValues();
  const shown = range.getDisplayValues();
  const headers = shown[0];
  const emailIdx = headers.indexOf(EMAIL_COL);
  const dueIdx = headers.indexOf(DUE_COL);
  if (emailIdx === -1 || dueIdx === -1) return 0;
  let statusIdx = headers.indexOf(STATUS_COL);
  if (statusIdx === -1) {
    statusIdx = headers.length;
    sheet.getRange(1, statusIdx + 1).setValue(STATUS_COL);
  }

  const msg = draft.getMessage();
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  let quota = MailApp.getRemainingDailyQuota();
  let sent = 0;

  for (let r = 1; r < values.length; r++) {
    const email = String(shown[r][emailIdx]).trim();
    const due = values[r][dueIdx];
    if (!email || !(due instanceof Date)) continue;
    const dueStr = Utilities.formatDate(due, tz, 'yyyy-MM-dd');
    if (!shouldRemind_(dueStr, today, DAYS_BEFORE, String(shown[r][statusIdx] || ''))) continue;
    if (quota-- <= 0) break; // the next daily run picks up the rest

    const fill = (s, escape) => s.replace(/{{\s*([^}]+?)\s*}}/g, (_, name) => {
      const i = headers.indexOf(name.trim());
      const v = i === -1 ? '' : String(shown[r][i]);
      return escape ? escapeHtml_(v) : v;
    });
    try {
      GmailApp.sendEmail(email, fill(msg.getSubject()), '', {
        htmlBody: fill(msg.getBody(), true),
        attachments: msg.getAttachments({ includeInlineImages: false }),
      });
      sheet.getRange(r + 1, statusIdx + 1).setValue('Reminded ' + today + ' for ' + dueStr);
      sent++;
    } catch (e) {
      sheet.getRange(r + 1, statusIdx + 1).setValue('ERROR: ' + e.message);
    }
  }
  return sent;
}

/** Due within the window (or overdue) and not already reminded for this due date. */
function shouldRemind_(dueStr, todayStr, daysBefore, status) {
  if (status.endsWith('for ' + dueStr)) return false;
  const days = (Date.parse(dueStr) - Date.parse(todayStr)) / 86400000;
  return days <= daysBefore;
}

function deleteTriggers_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendReminders')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

/** Let the user pick which Gmail draft is the template, by subject line. */
function pickDraft_(ui) {
  const drafts = GmailApp.getDrafts();
  if (!drafts.length) {
    ui.alert('No Gmail drafts found. Compose your reminder as a draft in Gmail first.');
    return null;
  }
  const resp = ui.prompt('Deadline Reminders',
    'Type the subject line of the Gmail draft to use as the reminder:\n\n' +
    drafts.slice(0, 15).map(d => '• ' + d.getMessage().getSubject()).join('\n'),
    ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return null;
  const wanted = resp.getResponseText().trim().toLowerCase();
  const match = drafts.find(d => d.getMessage().getSubject().trim().toLowerCase() === wanted);
  if (!match) ui.alert('No draft with that subject found.');
  return match;
}

function escapeHtml_(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
