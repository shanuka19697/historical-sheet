# Google Sheets Setup Guide

To enable form submissions to save data directly into your Google Sheet, follow these steps:

## 1. Create a Google Cloud Project & Service Account
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "History Form App").
3. Go to **APIs & Services > Library** and search for "Google Sheets API". Click **Enable**.
4. Go to **APIs & Services > Credentials**.
5. Click **Create Credentials** -> **Service account**.
6. Give it a name (e.g., "sheets-editor") and click Create and Continue, then Done.
7. Click on the newly created Service Account (it looks like an email address).
8. Go to the **Keys** tab, click **Add Key** -> **Create new key** -> **JSON**.
9. A JSON file will download to your computer.

## 2. Set Up Your Google Sheet
1. Create a new Google Sheet.
2. In the first row, create the following column headers exactly:
   - `Timestamp`
   - `Group ID`
   - `Title`
   - `Member 1 Name`
   - `Member 1 Index`
   - `Member 1 Dept`
   - `Member 2 Name`
   - `Member 2 Index`
   - `Member 2 Dept`
   - `Member 3 Name`
   - `Member 3 Index`
   - `Member 3 Dept`
   - `Member 4 Name`
   - `Member 4 Index`
   - `Member 4 Dept`
3. Click the **Share** button in the top right.
4. Open the JSON file you downloaded earlier and copy the `client_email` value.
5. Paste this email into the Share dialog and give it **Editor** permissions.

## 3. Configure Your Application
1. Rename `.env.local.example` to `.env.local` in `d:\history-form\`.
2. Fill in the values from your JSON file and Sheet URL:
   - `GOOGLE_CLIENT_EMAIL`: The `client_email` from your JSON.
   - `GOOGLE_PRIVATE_KEY`: The `private_key` from your JSON. (It MUST include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts, keeping all the `\n` characters exactly as they are).
   - `SHEET_ID`: You can find this in your Google Sheet's URL. For example, if your URL is `https://docs.google.com/spreadsheets/d/abc123xyz456/edit`, your `SHEET_ID` is `abc123xyz456`.

## 4. Run the application
Run `npm run dev` to start the application and test the form. The data will appear in your Google Sheet immediately upon successful submission!
