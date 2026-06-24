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
// ROOT MENUS
// ============================================================
const studyMaterial = addMenu(null, '📚', 'Study Material',  'Study Material',  'Sabhi vishay ki pathya samagri');
const aboutUPSOSB   = addMenu(null, '🏫', 'UPSOSB ke Baare Mein', 'About UPSOSB', 'Board ke baare mein jaankari');
const examSchedule  = addMenu(null, '📅', 'Pariksha Samay-Saarini', 'Exam Schedule', 'Pariksha samay-saarini');
const results       = addMenu(null, '📊', 'Parinaam',        'Results',         'Pariksha parinaam');
const admitCard     = addMenu(null, '🪪', 'Pravesh Patra',   'Admit Card',      'Pariksha pravesh patra');
const contactUs     = addMenu(null, '📞', 'Sampark Karein',  'Contact Us',      'Sampark jaankari');
const usefulLinks   = addMenu(null, '🔗', 'Upyogi Links',    'Useful Links',    'Mahatvapurn links');

// ============================================================
// STUDY MATERIAL → SUBJECTS
// ============================================================
const math    = addMenu(studyMaterial.id, '🔢', 'Ganit',            'Mathematics');
const science = addMenu(studyMaterial.id, '🔬', 'Vigyan',           'Science');
const social  = addMenu(studyMaterial.id, '🌍', 'Samajik Vigyan',   'Social Science');
const english = addMenu(studyMaterial.id, '📝', 'Angrezi',          'English');
const hindi   = addMenu(studyMaterial.id, '📖', 'Hindi',            'Hindi');

// ---- MATHEMATICS ----
addPDF(math, 'Adhyay 1 - Vaastavik Sankhyaen',          'Subject/Math/chapter1.pdf',  'Chapter 1 - Real Numbers');
addPDF(math, 'Adhyay 2 - Bahupada',                      'Subject/Math/chapter2.pdf',  'Chapter 2 - Polynomials');
addPDF(math, 'Adhyay 3 - Do Charon ke Raikhik Samikaran','Subject/Math/chapter3.pdf',  'Chapter 3 - Linear Equations in Two Variables');
addPDF(math, 'Adhyay 4 - Dwigghat Samikaran',            'Subject/Math/chapter4.pdf',  'Chapter 4 - Quadratic Equations');
addPDF(math, 'Adhyay 5 - Samantar Shreni',               'Subject/Math/chapter5.pdf',  'Chapter 5 - Arithmetic Progressions');
addPDF(math, 'Adhyay 6 - Tribhuj',                       'Subject/Math/chapter6.pdf',  'Chapter 6 - Triangles');
addPDF(math, 'Adhyay 7 - Nirdeshank Jyamiti',            'Subject/Math/chapter7.pdf',  'Chapter 7 - Coordinate Geometry');
addPDF(math, 'Adhyay 8 - Trikonmiti',                    'Subject/Math/chapter8.pdf',  'Chapter 8 - Trigonometry');
addPDF(math, 'Adhyay 9 - Trikonmiti ke Anuprayog',       'Subject/Math/chapter9.pdf',  'Chapter 9 - Applications of Trigonometry');
addPDF(math, 'Adhyay 10 - Vritt',                        'Subject/Math/chapter10.pdf', 'Chapter 10 - Circles');
addPDF(math, 'Adhyay 11 - Rachnaen',                     'Subject/Math/chapter11.pdf', 'Chapter 11 - Constructions');
addPDF(math, 'Adhyay 12 - Kshetrmiti',                   'Subject/Math/chapter12.pdf', 'Chapter 12 - Areas Related to Circles');
addPDF(math, 'Adhyay 13 - Prishthiya Kshetrafal aur Aayatan', 'Subject/Math/chapter13.pdf', 'Chapter 13 - Surface Areas and Volumes');
addPDF(math, 'Adhyay 14 - Sankhyiki',                    'Subject/Math/chapter14.pdf', 'Chapter 14 - Statistics');

// ---- SCIENCE ----
addText(science,
  'Vigyan ke Baare Mein',
  '🔬 *Vigyan (Science)*\n\nIs section mein aapko vigyan ke sabhi adhyayon ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Rasayanik Abhikriyaen\n• Aml, Kshaarak aur Lavan\n• Dhaatuen aur Adhaatuen\n• Carbon aur uske Yaugik\n• Jeev Janm Kaise Karte Hain\n• Prakash - Paraavarthan tatha Apavarthan\n\n_Jald hi PDF uplabdh hogi._',
  'About Science',
  '🔬 *Science*\n\nThis section contains study material for all Science chapters.\n\n📌 *Key Topics:*\n• Chemical Reactions & Equations\n• Acids, Bases and Salts\n• Metals and Non-metals\n• Carbon and its Compounds\n• How do Organisms Reproduce\n• Light - Reflection and Refraction\n\n_PDFs will be available soon._'
);
addPDF(science, 'Sample Adhyay PDF', samplePDF, 'Sample Chapter PDF');

// ---- SOCIAL SCIENCE ----
addText(social,
  'Samajik Vigyan ke Baare Mein',
  '🌍 *Samajik Vigyan*\n\nIs section mein Itihas, Bhugol, Nagarik Shastra aur Arthshastra ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Itihas - Bharat mein Rashtravad\n• Bhugol - Sansadhan aur Vikas\n• Nagarik Shastra - Satta ki Sajhedari\n• Arthshastra - Vikas\n\n_Jald hi PDF uplabdh hogi._',
  'About Social Science',
  '🌍 *Social Science*\n\nThis section contains study material for History, Geography, Civics and Economics.\n\n📌 *Key Topics:*\n• History - Nationalism in India\n• Geography - Resources and Development\n• Civics - Power Sharing\n• Economics - Development\n\n_PDFs will be available soon._'
);
addPDF(social, 'Sample Adhyay PDF', samplePDF, 'Sample Chapter PDF');

// ---- ENGLISH ----
addText(english,
  'English ke Baare Mein',
  '📝 *English*\n\nIs section mein English prose, poetry aur grammar ki pathya samagri milegi.\n\n📌 *Topics:*\n• Prose - A Letter to God\n• Prose - Nelson Mandela\n• Poetry - Dust of Snow\n• Grammar - Tenses\n• Writing - Letter Writing\n\n_PDF files jald uplabdh hongi._',
  'About English',
  '📝 *English*\n\nThis section contains study material for English prose, poetry and grammar.\n\n📌 *Topics:*\n• Prose - A Letter to God\n• Prose - Nelson Mandela\n• Poetry - Dust of Snow\n• Grammar - Tenses\n• Writing - Letter Writing\n\n_PDFs will be available soon._'
);
addPDF(english, 'Sample Adhyay PDF', samplePDF, 'Sample Chapter PDF');

// ---- HINDI ----
addText(hindi,
  'Hindi ke Baare Mein',
  '📖 *Hindi*\n\nIs section mein Hindi gadya, padya aur vyakaran ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Gadya - Surdas ke Pad\n• Gadya - Netaji ka Chashma\n• Padya - Aatmatran\n• Vyakaran - Sandhi\n• Lekhan - Patra Lekhan\n\n_PDF files jald uplabdh hongi._',
  'About Hindi',
  '📖 *Hindi*\n\nThis section contains study material for Hindi prose, poetry and grammar.\n\n📌 *Key Topics:*\n• Prose - Surdas ke Pad\n• Prose - Netaji ka Chashma\n• Poetry - Aatmatran\n• Grammar - Sandhi\n• Writing - Letter Writing\n\n_PDFs will be available soon._'
);
addPDF(hindi, 'Sample Adhyay PDF', samplePDF, 'Sample Chapter PDF');

// ============================================================
// ABOUT UPSOSB
// ============================================================
addText(aboutUPSOSB,
  'UPSOSB ke Baare Mein',
  '🏫 *Uttar Pradesh Madhyamik Shiksha Parishad (UPSOSB)*\n\nUPSOSB Uttar Pradesh mein madhyamik shiksha ka prashaasanik niyantran karta hai.\n\n📌 *Mukhya Karya:*\n• Class 9, 10, 11, 12 ki pariksha aayojit karna\n• Pariksha parinaam ghoshit karna\n• Pravesh patra jaari karna\n• Shiksha neeti nirdhaarit karna\n\n🌐 Website: upsosb.gov.in',
  'About UPSOSB',
  '🏫 *Uttar Pradesh State Open School Board (UPSOSB)*\n\nUPSOSB manages and administers secondary education in Uttar Pradesh.\n\n📌 *Key Functions:*\n• Conducting exams for Classes 9, 10, 11, 12\n• Declaring examination results\n• Issuing admit cards\n• Determining education policy\n\n🌐 Website: upsosb.gov.in'
);
addPDF(aboutUPSOSB, 'Vision aur Mission (Hindi)',      'PDF Hindi/विजन और मिशन.pdf',           'Vision and Mission (Hindi)');
addPDF(aboutUPSOSB, 'Karyakram (Hindi)',               'PDF Hindi/कार्यक्रम.pdf',               'Programmes (Hindi)');
addPDF(aboutUPSOSB, 'Adhiniyam ki Prishthbhumi (Hindi)', 'PDF Hindi/अधिनियम की पृष्ठभूमि.pdf', 'Act Background (Hindi)');
addPDF(aboutUPSOSB, 'Vision and Mission (English)',    'PDF English/Vision_Mission.pdf',         'Vision and Mission (English)');
addPDF(aboutUPSOSB, 'Programmes (English)',            'PDF English/Programmes.pdf',             'Programmes (English)');
addPDF(aboutUPSOSB, 'Ordinance & Act (English)',       'PDF English/Ordinance_Act_.pdf',         'Ordinance & Act (English)');

// ============================================================
// EXAM SCHEDULE
// ============================================================
addText(examSchedule,
  'Pariksha Samay-Saarini 2025',
  '📅 *Pariksha Samay-Saarini 2025*\n\n*Class 10 (High School):*\n• Prarambh: 22 February 2025\n• Samaapti: 12 March 2025\n\n*Class 12 (Intermediate):*\n• Prarambh: 22 February 2025\n• Samaapti: 12 March 2025\n\n⏰ Pariksha Samay: Pratah 8:00 se 11:15\n\n_Vistrit samay-saarini ke liye niche link dekhen._',
  'Exam Schedule 2025',
  '📅 *Exam Schedule 2025*\n\n*Class 10 (High School):*\n• Start: 22 February 2025\n• End: 12 March 2025\n\n*Class 12 (Intermediate):*\n• Start: 22 February 2025\n• End: 12 March 2025\n\n⏰ Exam Time: 8:00 AM to 11:15 AM\n\n_See the link below for detailed schedule._'
);
addPDF(examSchedule, 'Sample Time Table PDF', samplePDF, 'Sample Time Table PDF');
addLink(examSchedule, 'Official UPSOSB Website', 'https://upsosb.gov.in', 'Official UPSOSB Website');

// ============================================================
// RESULTS
// ============================================================
addText(results,
  'Parinaam ki Jaankari',
  '📊 *Pariksha Parinaam*\n\nHigh School aur Intermediate ke parinaam UPSOSB ki official website par ghoshit kiye jaate hain.\n\n*Parinaam kaise dekhen:*\n1. Niche diye link par click karein\n2. Apna Roll Number darj karein\n3. Parinaam download karein\n\n📌 Parinaam typically May-June mein aata hai.',
  'Results Information',
  '📊 *Examination Results*\n\nHigh School and Intermediate results are declared on the official UPSOSB website.\n\n*How to check results:*\n1. Click the link below\n2. Enter your Roll Number\n3. Download your result\n\n📌 Results are typically announced in May-June.'
);
addLink(results, 'Parinaam Dekhen — upsosb.gov.in', 'https://upsosb.gov.in',   'Check Result — upsosb.gov.in');
addLink(results, 'Parinaam — upresults.nic.in',      'https://upresults.nic.in', 'Result — upresults.nic.in');

// ============================================================
// ADMIT CARD
// ============================================================
addText(admitCard,
  'Pravesh Patra ki Jaankari',
  '🪪 *Pariksha Pravesh Patra (Admit Card)*\n\nAdmit card pariksha se lagbhag 2 hafte pehle available hota hai.\n\n*Admit Card kaise download karein:*\n1. Official website par jaayein\n2. "Admit Card" section mein click karein\n3. Roll Number ya Registration Number darj karein\n4. Download karein aur print karein\n\n⚠️ Admit card ke bina pariksha mein baithne ki anumati nahi hai.',
  'Admit Card Information',
  '🪪 *Examination Admit Card*\n\nAdmit card is available approximately 2 weeks before the examination.\n\n*How to download Admit Card:*\n1. Go to the official website\n2. Click on the "Admit Card" section\n3. Enter your Roll Number or Registration Number\n4. Download and print it\n\n⚠️ Admission to examination hall is not allowed without admit card.'
);
addLink(admitCard, 'Pravesh Patra Download Karein', 'https://upsosb.gov.in', 'Download Admit Card');

// ============================================================
// CONTACT US
// ============================================================
addText(contactUs,
  'Sampark Jaankari',
  '📞 *UPSOSB Sampark Jaankari*\n\n🏢 *Mukhy Karyaalay:*\nUttar Pradesh Madhyamik Shiksha Parishad\nPrayagraj, Uttar Pradesh — 211001\n\n📞 *Helpline:*\n0532-2623066\n0532-2622793\n\n📧 *Email:*\nsecretary@upsosb.gov.in\n\n⏰ *Karyaalay Samay:*\nSomvar - Shanivar: 10:00 AM - 5:00 PM',
  'Contact Information',
  '📞 *UPSOSB Contact Information*\n\n🏢 *Head Office:*\nUttar Pradesh Madhyamik Shiksha Parishad\nPrayagraj, Uttar Pradesh — 211001\n\n📞 *Helpline:*\n0532-2623066\n0532-2622793\n\n📧 *Email:*\nsecretary@upsosb.gov.in\n\n⏰ *Office Hours:*\nMonday - Saturday: 10:00 AM - 5:00 PM'
);
addLink(contactUs, 'UPSOSB Official Website', 'https://upsosb.gov.in', 'UPSOSB Official Website');

// ============================================================
// USEFUL LINKS
// ============================================================
addLink(usefulLinks, 'UPSOSB Official Website',    'https://upsosb.gov.in',            'UPSOSB Official Website');
addLink(usefulLinks, 'UP Results Portal',           'https://upresults.nic.in',         'UP Results Portal');
addLink(usefulLinks, 'UP Scholarship Portal',       'https://scholarship.up.gov.in',    'UP Scholarship Portal');
addLink(usefulLinks, 'DigiLocker',                  'https://digilocker.gov.in',        'DigiLocker');
addLink(usefulLinks, 'National Scholarship Portal', 'https://scholarships.gov.in',      'National Scholarship Portal');

// ============================================================
// DONE
// ============================================================
console.log(`✅ Seed complete!`);
console.log(`   📋 Menus  : ${db.getMenus().length}`);
console.log(`   📄 Content: ${db.getAllContentCount()}`);
console.log(`   📑 PDFs   : ${db.getPdfCount()}`);
