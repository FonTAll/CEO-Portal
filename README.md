# 🏢 Enterprise Web Application (Single Tenant)

This project is a React-based frontend application designed to work with Google Sheets & Google Apps Script as the backend database. It is built for a single-tenant architecture (1 Project per 1 Client).

## 🛠 Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Animation & UI:** Framer Motion, Lucide React, React Draggable
- **Backend:** Google Sheets + Apps Script
- **Deployment:** Vercel

---

## 📦 Step 1: Backend Setup (Google Sheets)

1. Go to Google Drive and create a new **Google Sheet** (Name it after the client, e.g., `ClientA_Database`).
2. Go to **Extensions > Apps Script**.
3. Paste the provided backend code (`backend/Code.gs`) into the editor.
4. Click **Deploy > New deployment**.
5. Configuration:
   - **Select type:** Web App
   - **Execute as:** Me (Your email)
   - **Who has access:** Anyone
6. Click **Deploy** and copy the **Web App URL**. (You will need this for the Frontend).

---

## 💻 Step 2: Frontend Setup (Local Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the Google Apps Script Web App URL from Step 1:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🐙 Step 3: Push to GitHub

1. Initialize git (if not already done) and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Go to [GitHub](https://github.com/) and create a new repository.
3. Link your local project to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

---

## 🚀 Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New... > Project**.
3. Import the repository you just pushed to GitHub.
4. In the **Configure Project** section:
   - Framework Preset: `Vite` (Vercel usually detects this automatically).
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Crucial Step (Environment Variables):**
   - Open the **Environment Variables** dropdown.
   - Name: `VITE_APPS_SCRIPT_URL`
   - Value: `[Paste your Google Apps Script Web App URL here]`
   - Click **Add**.
6. Click **Deploy**.
7. Wait for the build to finish (usually takes less than a minute). Vercel will provide you with a live URL (e.g., `https://your-project.vercel.app`).

🎉 **Your application is now live!** Send the Vercel URL to your client.

---

## 🔐 Security Notes
- **CORS Bypass:** All API calls to Apps Script use `text/plain` to avoid CORS preflight issues.
- **Anti-Screen Capture:** The app automatically blurs the screen when the window loses focus.
- **Watermark:** User details are watermarked across the screen upon successful login.

---

## 📖 คู่มือการตั้งค่า Google Sheets (ภาษาไทย)

ระบบนี้รองรับการสร้างชีต (Spreadsheet) และสร้างหัวข้อคอลัมน์ (Header) อัตโนมัติผ่าน Google Apps Script กรุณาทำตามขั้นตอนดังนี้:

### ขั้นตอนที่ 1: สร้าง Google Apps Script
1. เปิด Google Sheets ที่คุณต้องการใช้เป็นฐานข้อมูล
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. ลบโค้ดเดิมที่มีอยู่ทั้งหมด แล้วคัดลอกโค้ดด้านล่างนี้ไปวางแทน:

```javascript
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var sheetName = data.sheetName;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);

    // 1. คำสั่งสร้างชีตใหม่พร้อม Header
    if (action === 'createSheet') {
      var headers = data.headers;

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);

        if (headers && headers.length > 0) {
          sheet.appendRow(headers);
          
          // ตกแต่ง Header
          var headerRange = sheet.getRange(1, 1, 1, headers.length);
          headerRange.setFontWeight("bold");
          headerRange.setBackground("#083A59");
          headerRange.setFontColor("#FFFFFF");
          
          // ล็อกแถวแรกไว้
          sheet.setFrozenRows(1);
        }
        output.setContent(JSON.stringify({ status: "success", message: "สร้างชีตสำเร็จ" }));
      } else {
        output.setContent(JSON.stringify({ status: "success", message: "มีชีตนี้อยู่แล้ว" }));
      }
      return output;
    }

    // 2. คำสั่งเพิ่มข้อมูลแถวใหม่
    if (action === 'appendRow') {
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }
      sheet.appendRow(data.rowData);
      output.setContent(JSON.stringify({ status: "success", message: "เพิ่มข้อมูลสำเร็จ" }));
      return output;
    }

    throw new Error("ไม่รู้จักคำสั่งนี้");

  } catch (error) {
    output.setContent(JSON.stringify({ status: "error", message: error.toString() }));
    return output;
  }
}
```

### ขั้นตอนที่ 2: นำสคริปต์ไปใช้งาน (Deploy)
1. ในหน้า Apps Script กดปุ่ม **การทำให้ใช้งานได้ (Deploy)** ที่มุมขวาบน > เลือก **การทำให้ใช้งานได้รายการใหม่ (New deployment)**
2. กดไอคอนรูปเฟือง ⚙️ เลือกประเภทเป็น **เว็บแอป (Web app)**
3. ตั้งค่าดังนี้:
   * **คำอธิบาย:** (ตั้งชื่ออะไรก็ได้ เช่น `WMS API`)
   * **เรียกใช้ในฐานะ (Execute as):** `ฉัน (Me)`
   * **ผู้ที่มีสิทธิ์เข้าถึง (Who has access):** `ทุกคน (Anyone)` *(สำคัญมาก: ต้องเลือก "ทุกคน" เพื่อให้ระบบส่งข้อมูลมาได้)*
4. กดปุ่ม **การทำให้ใช้งานได้ (Deploy)** (หากมีหน้าต่างขอสิทธิ์ ให้กดยืนยันและอนุญาตสิทธิ์เข้าถึงบัญชี Google)
5. คัดลอก **URL ของเว็บแอป (Web app URL)** ที่ได้มา

### ขั้นตอนที่ 3: นำ URL มาใส่ในระบบ
1. นำ URL ที่คัดลอกมา ไปใส่ในไฟล์ `.env` ของโปรเจกต์ (หรือในหน้าตั้งค่า Environment Variables ของ Vercel/AI Studio)
2. กำหนดชื่อตัวแปรเป็น `VITE_APPS_SCRIPT_URL`
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. บันทึกและรีสตาร์ทระบบ (หากรันในเครื่องตัวเองให้ใช้คำสั่ง `npm run dev` ใหม่)
