# 🧪 Bot Testing Guide

## Quick Testing Steps

### 1️⃣ Basic Access
1. Open Telegram
2. Search: `@upsosb_bot`
3. Click "Start" or send `/start`
4. Expected: Welcome message with UP Govt branding

### 2️⃣ Language Switch
1. Click "भाषा बदलें / Change Language"
2. Select English
3. Expected: Menu in English
4. Switch back to Hindi
5. Expected: Menu in Hindi

### 3️⃣ About Us Module
**Hindi:**
1. Click "📖 हमारे बारे में"
2. Test: "✨ विजन और मिशन" → PDF should download
3. Test: "📜 अधिनियम की पृष्ठभूमि" → PDF should download
4. Test: "📚 कार्यक्रम" → PDF should download

**English:**
1. Switch to English
2. Click "📖 About Us"
3. Test all three sections
4. PDFs should download

### 4️⃣ Admission Module
1. Click "📝 प्रवेश"
2. Select "कक्षा 9वीं"
3. Expected: Detailed admission info with ₹2,000 fees
4. Test other classes (10, 11, 12)
5. Verify eligibility, documents, fees display

### 5️⃣ Important Dates
1. Click "📅 महत्वपूर्ण तिथियां"
2. Expected: Dates for admission, exams, results
3. Verify both Hindi and English

### 6️⃣ Nodal Centers
1. Click "🏫 नोडल सेंटर"
2. Click "📍 जिला चुनें"
3. Select "Agra"
4. Expected: List of centers with phone numbers
5. Test "🗺️ सभी जिले देखें"
6. Expected: All 75 districts as buttons

### 7️⃣ Study Material - LOGIN FLOW ⭐

**Step 1: Access Study Material**
1. Click "📚 अध्ययन सामग्री"
2. Expected: Login screen with demo credentials visible

**Step 2: Login with Demo Account**
```
📝 Registration Number: 12345
📅 Date of Birth: 01/01/2000
```

1. Enter: `12345`
2. Expected: "पंजीकरण संख्या मिली! अब जन्म तिथि भेजें"
3. Enter: `01/01/2000`
4. Expected: "लॉगिन सफल! नाम: Rahul Kumar, कक्षा: 10"
5. Subject menu appears

**Step 3: Test Mathematics**
1. Click "📐 गणित (Mathematics)"
2. Expected: Chapter grid (1-15)
3. Click any chapter number (e.g., "1")
4. Expected: PDF downloads (if file exists)
5. If file missing: "PDF फ़ाइल जल्द ही उपलब्ध होगी"

**Step 4: Test Science**
1. Go back to subjects
2. Click "🔬 विज्ञान (Science)"
3. Expected: 13 chapters + Complete Book option
4. Test chapter download

**Step 5: Test Social Science**
1. Click "📜 सामाजिक विज्ञान"
2. Expected: History, Geography, Civics, Economics topics
3. Test any topic

**Step 6: Test English**
1. Click "🌐 अंग्रेजी (English)"
2. Expected: Prose, Poetry, Grammar, Writing sections
3. Test any section

**Step 7: Test Hindi**
1. Click "🇮🇳 हिंदी (Hindi)"
2. Expected: गद्य, काव्य, व्याकरण, लेखन sections
3. Test any section

### 8️⃣ Test Other Demo Accounts

**Class 10 Student:**
```
Registration: 10001
DOB: 15/08/2008
Name: Priya Singh
District: Prayagraj
```

**Class 11 Student:**
```
Registration: 11001
DOB: 05/01/2008
Name: Anjali Mishra
Stream: Science
```

**Class 12 Student:**
```
Registration: 12001
DOB: 08/02/2006
Name: Divya Pandey
Stream: Science
```

**Class 9 Student:**
```
Registration: 9001
DOB: 17/09/2009
Name: Riya Chauhan
```

### 9️⃣ FAQ System

**Test Categories (Hindi):**
1. Click "❓ FAQ"
2. Test each category:
   - 📝 प्रवेश (6 questions)
   - 📅 परीक्षा (7 questions)
   - 💰 शुल्क (6 questions)
   - 📚 अध्ययन सामग्री (6 questions)
   - 🎯 परिणाम (6 questions)
   - 📜 प्रमाणपत्र (7 questions)
   - 📞 संपर्क (7 questions)

**Test Categories (English):**
1. Switch to English
2. Click "❓ FAQ"
3. Test all categories

### 🔟 Contact Module
1. Click "📞 संपर्क करें"
2. Expected: 
   - Patrachar Shiksha Sansthan address
   - Phone: 1800 00 000
   - Email: patracharshikshasansthan@gmail.com
   - Office timings
3. Click "📍 Google Maps पर देखें"
4. Expected: Opens Google Maps location

---

## ⚠️ Error Testing

### Test Invalid Login
1. Study Material → Login
2. Enter: `99999` (invalid registration)
3. Expected: "गलत पंजीकरण संख्या"
4. Enter: `12345` (valid)
5. Enter: `99/99/9999` (wrong DOB)
6. Expected: "गलत जन्म तिथि"

### Test Missing PDFs
1. Login and select any subject
2. If PDF doesn't exist on server
3. Expected: "PDF फ़ाइल जल्द ही उपलब्ध होगी"
4. Should NOT crash

### Test Navigation
1. At any screen, click "⬅️ वापस"
2. Expected: Goes to previous screen
3. Click "🏠 मुख्य मेन्यू"
4. Expected: Returns to main menu

---

## 📊 Expected Results Summary

### ✅ Working Features
- [x] Welcome message
- [x] Language switching
- [x] About Us with PDFs
- [x] Admission details
- [x] Important dates
- [x] Nodal centers (all 75 districts)
- [x] Study material login
- [x] All 5 subjects menu
- [x] Mathematics chapters (if PDFs uploaded)
- [x] Science chapters structure
- [x] Social Science structure
- [x] English structure
- [x] Hindi structure
- [x] FAQ (45+ Q&A)
- [x] Contact with Google Maps
- [x] Commands: /start, /info, /help, /services, /contact
- [x] Error handling
- [x] Session management

### ⏳ Placeholder (Coming Soon)
- [ ] Exams module
- [ ] Results module
- [ ] Student services
- [ ] Fee payment

---

## 🎯 Success Criteria

✅ Bot responds within 2 seconds
✅ No crashes during testing
✅ All menus display correctly
✅ PDFs download successfully (if files exist)
✅ Login authentication works
✅ Navigation buttons work
✅ Error messages display properly
✅ Both languages work
✅ Session state maintained
✅ Back buttons functional

---

## 📝 Notes for Testing

1. **Demo Credentials:** Always visible on login screen
2. **PDF Files:** Only Math has actual PDFs, others show "Coming Soon"
3. **Database:** Using mock data, will migrate to SQL later
4. **Error Recovery:** Bot auto-reconnects on network issues
5. **Session:** Clears on bot restart

---

## 🐛 Bug Reporting

If you find issues, note:
1. Which screen/button
2. What you clicked
3. Expected behavior
4. Actual behavior
5. Error message (if any)
6. Screenshot (if possible)

---

**Bot:** @upsosb_bot  
**Status:** Production Ready ✅  
**Last Updated:** December 13, 2025
