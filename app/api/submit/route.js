import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, members } = body;

    if (!title || !members || members.length !== 4) {
      return new Response(JSON.stringify({ error: "Invalid data provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SHEET_ID) {
      console.warn("Missing Google Sheets credentials in .env.local");
      return new Response(JSON.stringify({ 
        error: "Server configuration error. Contact administrator." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);

    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];

    const groupId = `GRP-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    const newRow = {
      Timestamp: timestamp,
      "Group ID": groupId,
      Title: title,
      "Member 1 Name": members[0].name,
      "Member 1 Index": members[0].indexNumber,
      "Member 1 Dept": members[0].department,
      "Member 2 Name": members[1].name,
      "Member 2 Index": members[1].indexNumber,
      "Member 2 Dept": members[1].department,
      "Member 3 Name": members[2].name,
      "Member 3 Index": members[2].indexNumber,
      "Member 3 Dept": members[2].department,
      "Member 4 Name": members[3].name,
      "Member 4 Index": members[3].indexNumber,
      "Member 4 Dept": members[3].department,
    };

    try {
        await sheet.addRow(newRow);
    } catch(err) {
        console.error("Error appending row (likely missing headers in sheet)", err);
        return new Response(JSON.stringify({ error: "Failed to append row. Ensure sheet has correct row headers: Timestamp, Group ID, Title, etc." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Form submitted successfully!",
      groupId 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error submitting form:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
