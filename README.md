# Free Deadline Reminders for Google Sheets

Automatically email people before a due date in a Google Sheet: invoices, renewals, assignments, certifications, task owners. One Apps Script file, no add-on, no subscription. Your data never leaves your Google account.

- Runs every morning on its own once turned on
- Emails each row when its **Due Date** is 3 days away or less (overdue rows too)
- Writes a **Reminder Status** column, so nobody is reminded twice for the same date
- Change a row's due date (say, next month's renewal) and it is reminded again for the new date
- Write the reminder as a normal Gmail draft with `{{Column Name}}` placeholders

New to this? Read the [step-by-step guide](https://decodedxr.github.io/sheets-deadline-reminders/automatic-email-reminders-google-sheets.html).

## One-time setup (5 minutes)

1. Give your sheet **headers in row 1**, including columns named exactly **Email** and **Due Date** (formatted as dates).
2. **Extensions → Apps Script**, delete the placeholder code, paste in `Code.gs`, save.
3. Reload the sheet. A **📅 Reminders** menu appears.
4. In **Gmail**, compose the reminder as a draft, for example:
   > Subject: `Reminder: {{Task}} is due {{Due Date}}`
   >
   > Hi {{Name}}, just a heads-up that {{Task}} is due on {{Due Date}}.
5. In the sheet: **📅 Reminders → Turn On Daily Reminders** and type the draft's subject. Google asks for permission the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

It sends anything already due right away, then checks every day around 8:00.

## Menu

| Item | What it does |
|---|---|
| Turn On Daily Reminders | Picks the template draft and schedules the daily run |
| Send Due Reminders Now | Runs the check immediately |
| Turn Off | Stops the daily run |

## Notes

- Change the window or run time with `DAYS_BEFORE` and `RUN_HOUR` at the top of `Code.gs`.
- To remind someone again for the same date, clear their **Reminder Status** cell.
- Rows with an empty email or no valid date are skipped. Failed sends show `ERROR: ...` and are retried the next day.
- Gmail's daily limit is about 100 recipients on a personal account and 1,500 on Google Workspace. Anything over the limit goes out the next day.
- Keep the template draft in Gmail; the script reads it on every run.

## More free Sheets tools

- [Sheets Mail Merge](https://github.com/DecodedXR/sheets-mail-merge): send a personalized email to every row, YAMM-style.

## License

MIT. See `LICENSE`.
