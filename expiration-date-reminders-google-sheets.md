---
title: Expiration date reminders from Google Sheets (free email alerts)
description: Get an email before a certification, license, contract, subscription or document expires, straight from a Google Sheet. Free Apps Script, runs daily, no add-on.
image: https://decodedxr.github.io/sheets-deadline-reminders/assets/cover.png
---
{% raw %}

# Expiration date reminders from Google Sheets (free email alerts)

Certifications, licenses, insurance policies, contracts, domain names, passports, software subscriptions: things that expire are usually tracked in a spreadsheet, and usually noticed a week too late. This guide sets up a Google Sheet that emails the right person a set number of days before each expiration date, every morning, automatically. It's free and needs no add-on.

It uses [Sheets Deadline Reminders](https://github.com/DecodedXR/sheets-deadline-reminders), a free, MIT-licensed Apps Script.

## Step 1: Set up the tracker

One row per item that expires. Two column names matter: **Email** (who gets the reminder) and **Due Date** (the expiration date, formatted as a date). Everything else is up to you:

| Item | Owner | Email | Due Date | Done |
|---|---|---|---|---|
| Forklift certification | Ana | ana@example.com | 12/01/2026 | ☐ |
| Liability insurance | Office | office@example.com | 01/15/2027 | ☐ |
| example.com domain | IT | it@example.com | 03/09/2027 | ☐ |

To send yourself every reminder instead of each owner, put your own address in every Email cell.

## Step 2: Choose how early to be warned

Expirations usually need more notice than task deadlines. Open the script (Step 3) and change the line at the top:

```
const DAYS_BEFORE = 30;
```

Each row is then reminded once, when it's 30 days or less from expiring. Use 60 or 90 for things with long renewal processes.

## Step 3: Add the script

1. **Extensions → Apps Script**, delete the placeholder code, paste in [`Code.gs`](https://github.com/DecodedXR/sheets-deadline-reminders/blob/main/Code.gs), and set `DAYS_BEFORE` as above. **Save**.
2. Reload the sheet. A **📅 Reminders** menu appears.

## Step 4: Write the reminder email

In Gmail, write a draft. Any column can go in the message:

> **Subject:** `{{Item}} expires on {{Due Date}}`
>
> Hi {{Owner}}, {{Item}} expires on {{Due Date}}. Please renew it and tick "Done" in the tracker.

## Step 5: Turn it on

**📅 Reminders → Turn On Daily Reminders**, then type the draft's subject. Approve the permission prompt the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

Anything already inside the window is emailed right away. After that, the sheet checks itself every morning.

## When something is renewed

You have two options:

- **Enter the new expiration date.** The row is reminded again when the new date comes into range, so yearly renewals keep working with no extra setup.
- **Tick a checkbox.** Name a column **Done** (or **Paid** or **Completed**) and insert checkboxes with **Insert → Checkbox**. Ticked rows are never reminded.

## FAQ

**Does my computer need to be on?** No. The daily check runs on Google's servers.

**Can I get one reminder 30 days out and another 7 days out?** Not automatically: it sends one reminder per expiration date. For a last-minute nudge, clear that row's **Reminder Status** cell when you want it, and the next morning's run sends it again.

**Is it free?** Yes. Gmail allows scripts about 100 recipients a day on a personal account and 1,500 on Google Workspace, which is plenty for a tracker.

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-deadline-reminders) · [General guide: automatic email reminders from Google Sheets](automatic-email-reminders-google-sheets.html)
{% endraw %}
