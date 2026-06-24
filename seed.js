// Database seed script — menus aur content populate karta hai
const db = require('./db');
const fs = require('fs');
const path = require('path');

// Pehle sab clear karo
const dataDir = path.join(__dirname, 'data');
fs.writeFileSync(path.join(dataDir, 'menus.json'), JSON.stringify({ items: [], nextId: 1 }, null, 2));
fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify({ items: [], nextId: 1 }, null, 2));

console.log('Database clear ho gaya, ab seed kar rahe hain...\n');

// Helper functions
function addMenu(parent_id, emoji, title, description = '') {
  return db.addMenu({ parent_id, emoji, title, description });
}
function addText(menu, title, content) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'text', title, content, file_path: '' });
}
function addPDF(menu, title, file_path) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'pdf', title, content: '', file_path });
}
function addLink(menu, title, url) {
  const menu_id = typeof menu === 'object' ? menu.id : menu;
  return db.addContent({ menu_id, type: 'link', title, content: url, file_path: '' });
}

// ============================================================
// ROOT MENUS
// ============================================================
const studyMaterial  = addMenu(null, '📚', 'Study Material', 'Sabhi vishay ki pathya samagri');
const aboutUPSOSB    = addMenu(null, '🏫', 'About UPSOSB', 'Board ke baare mein jaankari');
const examSchedule   = addMenu(null, '📅', 'Exam Schedule', 'Pariksha samay-saarini');
const results        = addMenu(null, '📊', 'Results', 'Pariksha parinaam');
const admitCard      = addMenu(null, '🪪', 'Admit Card', 'Pariksha pravesh patra');
const contactUs      = addMenu(null, '📞', 'Contact Us', 'Sampark jaankari');
const usefulLinks    = addMenu(null, '🔗', 'Useful Links', 'Mahatvapurn links');

// ============================================================
// STUDY MATERIAL → Subjects
// ============================================================
const math    = addMenu(studyMaterial.id, '🔢', 'Mathematics');
const science = addMenu(studyMaterial.id, '🔬', 'Science');
const social  = addMenu(studyMaterial.id, '🌍', 'Social Science');
const english = addMenu(studyMaterial.id, '📝', 'English');
const hindi   = addMenu(studyMaterial.id, '📖', 'Hindi');

// ---- MATHEMATICS (actual PDFs) ----
const samplePDF = 'Subject/Math/chapter1.pdf';

addPDF(math, 'Chapter 1 - Vaastavik Sankhyaen (Real Numbers)', 'Subject/Math/chapter1.pdf');
addPDF(math, 'Chapter 2 - Bahupada (Polynomials)', 'Subject/Math/chapter2.pdf');
addPDF(math, 'Chapter 3 - Do Charon ke Raikhik Samikaran', 'Subject/Math/chapter3.pdf');
addPDF(math, 'Chapter 4 - Dwigghat Samikaran (Quadratic Equations)', 'Subject/Math/chapter4.pdf');
addPDF(math, 'Chapter 5 - Samantar Shreni (Arithmetic Progressions)', 'Subject/Math/chapter5.pdf');
addPDF(math, 'Chapter 6 - Tribhuj (Triangles)', 'Subject/Math/chapter6.pdf');
addPDF(math, 'Chapter 7 - Nirdeshank Jyamiti (Coordinate Geometry)', 'Subject/Math/chapter7.pdf');
addPDF(math, 'Chapter 8 - Trikonmiti (Trigonometry)', 'Subject/Math/chapter8.pdf');
addPDF(math, 'Chapter 9 - Trikonmiti ke Anuprayog', 'Subject/Math/chapter9.pdf');
addPDF(math, 'Chapter 10 - Vritt (Circles)', 'Subject/Math/chapter10.pdf');
addPDF(math, 'Chapter 11 - Rachnaen (Constructions)', 'Subject/Math/chapter11.pdf');
addPDF(math, 'Chapter 12 - Kshetrmiti (Areas Related to Circles)', 'Subject/Math/chapter12.pdf');
addPDF(math, 'Chapter 13 - Prishthiya Kshetrafal aur Aayatan', 'Subject/Math/chapter13.pdf');
addPDF(math, 'Chapter 14 - Sankhyiki (Statistics)', 'Subject/Math/chapter14.pdf');

// ---- SCIENCE (sample text + sample PDF) ----
addText(science, 'Science ke baare mein',
  '🔬 *Vigyan (Science)*\n\nIs section mein aapko vigyan ke sabhi adhyayon ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Rasayanik Abhikriyaen\n• Aml, Kshaarak aur Lavan\n• Dhaatuen aur Adhaatuen\n• Carbon aur uske Yaugik\n• Jeev Janm Kaise Karte Hain\n• Prakash - Paraavarthan tatha Apavarthan\n\n_Jald hi PDF uplabdh hogi._');
addPDF(science, 'Sample Chapter PDF', samplePDF);

// ---- SOCIAL SCIENCE (sample text + sample PDF) ----
addText(social, 'Social Science ke baare mein',
  '🌍 *Samajik Vigyan (Social Science)*\n\nIs section mein Itihas, Bhugol, Nagarik Shastra aur Arthshastra ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Itihas - Bharat mein Rashtravad\n• Bhugol - Sansadhan aur Vikas\n• Nagarik Shastra - Satta ki Sajhedari\n• Arthshastra - Vikas\n\n_Jald hi PDF uplabdh hogi._');
addPDF(social, 'Sample Chapter PDF', samplePDF);

// ---- ENGLISH (sample text + sample PDF) ----
addText(english, 'English ke baare mein',
  '📝 *English*\n\nIs section mein English prose, poetry aur grammar ki pathya samagri milegi.\n\n📌 *Topics:*\n• Prose - A Letter to God\n• Prose - Nelson Mandela\n• Poetry - Dust of Snow\n• Grammar - Tenses\n• Writing - Letter Writing\n\n_PDF files jald uplabdh hongi._');
addPDF(english, 'Sample Chapter PDF', samplePDF);

// ---- HINDI (sample text + sample PDF) ----
addText(hindi, 'Hindi ke baare mein',
  '📖 *Hindi*\n\nIs section mein Hindi gadya, padya aur vyakaran ki pathya samagri milegi.\n\n📌 *Mukhya Vishay:*\n• Gadya - Surdas ke Pad\n• Gadya - Netaji ka Chashma\n• Padya - Aatmatran\n• Vyakaran - Sandhi\n• Lekhan - Patra Lekhan\n\n_PDF files jald uplabdh hongi._');
addPDF(hindi, 'Sample Chapter PDF', samplePDF);

// ============================================================
// ABOUT UPSOSB (actual PDFs)
// ============================================================
addText(aboutUPSOSB, 'UPSOSB ke baare mein',
  '🏫 *Uttar Pradesh Madhyamik Shiksha Parishad (UPSOSB)*\n\nUPSOSB Uttar Pradesh mein madhyamik shiksha ka prashaasanik niyantran karta hai.\n\n📌 *Mukhya Karya:*\n• Class 9, 10, 11, 12 ki pariksha aayojit karna\n• Pariksha parinaam ghoshit karna\n• Pravesh patra jaari karna\n• Shiksha neeti nirdhaarit karna\n\n🌐 Website: upsosb.gov.in');
addPDF(aboutUPSOSB, 'Vision aur Mission', 'PDF English/Vision_Mission.pdf');
addPDF(aboutUPSOSB, 'Karyakram (Programmes)', 'PDF English/Programmes.pdf');
addPDF(aboutUPSOSB, 'Adhiniyam (Act & Ordinance)', 'PDF English/Ordinance_Act_.pdf');
addPDF(aboutUPSOSB, 'विजन और मिशन (Hindi)', 'PDF Hindi/विजन और मिशन.pdf');
addPDF(aboutUPSOSB, 'कार्यक्रम (Hindi)', 'PDF Hindi/कार्यक्रम.pdf');
addPDF(aboutUPSOSB, 'अधिनियम की पृष्ठभूमि (Hindi)', 'PDF Hindi/अधिनियम की पृष्ठभूमि.pdf');

// ============================================================
// EXAM SCHEDULE
// ============================================================
addText(examSchedule, 'Pariksha Samay-Saarini',
  '📅 *Pariksha Samay-Saarini 2025*\n\n*Class 10 (High School):*\n• Prarambh: 22 February 2025\n• Samaapti: 12 March 2025\n\n*Class 12 (Intermediate):*\n• Prarambh: 22 February 2025\n• Samaapti: 12 March 2025\n\n⏰ Pariksha samay: Pratah 8:00 baje se 11:15 baje\n\n_Vistrit samay-saarini ke liye niche link dekhen._');
addPDF(examSchedule, 'Sample Time Table PDF', samplePDF);
addLink(examSchedule, 'Official UPSOSB Website', 'https://upsosb.gov.in');

// ============================================================
// RESULTS
// ============================================================
addText(results, 'Result ki Jaankari',
  '📊 *Pariksha Parinaam*\n\nHigh School aur Intermediate ke parinaam UPSOSB ki official website par ghoshit kiye jaate hain.\n\n*Result kaise dekhen:*\n1. Niche diye link par click karein\n2. Apna Roll Number darj karein\n3. Result download karein\n\n📌 Result typically May-June mein aata hai.');
addLink(results, 'Result Check Karein — upsosb.gov.in', 'https://upsosb.gov.in');
addLink(results, 'Result — upresults.nic.in', 'https://upresults.nic.in');

// ============================================================
// ADMIT CARD
// ============================================================
addText(admitCard, 'Admit Card ki Jaankari',
  '🪪 *Pariksha Pravesh Patra (Admit Card)*\n\nAdmit card pariksha se lagbhag 2 hafte pehle available hota hai.\n\n*Admit Card kaise download karein:*\n1. Official website par jaayein\n2. "Admit Card" section mein click karein\n3. Roll Number ya Registration Number darj karein\n4. Download karein aur print karein\n\n⚠️ Admit card ke bina pariksha mein baithne ki anumati nahi hai.');
addLink(admitCard, 'Admit Card Download Karein', 'https://upsosb.gov.in');

// ============================================================
// CONTACT US
// ============================================================
addText(contactUs, 'Sampark Jaankari',
  '📞 *UPSOSB Sampark Jaankari*\n\n🏢 *Mukhy Karyaalay:*\nUttar Pradesh Madhyamik Shiksha Parishad\nPrayagraj, Uttar Pradesh — 211001\n\n📞 *Helpline:*\n0532-2623066\n0532-2622793\n\n📧 *Email:*\nsecretary@upsosb.gov.in\n\n⏰ *Karyaalay samay:*\nSomvar - Shanivar: 10:00 AM - 5:00 PM\n(Sarkaari chuttiyon par band)');
addLink(contactUs, 'UPSOSB Official Website', 'https://upsosb.gov.in');

// ============================================================
// USEFUL LINKS
// ============================================================
addLink(usefulLinks, 'UPSOSB Official Website', 'https://upsosb.gov.in');
addLink(usefulLinks, 'UP Results Portal', 'https://upresults.nic.in');
addLink(usefulLinks, 'UP Scholarship Portal', 'https://scholarship.up.gov.in');
addLink(usefulLinks, 'DigiLocker — Documents', 'https://digilocker.gov.in');
addLink(usefulLinks, 'National Scholarship Portal', 'https://scholarships.gov.in');

// ============================================================
// DONE
// ============================================================
const menus = db.getMenus();
const totalContent = db.getAllContentCount();
const pdfs = db.getPdfCount();

console.log(`✅ Seed complete!`);
console.log(`   📋 Total Menus : ${menus.length}`);
console.log(`   📄 Total Content: ${totalContent}`);
console.log(`   📑 PDFs         : ${pdfs}`);
console.log(`\n🤖 Bot restart karo aur /start bhejo Telegram par!`);
