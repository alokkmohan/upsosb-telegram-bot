const db = require('./db');
const fs = require('fs');
const path = require('path');

// Clear database
const dataDir = path.join(__dirname, 'data');
fs.writeFileSync(path.join(dataDir, 'menus.json'), JSON.stringify({ items: [], nextId: 1 }, null, 2));
fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify({ items: [], nextId: 1 }, null, 2));
console.log('Database clear, seeding...\n');

// ---- HELPERS ----
function addMenu(parent_id, emoji, title_hi, title_en, description = '') {
  return db.addMenu({ parent_id, emoji, title: title_hi, title_en, description });
}
function addText(menu, title_hi, content_hi, title_en, content_en) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'text', title: title_hi, title_en, content: content_hi, content_en: content_en || '', file_path: '' });
}
function addPDF(menu, title_hi, file_path, title_en) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'pdf', title: title_hi, title_en: title_en || title_hi, content: '', content_en: '', file_path });
}
function addLink(menu, title_hi, url, title_en) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'link', title: title_hi, title_en: title_en || title_hi, content: url, content_en: url, file_path: '' });
}

const samplePDF = 'Subject/Math/chapter1.pdf';

// ============================================================
// ROOT MENUS (Hindi Devanagari | English)
// ============================================================
const studyMaterial = addMenu(null, '📚', 'अध्ययन सामग्री',       'Study Material');
const aboutUPSOSB   = addMenu(null, '🏫', 'UPSOSB के बारे में',    'About UPSOSB');
const examSchedule  = addMenu(null, '📅', 'परीक्षा समय-सारिणी',   'Exam Schedule');
const results       = addMenu(null, '📊', 'परिणाम',                'Results');
const admitCard     = addMenu(null, '🪪', 'प्रवेश पत्र',           'Admit Card');
const contactUs     = addMenu(null, '📞', 'संपर्क करें',           'Contact Us');
const usefulLinks   = addMenu(null, '🔗', 'उपयोगी लिंक',          'Useful Links');

// ============================================================
// STUDY MATERIAL → SUBJECTS
// ============================================================
const math    = addMenu(studyMaterial.id, '🔢', 'गणित',          'Mathematics');
const science = addMenu(studyMaterial.id, '🔬', 'विज्ञान',        'Science');
const social  = addMenu(studyMaterial.id, '🌍', 'सामाजिक विज्ञान','Social Science');
const english = addMenu(studyMaterial.id, '📝', 'अंग्रेजी',       'English');
const hindi   = addMenu(studyMaterial.id, '📖', 'हिंदी',          'Hindi');

// ---- गणित (Mathematics) ----
addPDF(math, 'अध्याय 1 - वास्तविक संख्याएँ',             'Subject/Math/chapter1.pdf',  'Chapter 1 - Real Numbers');
addPDF(math, 'अध्याय 2 - बहुपद',                          'Subject/Math/chapter2.pdf',  'Chapter 2 - Polynomials');
addPDF(math, 'अध्याय 3 - दो चरों वाले रैखिक समीकरण',    'Subject/Math/chapter3.pdf',  'Chapter 3 - Linear Equations in Two Variables');
addPDF(math, 'अध्याय 4 - द्विघात समीकरण',                'Subject/Math/chapter4.pdf',  'Chapter 4 - Quadratic Equations');
addPDF(math, 'अध्याय 5 - समांतर श्रेणी',                 'Subject/Math/chapter5.pdf',  'Chapter 5 - Arithmetic Progressions');
addPDF(math, 'अध्याय 6 - त्रिभुज',                       'Subject/Math/chapter6.pdf',  'Chapter 6 - Triangles');
addPDF(math, 'अध्याय 7 - निर्देशांक ज्यामिति',           'Subject/Math/chapter7.pdf',  'Chapter 7 - Coordinate Geometry');
addPDF(math, 'अध्याय 8 - त्रिकोणमिति',                   'Subject/Math/chapter8.pdf',  'Chapter 8 - Trigonometry');
addPDF(math, 'अध्याय 9 - त्रिकोणमिति के अनुप्रयोग',     'Subject/Math/chapter9.pdf',  'Chapter 9 - Applications of Trigonometry');
addPDF(math, 'अध्याय 10 - वृत्त',                        'Subject/Math/chapter10.pdf', 'Chapter 10 - Circles');
addPDF(math, 'अध्याय 11 - रचनाएँ',                       'Subject/Math/chapter11.pdf', 'Chapter 11 - Constructions');
addPDF(math, 'अध्याय 12 - क्षेत्रमिति',                  'Subject/Math/chapter12.pdf', 'Chapter 12 - Areas Related to Circles');
addPDF(math, 'अध्याय 13 - पृष्ठीय क्षेत्रफल और आयतन',  'Subject/Math/chapter13.pdf', 'Chapter 13 - Surface Areas and Volumes');
addPDF(math, 'अध्याय 14 - सांख्यिकी',                   'Subject/Math/chapter14.pdf', 'Chapter 14 - Statistics');

// ---- विज्ञान (Science) ----
addText(science,
  'विज्ञान के बारे में',
  '🔬 *विज्ञान*\n\nइस अनुभाग में आपको विज्ञान के सभी अध्यायों की पाठ्य सामग्री मिलेगी।\n\n📌 *मुख्य विषय:*\n• रासायनिक अभिक्रियाएँ एवं समीकरण\n• अम्ल, क्षारक एवं लवण\n• धातुएँ एवं अधातुएँ\n• कार्बन एवं उसके यौगिक\n• जीव जनन कैसे करते हैं\n• प्रकाश - परावर्तन तथा अपवर्तन\n\n_शीघ्र ही PDF उपलब्ध होगी।_',
  'About Science',
  '🔬 *Science*\n\nThis section contains study material for all Science chapters.\n\n📌 *Key Topics:*\n• Chemical Reactions & Equations\n• Acids, Bases and Salts\n• Metals and Non-metals\n• Carbon and its Compounds\n• How do Organisms Reproduce\n• Light - Reflection and Refraction\n\n_PDFs will be available soon._'
);
addPDF(science, 'नमूना अध्याय PDF', samplePDF, 'Sample Chapter PDF');

// ---- सामाजिक विज्ञान (Social Science) ----
addText(social,
  'सामाजिक विज्ञान के बारे में',
  '🌍 *सामाजिक विज्ञान*\n\nइस अनुभाग में इतिहास, भूगोल, नागरिक शास्त्र एवं अर्थशास्त्र की पाठ्य सामग्री मिलेगी।\n\n📌 *मुख्य विषय:*\n• इतिहास - भारत में राष्ट्रवाद\n• भूगोल - संसाधन एवं विकास\n• नागरिक शास्त्र - सत्ता की साझेदारी\n• अर्थशास्त्र - विकास\n\n_शीघ्र ही PDF उपलब्ध होगी।_',
  'About Social Science',
  '🌍 *Social Science*\n\nThis section contains study material for History, Geography, Civics and Economics.\n\n📌 *Key Topics:*\n• History - Nationalism in India\n• Geography - Resources and Development\n• Civics - Power Sharing\n• Economics - Development\n\n_PDFs will be available soon._'
);
addPDF(social, 'नमूना अध्याय PDF', samplePDF, 'Sample Chapter PDF');

// ---- अंग्रेजी (English) ----
addText(english,
  'अंग्रेजी के बारे में',
  '📝 *अंग्रेजी*\n\nइस अनुभाग में अंग्रेजी गद्य, पद्य एवं व्याकरण की पाठ्य सामग्री मिलेगी।\n\n📌 *विषय:*\n• गद्य - A Letter to God\n• गद्य - Nelson Mandela\n• पद्य - Dust of Snow\n• व्याकरण - Tenses\n• लेखन - Letter Writing\n\n_PDF फ़ाइलें शीघ्र उपलब्ध होंगी।_',
  'About English',
  '📝 *English*\n\nThis section contains study material for English prose, poetry and grammar.\n\n📌 *Topics:*\n• Prose - A Letter to God\n• Prose - Nelson Mandela\n• Poetry - Dust of Snow\n• Grammar - Tenses\n• Writing - Letter Writing\n\n_PDFs will be available soon._'
);
addPDF(english, 'नमूना अध्याय PDF', samplePDF, 'Sample Chapter PDF');

// ---- हिंदी (Hindi) ----
addText(hindi,
  'हिंदी के बारे में',
  '📖 *हिंदी*\n\nइस अनुभाग में हिंदी गद्य, पद्य एवं व्याकरण की पाठ्य सामग्री मिलेगी।\n\n📌 *मुख्य विषय:*\n• गद्य - सूरदास के पद\n• गद्य - नेताजी का चश्मा\n• पद्य - आत्मत्राण\n• व्याकरण - संधि\n• लेखन - पत्र लेखन\n\n_PDF फ़ाइलें शीघ्र उपलब्ध होंगी।_',
  'About Hindi',
  '📖 *Hindi*\n\nThis section contains study material for Hindi prose, poetry and grammar.\n\n📌 *Key Topics:*\n• Prose - Surdas ke Pad\n• Prose - Netaji ka Chashma\n• Poetry - Aatmatran\n• Grammar - Sandhi\n• Writing - Letter Writing\n\n_PDFs will be available soon._'
);
addPDF(hindi, 'नमूना अध्याय PDF', samplePDF, 'Sample Chapter PDF');

// ============================================================
// UPSOSB के बारे में (About UPSOSB)
// ============================================================
addText(aboutUPSOSB,
  'UPSOSB के बारे में',
  '🏫 *उत्तर प्रदेश माध्यमिक शिक्षा परिषद (UPSOSB)*\n\nUPSOSB उत्तर प्रदेश में माध्यमिक शिक्षा का प्रशासनिक नियंत्रण करता है।\n\n📌 *मुख्य कार्य:*\n• कक्षा 9, 10, 11, 12 की परीक्षा आयोजित करना\n• परीक्षा परिणाम घोषित करना\n• प्रवेश पत्र जारी करना\n• शिक्षा नीति निर्धारित करना\n\n🌐 वेबसाइट: upsosb.gov.in',
  'About UPSOSB',
  '🏫 *Uttar Pradesh State Open School Board (UPSOSB)*\n\nUPSOSB manages and administers secondary education in Uttar Pradesh.\n\n📌 *Key Functions:*\n• Conducting exams for Classes 9, 10, 11, 12\n• Declaring examination results\n• Issuing admit cards\n• Determining education policy\n\n🌐 Website: upsosb.gov.in'
);
addPDF(aboutUPSOSB, 'विजन और मिशन (हिंदी)',         'PDF Hindi/विजन और मिशन.pdf',           'Vision and Mission (Hindi)');
addPDF(aboutUPSOSB, 'कार्यक्रम (हिंदी)',             'PDF Hindi/कार्यक्रम.pdf',               'Programmes (Hindi)');
addPDF(aboutUPSOSB, 'अधिनियम की पृष्ठभूमि (हिंदी)', 'PDF Hindi/अधिनियम की पृष्ठभूमि.pdf',   'Act Background (Hindi)');
addPDF(aboutUPSOSB, 'Vision and Mission (English)',   'PDF English/Vision_Mission.pdf',         'Vision and Mission (English)');
addPDF(aboutUPSOSB, 'Programmes (English)',           'PDF English/Programmes.pdf',             'Programmes (English)');
addPDF(aboutUPSOSB, 'Ordinance & Act (English)',      'PDF English/Ordinance_Act_.pdf',         'Ordinance & Act (English)');

// ============================================================
// परीक्षा समय-सारिणी (Exam Schedule)
// ============================================================
addText(examSchedule,
  'परीक्षा समय-सारिणी 2025',
  '📅 *परीक्षा समय-सारिणी 2025*\n\n*कक्षा 10 (हाई स्कूल):*\n• प्रारंभ: 22 फरवरी 2025\n• समाप्ति: 12 मार्च 2025\n\n*कक्षा 12 (इंटरमीडिएट):*\n• प्रारंभ: 22 फरवरी 2025\n• समाप्ति: 12 मार्च 2025\n\n⏰ परीक्षा समय: प्रातः 8:00 से 11:15 बजे\n\n_विस्तृत समय-सारिणी के लिए नीचे लिंक देखें।_',
  'Exam Schedule 2025',
  '📅 *Exam Schedule 2025*\n\n*Class 10 (High School):*\n• Start: 22 February 2025\n• End: 12 March 2025\n\n*Class 12 (Intermediate):*\n• Start: 22 February 2025\n• End: 12 March 2025\n\n⏰ Exam Time: 8:00 AM to 11:15 AM\n\n_See the link below for detailed schedule._'
);
addPDF(examSchedule, 'नमूना समय-सारिणी PDF', samplePDF, 'Sample Time Table PDF');
addLink(examSchedule, 'आधिकारिक UPSOSB वेबसाइट', 'https://upsosb.gov.in', 'Official UPSOSB Website');

// ============================================================
// परिणाम (Results)
// ============================================================
addText(results,
  'परिणाम की जानकारी',
  '📊 *परीक्षा परिणाम*\n\nहाई स्कूल एवं इंटरमीडिएट के परिणाम UPSOSB की आधिकारिक वेबसाइट पर घोषित किए जाते हैं।\n\n*परिणाम कैसे देखें:*\n1. नीचे दिए लिंक पर क्लिक करें\n2. अपना रोल नंबर दर्ज करें\n3. परिणाम डाउनलोड करें\n\n📌 परिणाम सामान्यतः मई-जून में आता है।',
  'Results Information',
  '📊 *Examination Results*\n\nHigh School and Intermediate results are declared on the official UPSOSB website.\n\n*How to check results:*\n1. Click the link below\n2. Enter your Roll Number\n3. Download your result\n\n📌 Results are typically announced in May-June.'
);
addLink(results, 'परिणाम देखें — upsosb.gov.in', 'https://upsosb.gov.in',   'Check Result — upsosb.gov.in');
addLink(results, 'परिणाम — upresults.nic.in',     'https://upresults.nic.in', 'Result — upresults.nic.in');

// ============================================================
// प्रवेश पत्र (Admit Card)
// ============================================================
addText(admitCard,
  'प्रवेश पत्र की जानकारी',
  '🪪 *परीक्षा प्रवेश पत्र (Admit Card)*\n\nप्रवेश पत्र परीक्षा से लगभग 2 सप्ताह पहले उपलब्ध होता है।\n\n*प्रवेश पत्र कैसे डाउनलोड करें:*\n1. आधिकारिक वेबसाइट पर जाएँ\n2. "Admit Card" अनुभाग में क्लिक करें\n3. रोल नंबर या पंजीकरण संख्या दर्ज करें\n4. डाउनलोड करें और प्रिंट करें\n\n⚠️ प्रवेश पत्र के बिना परीक्षा में बैठने की अनुमति नहीं है।',
  'Admit Card Information',
  '🪪 *Examination Admit Card*\n\nAdmit card is available approximately 2 weeks before the examination.\n\n*How to download Admit Card:*\n1. Go to the official website\n2. Click on the "Admit Card" section\n3. Enter your Roll Number or Registration Number\n4. Download and print it\n\n⚠️ Entry to exam hall is not allowed without admit card.'
);
addLink(admitCard, 'प्रवेश पत्र डाउनलोड करें', 'https://upsosb.gov.in', 'Download Admit Card');

// ============================================================
// संपर्क करें (Contact Us)
// ============================================================
addText(contactUs,
  'संपर्क जानकारी',
  '📞 *UPSOSB संपर्क जानकारी*\n\n🏢 *मुख्य कार्यालय:*\nउत्तर प्रदेश माध्यमिक शिक्षा परिषद\nप्रयागराज, उत्तर प्रदेश — 211001\n\n📞 *हेल्पलाइन:*\n0532-2623066\n0532-2622793\n\n📧 *ईमेल:*\nsecretary@upsosb.gov.in\n\n⏰ *कार्यालय समय:*\nसोमवार - शनिवार: प्रातः 10:00 - सायं 5:00 बजे',
  'Contact Information',
  '📞 *UPSOSB Contact Information*\n\n🏢 *Head Office:*\nUttar Pradesh Madhyamik Shiksha Parishad\nPrayagraj, Uttar Pradesh — 211001\n\n📞 *Helpline:*\n0532-2623066\n0532-2622793\n\n📧 *Email:*\nsecretary@upsosb.gov.in\n\n⏰ *Office Hours:*\nMonday - Saturday: 10:00 AM - 5:00 PM'
);
addLink(contactUs, 'आधिकारिक वेबसाइट', 'https://upsosb.gov.in', 'Official Website');

// ============================================================
// उपयोगी लिंक (Useful Links)
// ============================================================
addLink(usefulLinks, 'UPSOSB आधिकारिक वेबसाइट',   'https://upsosb.gov.in',         'UPSOSB Official Website');
addLink(usefulLinks, 'UP परिणाम पोर्टल',            'https://upresults.nic.in',      'UP Results Portal');
addLink(usefulLinks, 'UP छात्रवृत्ति पोर्टल',       'https://scholarship.up.gov.in', 'UP Scholarship Portal');
addLink(usefulLinks, 'डिजिलॉकर',                    'https://digilocker.gov.in',     'DigiLocker');
addLink(usefulLinks, 'राष्ट्रीय छात्रवृत्ति पोर्टल','https://scholarships.gov.in',   'National Scholarship Portal');

// ============================================================
// DONE
// ============================================================
console.log(`✅ Seed पूर्ण!`);
console.log(`   📋 मेनू   : ${db.getMenus().length}`);
console.log(`   📄 सामग्री: ${db.getAllContentCount()}`);
console.log(`   📑 PDF    : ${db.getPdfCount()}`);
