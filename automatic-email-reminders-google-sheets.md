---
title: How to send automatic email reminders from Google Sheets (free)
description: Email people automatically before a due date listed in a Google Sheet. Free Apps Script, no add-on, runs daily and never sends the same reminder twice.
---

# How to send automatic email reminders from Google Sheets (free)

If you track deadlines in a Google Sheet (invoices, contract renewals, assignments, license expiries, task due dates), Google Sheets can email the right person before each one is due. You need one short Apps Script file and a Gmail draft. No add-on, no Zapier, no subscription.

This guide uses [Sheets Deadline Reminders](https://github.com/DecodedXR/sheets-deadline-reminders), a free, MIT-licensed script. Setup takes about 5 minutes.

## What you need

- A Google account (personal Gmail or Google Workspace)
- A Google Sheet with one row per deadline
- The reminder email, written as a Gmail draft

## Step 1: Set up your sheet

Put headers in **row 1**. Two columns must be named exactly **Email** and **Due Date**. Format the Due Date column as dates (**Format → Number → Date**). Add any other columns you want to mention in the email:

| Name | Email | Task | Due Date |
|---|---|---|---|
| Ana | ana@example.com | Q3 invoice | 10/24/2026 |
| Ben | ben@example.com | License renewal | 11/02/2026 |

The script adds a **Reminder Status** column the first time it runs.

## Step 2: Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete the placeholder code.
3. Paste in the contents of [`Code.gs`](https://github.com/DecodedXR/sheets-deadline-reminders/blob/main/Code.gs) and click **Save**.
4. Reload the sheet. A **📅 Reminders** menu appears.

## Step 3: Write the reminder as a Gmail draft

Compose a new message in Gmail and leave it in **Drafts**. Use `{{Column Name}}` for anything from the sheet:

> **Subject:** `Reminder: {{Task}} is due {{Due Date}}`
>
> Hi {{Name}},
>
> Just a heads-up that {{Task}} is due on {{Due Date}}.

Formatting, links and attachments carry over.

## Step 4: Turn on daily reminders

Choose **📅 Reminders → Turn On Daily Reminders** and type the draft's subject line. Google asks for permission the first time. Because it's your own unpublished script, it shows "Google hasn't verified this app": click **Advanced → Go to (your project name) → Allow**.

The script sends any reminders that are already due, then runs on its own every morning around 8:00.

## How it decides who to email

- A row is reminded when its due date is **3 days away or less**, including overdue rows.
- Each reminder is recorded as `Reminded <date> for <due date>`, so the same deadline is never reminded twice.
- **Recurring deadlines:** change the due date to the next one (next month's invoice, next year's renewal) and the row is reminded again for the new date.
- Failed sends are marked `ERROR: ...` and retried the next day.

To change the 3-day window or the 8:00 run time, edit `DAYS_BEFORE` and `RUN_HOUR` at the top of the script.

## FAQ

**Is it really free?** Yes. It's MIT licensed and runs on your own Google account. The only limit is Gmail's daily quota: about 100 recipients a day on a personal account and 1,500 on Google Workspace ([Google's quotas](https://developers.google.com/apps-script/guides/services/quotas)).

**Does my computer need to be on?** No. The daily run happens on Google's servers.

**Can I send a reminder on the due date only?** Set `DAYS_BEFORE` to `0`.

**Can I remind someone again for the same date?** Clear their Reminder Status cell and choose **Send Due Reminders Now**.

**How do I stop it?** **📅 Reminders → Turn Off**.

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-deadline-reminders) · Also free: [Mail Merge for Google Sheets](https://decodedxr.github.io/sheets-mail-merge/free-mail-merge-google-sheets.html)
