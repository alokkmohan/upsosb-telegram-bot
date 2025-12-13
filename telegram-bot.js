const TelegramBot = require('node-telegram-bot-api');

// Bot Token from @BotFather
const token = '8557217217:AAHwgY6QgFyuCF4Nz1ylIqz0-_JOUmxZmoU';

// Bot configuration with better timeout handling
const bot = new TelegramBot(token, { 
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    },
    request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        },
        proxy: false
    }
});

// User state tracking
const userState = {};

// ============================================
// STUDENT DATABASE - AUTHENTICATION
// ============================================
// CURRENT: Mock database for testing/demo
// FUTURE: Replace with MySQL/PostgreSQL/MongoDB connection
//
// For SQL Integration Example:
// const mysql = require('mysql2/promise');
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'your_user',
//   password: 'your_password',
//   database: 'upsosb_db'
// });
//
// async function getStudentData(regNum, dob) {
//   const [rows] = await pool.execute(
//     'SELECT * FROM students WHERE registration_number = ? AND dob = ?',
//     [regNum, dob]
//   );
//   return rows[0];
// }
// ============================================

const studentDatabase = {
  // Format: registrationNumber: { name, class, dob, district, subjects }
  
  // 🧪 PRIMARY DEMO/TESTING ACCOUNT - Main demo credentials
  "12345": { 
    name: "Rahul Kumar", 
    class: 10, 
    dob: "01/01/2000",
    district: "Agra",
    subjects: ["Math", "Science", "Social Science", "English", "Hindi"],
    allSubjectsAccess: true  // Has access to all subjects
  },
  
  // Class 10 Students - Various subjects combinations
  "10001": { 
    name: "Priya Singh", 
    class: 10, 
    dob: "15/08/2008",
    district: "Prayagraj",
    subjects: ["Math", "Science", "Social Science", "English", "Hindi"],
    allSubjectsAccess: true
  },
  "10002": { 
    name: "Amit Sharma", 
    class: 10, 
    dob: "20/06/2009",
    district: "Lucknow",
    subjects: ["Math", "Science", "English", "Hindi"],
    allSubjectsAccess: true
  },
  "10003": { 
    name: "Neha Verma", 
    class: 10, 
    dob: "10/03/2009",
    district: "Varanasi",
    subjects: ["Math", "Science", "Social Science", "Hindi"],
    allSubjectsAccess: true
  },
  "10004": { 
    name: "Rohan Gupta", 
    class: 10, 
    dob: "25/11/2008",
    district: "Kanpur",
    subjects: ["Math", "Science", "Social Science", "English"],
    allSubjectsAccess: true
  },
  
  // Class 11 Students - Science Stream
  "11001": { 
    name: "Anjali Mishra", 
    class: 11, 
    dob: "05/01/2008",
    district: "Mathura",
    subjects: ["Math", "Science", "English"],
    stream: "Science",
    allSubjectsAccess: true
  },
  "11002": { 
    name: "Vikram Yadav", 
    class: 11, 
    dob: "12/09/2007",
    district: "Meerut",
    subjects: ["Math", "Science", "Hindi"],
    stream: "Science",
    allSubjectsAccess: true
  },
  
  // Class 11 Students - Commerce Stream
  "11101": { 
    name: "Shreya Agarwal", 
    class: 11, 
    dob: "18/07/2007",
    district: "Agra",
    subjects: ["Math", "English"],
    stream: "Commerce",
    allSubjectsAccess: false
  },
  
  // Class 11 Students - Arts Stream
  "11201": { 
    name: "Karan Joshi", 
    class: 11, 
    dob: "22/04/2008",
    district: "Aligarh",
    subjects: ["Social Science", "English", "Hindi"],
    stream: "Arts",
    allSubjectsAccess: false
  },
  
  // Class 12 Students - Science Stream
  "12001": { 
    name: "Divya Pandey", 
    class: 12, 
    dob: "08/02/2006",
    district: "Prayagraj",
    subjects: ["Math", "Science", "English"],
    stream: "Science",
    allSubjectsAccess: true
  },
  "12002": { 
    name: "Sanjay Kumar", 
    class: 12, 
    dob: "30/10/2006",
    district: "Ghaziabad",
    subjects: ["Math", "Science", "Hindi"],
    stream: "Science",
    allSubjectsAccess: true
  },
  
  // Class 12 Students - Commerce Stream
  "12101": { 
    name: "Pooja Saxena", 
    class: 12, 
    dob: "14/05/2006",
    district: "Noida",
    subjects: ["Math", "English"],
    stream: "Commerce",
    allSubjectsAccess: false
  },
  
  // Class 12 Students - Arts Stream
  "12201": { 
    name: "Arjun Tiwari", 
    class: 12, 
    dob: "03/12/2006",
    district: "Bareilly",
    subjects: ["Social Science", "English", "Hindi"],
    stream: "Arts",
    allSubjectsAccess: false
  },
  
  // Additional Class 9 Students
  "9001": { 
    name: "Riya Chauhan", 
    class: 9, 
    dob: "17/09/2009",
    district: "Moradabad",
    subjects: ["Math", "Science", "Social Science", "English", "Hindi"],
    allSubjectsAccess: true
  },
  "9002": { 
    name: "Aditya Singh", 
    class: 9, 
    dob: "28/01/2010",
    district: "Muzaffarnagar",
    subjects: ["Math", "Science", "English", "Hindi"],
    allSubjectsAccess: true
  }
  
  // TODO: Connect to actual database when ready
  // This object will be replaced by database queries
  // 
  // Database Schema Suggestion:
  // CREATE TABLE students (
  //   id INT PRIMARY KEY AUTO_INCREMENT,
  //   registration_number VARCHAR(20) UNIQUE NOT NULL,
  //   name VARCHAR(100) NOT NULL,
  //   class INT NOT NULL,
  //   dob DATE NOT NULL,
  //   district VARCHAR(50),
  //   stream VARCHAR(20),
  //   all_subjects_access BOOLEAN DEFAULT true,
  //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // );
  //
  // CREATE TABLE student_subjects (
  //   student_id INT,
  //   subject_name VARCHAR(50),
  //   FOREIGN KEY (student_id) REFERENCES students(id)
  // );
};

// Mathematics Chapter Mapping
const mathChapters = {
  "complete": {
    name: "📖 संपूर्ण पुस्तक (Complete Book)",
    nameEng: "📖 Complete Book",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/complete-book.pdf"
  },
  "ch1": {
    name: "1️⃣ अध्याय 1 - वास्तविक संख्याएँ",
    nameEng: "1️⃣ Chapter 1 - Real Numbers",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter1.pdf"
  },
  "ch2": {
    name: "2️⃣ अध्याय 2 - बहुपद",
    nameEng: "2️⃣ Chapter 2 - Polynomials",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter2.pdf"
  },
  "ch3": {
    name: "3️⃣ अध्याय 3 - दो चरों वाले रैखिक समीकरण",
    nameEng: "3️⃣ Chapter 3 - Linear Equations",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter3.pdf"
  },
  "ch4": {
    name: "4️⃣ अध्याय 4 - द्विघात समीकरण",
    nameEng: "4️⃣ Chapter 4 - Quadratic Equations",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter4.pdf"
  },
  "ch5": {
    name: "5️⃣ अध्याय 5 - समांतर श्रेणी",
    nameEng: "5️⃣ Chapter 5 - Arithmetic Progressions",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter5.pdf"
  },
  "ch6": {
    name: "6️⃣ अध्याय 6 - त्रिभुज",
    nameEng: "6️⃣ Chapter 6 - Triangles",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter6.pdf"
  },
  "ch7": {
    name: "7️⃣ अध्याय 7 - निर्देशांक ज्यामिति",
    nameEng: "7️⃣ Chapter 7 - Coordinate Geometry",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter7.pdf"
  },
  "ch8": {
    name: "8️⃣ अध्याय 8 - त्रिकोणमिति",
    nameEng: "8️⃣ Chapter 8 - Trigonometry",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter8.pdf"
  },
  "ch9": {
    name: "9️⃣ अध्याय 9 - त्रिकोणमिति के अनुप्रयोग",
    nameEng: "9️⃣ Chapter 9 - Applications of Trigonometry",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter9.pdf"
  },
  "ch10": {
    name: "🔟 अध्याय 10 - वृत्त",
    nameEng: "🔟 Chapter 10 - Circles",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter10.pdf"
  },
  "ch11": {
    name: "1️⃣1️⃣ अध्याय 11 - रचनाएँ",
    nameEng: "1️⃣1️⃣ Chapter 11 - Constructions",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter11.pdf"
  },
  "ch12": {
    name: "1️⃣2️⃣ अध्याय 12 - क्षेत्रमिति",
    nameEng: "1️⃣2️⃣ Chapter 12 - Areas Related to Circles",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter12.pdf"
  },
  "ch13": {
    name: "1️⃣3️⃣ अध्याय 13 - पृष्ठीय क्षेत्रफल और आयतन",
    nameEng: "1️⃣3️⃣ Chapter 13 - Surface Areas and Volumes",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter13.pdf"
  },
  "ch14": {
    name: "1️⃣4️⃣ अध्याय 14 - सांख्यिकी",
    nameEng: "1️⃣4️⃣ Chapter 14 - Statistics",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter14.pdf"
  },
  "ch15": {
    name: "1️⃣5️⃣ अध्याय 15 - प्रायिकता",
    nameEng: "1️⃣5️⃣ Chapter 15 - Probability",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Math/chapter15.pdf"
  }
};

// Science Chapter Mapping
const scienceChapters = {
  "complete": {
    name: "📖 संपूर्ण पुस्तक (Complete Book)",
    nameEng: "📖 Complete Book",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/complete-book.pdf"
  },
  "ch1": {
    name: "1️⃣ रासायनिक अभिक्रियाएँ एवं समीकरण",
    nameEng: "1️⃣ Chemical Reactions and Equations",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter1.pdf"
  },
  "ch2": {
    name: "2️⃣ अम्ल, क्षारक एवं लवण",
    nameEng: "2️⃣ Acids, Bases and Salts",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter2.pdf"
  },
  "ch3": {
    name: "3️⃣ धातु एवं अधातु",
    nameEng: "3️⃣ Metals and Non-metals",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter3.pdf"
  },
  "ch4": {
    name: "4️⃣ कार्बन एवं उसके यौगिक",
    nameEng: "4️⃣ Carbon and its Compounds",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter4.pdf"
  },
  "ch5": {
    name: "5️⃣ जैव प्रक्रम",
    nameEng: "5️⃣ Life Processes",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter5.pdf"
  },
  "ch6": {
    name: "6️⃣ नियंत्रण एवं समन्वय",
    nameEng: "6️⃣ Control and Coordination",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter6.pdf"
  },
  "ch7": {
    name: "7️⃣ जीव जनन कैसे करते हैं",
    nameEng: "7️⃣ How do Organisms Reproduce",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter7.pdf"
  },
  "ch8": {
    name: "8️⃣ आनुवंशिकता एवं जैव विकास",
    nameEng: "8️⃣ Heredity and Evolution",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter8.pdf"
  },
  "ch9": {
    name: "9️⃣ प्रकाश - परावर्तन तथा अपवर्तन",
    nameEng: "9️⃣ Light - Reflection and Refraction",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter9.pdf"
  },
  "ch10": {
    name: "🔟 मानव नेत्र तथा रंगबिरंगा संसार",
    nameEng: "🔟 Human Eye and Colourful World",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter10.pdf"
  },
  "ch11": {
    name: "1️⃣1️⃣ विद्युत",
    nameEng: "1️⃣1️⃣ Electricity",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter11.pdf"
  },
  "ch12": {
    name: "1️⃣2️⃣ विद्युत धारा के चुंबकीय प्रभाव",
    nameEng: "1️⃣2️⃣ Magnetic Effects of Electric Current",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter12.pdf"
  },
  "ch13": {
    name: "1️⃣3️⃣ हमारा पर्यावरण",
    nameEng: "1️⃣3️⃣ Our Environment",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Science/chapter13.pdf"
  }
};

// Social Science Chapter Mapping
const socialChapters = {
  "complete": {
    name: "📖 संपूर्ण पुस्तक (Complete Book)",
    nameEng: "📖 Complete Book",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/complete-book.pdf"
  },
  "history1": {
    name: "📜 इतिहास - यूरोप में राष्ट्रवाद",
    nameEng: "📜 History - Nationalism in Europe",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/history1.pdf"
  },
  "history2": {
    name: "📜 इतिहास - भारत में राष्ट्रवाद",
    nameEng: "📜 History - Nationalism in India",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/history2.pdf"
  },
  "history3": {
    name: "📜 इतिहास - भूमंडलीकृत विश्व",
    nameEng: "📜 History - Making of Global World",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/history3.pdf"
  },
  "geo1": {
    name: "🌍 भूगोल - संसाधन एवं विकास",
    nameEng: "🌍 Geography - Resources and Development",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/geo1.pdf"
  },
  "geo2": {
    name: "🌍 भूगोल - वन एवं वन्य जीव संसाधन",
    nameEng: "🌍 Geography - Forest and Wildlife",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/geo2.pdf"
  },
  "geo3": {
    name: "🌍 भूगोल - जल संसाधन",
    nameEng: "🌍 Geography - Water Resources",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/geo3.pdf"
  },
  "geo4": {
    name: "🌍 भूगोल - कृषि",
    nameEng: "🌍 Geography - Agriculture",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/geo4.pdf"
  },
  "geo5": {
    name: "🌍 भूगोल - खनिज और ऊर्जा संसाधन",
    nameEng: "🌍 Geography - Minerals and Energy",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/geo5.pdf"
  },
  "civic1": {
    name: "⚖️ नागरिक शास्त्र - सत्ता की साझेदारी",
    nameEng: "⚖️ Civics - Power Sharing",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/civic1.pdf"
  },
  "civic2": {
    name: "⚖️ नागरिक शास्त्र - संघवाद",
    nameEng: "⚖️ Civics - Federalism",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/civic2.pdf"
  },
  "eco1": {
    name: "💰 अर्थशास्त्र - विकास",
    nameEng: "💰 Economics - Development",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/eco1.pdf"
  },
  "eco2": {
    name: "💰 अर्थशास्त्र - भारतीय अर्थव्यवस्था के क्षेत्र",
    nameEng: "💰 Economics - Sectors of Indian Economy",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/eco2.pdf"
  },
  "eco3": {
    name: "💰 अर्थशास्त्र - मुद्रा और साख",
    nameEng: "💰 Economics - Money and Credit",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Social/eco3.pdf"
  }
};

// English Chapter Mapping
const englishChapters = {
  "complete": {
    name: "📖 संपूर्ण पुस्तक (Complete Book)",
    nameEng: "📖 Complete Book",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/complete-book.pdf"
  },
  "prose1": {
    name: "📝 A Letter to God",
    nameEng: "📝 A Letter to God",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/prose1.pdf"
  },
  "prose2": {
    name: "📝 Nelson Mandela: Long Walk to Freedom",
    nameEng: "📝 Nelson Mandela: Long Walk to Freedom",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/prose2.pdf"
  },
  "prose3": {
    name: "📝 Two Stories about Flying",
    nameEng: "📝 Two Stories about Flying",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/prose3.pdf"
  },
  "prose4": {
    name: "📝 From the Diary of Anne Frank",
    nameEng: "📝 From the Diary of Anne Frank",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/prose4.pdf"
  },
  "prose5": {
    name: "📝 The Hundred Dresses",
    nameEng: "📝 The Hundred Dresses",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/prose5.pdf"
  },
  "poem1": {
    name: "✒️ Dust of Snow",
    nameEng: "✒️ Dust of Snow",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/poem1.pdf"
  },
  "poem2": {
    name: "✒️ Fire and Ice",
    nameEng: "✒️ Fire and Ice",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/poem2.pdf"
  },
  "poem3": {
    name: "✒️ A Tiger in the Zoo",
    nameEng: "✒️ A Tiger in the Zoo",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/poem3.pdf"
  },
  "grammar1": {
    name: "📚 Grammar - Tenses",
    nameEng: "📚 Grammar - Tenses",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/grammar1.pdf"
  },
  "grammar2": {
    name: "📚 Grammar - Active and Passive Voice",
    nameEng: "📚 Grammar - Active and Passive Voice",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/grammar2.pdf"
  },
  "writing1": {
    name: "✍️ Letter Writing",
    nameEng: "✍️ Letter Writing",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/writing1.pdf"
  },
  "writing2": {
    name: "✍️ Essay Writing",
    nameEng: "✍️ Essay Writing",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/English/writing2.pdf"
  }
};

// Hindi Chapter Mapping
const hindiChapters = {
  "complete": {
    name: "📖 संपूर्ण पुस्तक (Complete Book)",
    nameEng: "📖 Complete Book",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/complete-book.pdf"
  },
  "prose1": {
    name: "📝 सूरदास के पद",
    nameEng: "📝 Surdas Ke Pad",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/prose1.pdf"
  },
  "prose2": {
    name: "📝 राम-लक्ष्मण-परशुराम संवाद",
    nameEng: "📝 Ram-Lakshman-Parshuram Samvad",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/prose2.pdf"
  },
  "prose3": {
    name: "📝 नेताजी का चश्मा",
    nameEng: "📝 Netaji Ka Chashma",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/prose3.pdf"
  },
  "prose4": {
    name: "📝 बालगोबिन भगत",
    nameEng: "📝 Balgobin Bhagat",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/prose4.pdf"
  },
  "prose5": {
    name: "📝 लखनवी अंदाज़",
    nameEng: "📝 Lakhnavi Andaaz",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/prose5.pdf"
  },
  "poem1": {
    name: "✒️ आत्मत्राण",
    nameEng: "✒️ Aatmatran",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/poem1.pdf"
  },
  "poem2": {
    name: "✒️ मनुष्यता",
    nameEng: "✒️ Manushyata",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/poem2.pdf"
  },
  "poem3": {
    name: "✒️ पर्वत प्रदेश में पावस",
    nameEng: "✒️ Parvat Pradesh Mein Pavas",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/poem3.pdf"
  },
  "grammar1": {
    name: "📚 व्याकरण - संधि",
    nameEng: "📚 Grammar - Sandhi",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/grammar1.pdf"
  },
  "grammar2": {
    name: "📚 व्याकरण - समास",
    nameEng: "📚 Grammar - Samas",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/grammar2.pdf"
  },
  "writing1": {
    name: "✍️ पत्र लेखन",
    nameEng: "✍️ Letter Writing",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/writing1.pdf"
  },
  "writing2": {
    name: "✍️ निबंध लेखन",
    nameEng: "✍️ Essay Writing",
    path: "/home/alok-mohan/WhatsApp Boat/Subject/Hindi/writing2.pdf"
  }
};

// District Centers Data - All 75 Districts
const districtCenters = {
  "Agra": "📍 *Agra District - Nodal Centers:*\n\n1. Rajkiya Inter College, Agra\n   📞 9458277750, 9997562965, 9458487865\n\n2. Gandhi Smarak Kisan Inter College, Kirawali\n   📞 9410019045\n\n3. Bajaj Rashtriya Inter College, Fatehpur Sikri\n   📞 9412811898\n\n4. Janta Inter College, Kheragarh\n   📞 7017070402, 9410839156\n\n5. Janta Inter College, Etmadpur\n   📞 9690144539\n\n6. Janta Inter College, Fatehabad\n   📞 9760722687\n\n7. Bhadawar Inter College, Bah\n   📞 9411403943\n\n8. Kedarnath Sexaria Balika Inter College, Belunganj\n   📞 9412455983",
  
  "Firozabad": "📍 *Firozabad District - Nodal Centers:*\n\n1. P.D. Jain Inter College, Firozabad\n   📞 9690357084\n\n2. Lok Rashtriya Inter College, Jasrana\n   📞 9720948711\n\n3. Mahatma Gandhi Kanya Inter College\n   📞 9837144905\n\n4. Rajkiya Balika Inter College, Tundla\n   📞 9259453535\n\n5. B.D.M. Kanya Inter College, Shikohabad\n   📞 8218849759, 7895248431",
  
  "Mainpuri": "📍 *Mainpuri District - Nodal Centers:*\n\n1. Rajkiya Inter College, Mainpuri\n   📞 9410299409, 9456415340\n\n2. National Inter College, Bhogaon\n   📞 9412897970\n\n3. Jain Inter College, Karhal\n   📞 9458277750\n\n4. Rajkiya Balika Inter College\n   📞 8630595129\n\n5. Kasturba Gandhi Kanya Inter College, Bhogaon\n   📞 9997890999",
  
  "Mathura": "📍 *Mathura District - Nodal Centers:*\n\n1. Rajkiya Inter College, Mathura\n   📞 9259057625\n\n2. Braj Adarsh Inter College, Mat\n   📞 9719864101\n\n3. Radha Bihari Inter College, Barsana\n   📞 9012124762\n\n4. Shri Hazarimal Somani Nagar Palika Inter College, Vrindavan\n   📞 8077267818\n\n5. Chameli Devi Khandelwal Balika Inter College\n   📞 9412829139, 9634522738\n\n6. Nagar Palika Kanya Inter College, Kosi Kalan\n   📞 9582134900",
  
  "Aligarh": "📍 *Aligarh District - Nodal Centers:*\n\n1. Nauranghi Lal Rajkiya Inter College\n   📞 9412510035\n\n2. K.M.B. Inter College, Atrauli\n   📞 9997282920\n\n3. Khair Inter College, Khair\n   📞 6396177330\n\n4. Lakshmi Raj Inter College, Gabhana\n   📞 9720670143\n\n5. S.D. Singh Inter College, Iglas\n   📞 9027537702\n\n6. Udai Singh Kanya Inter College\n   📞 9412820691",
  
  "Hathras": "📍 *Hathras District - Nodal Centers:*\n\n1. Saraswati Inter College\n   📞 9411415170\n\n2. G.S. Hindu Inter College, Sikandrarao\n   📞 8273404461, 8273404681\n\n3. Sadabad Inter College\n   📞 9897019750\n\n4. Arya Kanya Inter College, Sikandrarao\n   📞 9319529555",
  
  "Etah": "📍 *Etah District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 8650341743\n\n2. D.A.V. Inter College, Aliganj\n   📞 9412861120\n\n3. M.G. Inter College, Jalesar\n   📞 9837560470\n\n4. Rajkiya Balika Inter College\n   📞 9411931912\n\n5. Rajkiya Balika Inter College, Jalesar\n   📞 9761303709",
  
  "Kasganj": "📍 *Kasganj District - Nodal Centers:*\n\n1. Azad Gandhi Inter College\n   📞 9758495501, 8791453625\n\n2. Shri Bhagwat Rashtriya Inter College, Patiyali\n   📞 9457805200\n\n3. Rajkiya Balika Inter College\n   📞 9412181588",
  
  "Bulandshahr": "📍 *Bulandshahr District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 7530917780\n\n2. L.D.A.B. Inter College, Anupshahr\n   📞 9412610726\n\n3. Kuber Inter College, Dibai\n   📞 8126372148\n\n4. S.M.J.E.C. Inter College, Khurja\n   📞 9457184330\n\n5. Agrasen Inter College, Sikandrabad\n   📞 9319284455",
  
  "Ghaziabad": "📍 *Ghaziabad District - Nodal Centers:*\n\n1. Rajkiya Inter College, Nandgram\n   📞 7838335816, 8920305549\n\n2. P.B.A.S. Inter College, Modinagar\n   📞 9411039377, 8218807802\n\n3. Rajkiya Kanya Inter College, Vijay Nagar\n   📞 9457584687, 8448050465",
  
  "Hapur": "📍 *Hapur District - Nodal Centers:*\n\n1. Diwan Inter College\n   📞 9259445388\n\n2. Marwad Inter College, Pilkhuwa\n   📞 9410638028",
  
  "Gautam Buddha Nagar": "📍 *Gautam Buddha Nagar District - Nodal Centers:*\n\n1. Mihirbhoj Inter College, Dadri\n   📞 9411802772",
  
  "Meerut": "📍 *Meerut District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9411667740\n\n2. Krishak Inter College, Mawana\n   📞 9412630824, 9536828800\n\n3. Saint Charles Inter College, Sardhana\n   📞 8193092809, 8923530505\n\n4. Devoti Devi Virendra Kumar Rajkiya Kanya Inter College, Madhavpuram\n   📞 9990133369\n\n5. Saint Joseph Kanya Inter College, Sardhana\n   📞 9410856562, 7500191554",
  
  "Baghpat": "📍 *Baghpat District - Nodal Centers:*\n\n1. Yamuna Inter College\n   📞 9451564974\n\n2. Janta Vedic Inter College, Baraut\n   📞 9411667488, 9411263511\n\n3. Jain Sthanakwasi Kanya Inter College, Baraut\n   📞 9456662831\n\n4. Adarsh Inter College, Daula\n   📞 9837610061",
  
  "Muzaffarnagar": "📍 *Muzaffarnagar District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9411813767\n\n2. D.A.V. Inter College, Budhana\n   📞 7668692662\n\n3. D.A.V. Inter College, Jansath\n   📞 8218568191\n\n4. Janta Inter College, Gangdhari, Khatauli\n   📞 8218870869\n\n5. Sanatan Dharm Inter College, Mirapur\n   📞 9634035623",
  
  "Shamli": "📍 *Shamli District - Nodal Centers:*\n\n1. Public Inter College, Kairana\n   📞 9412889992\n\n2. D.A.V. Inter College, Un\n   📞 9719962097\n\n3. Jain Kanya Inter College\n   📞 9410647229\n\n4. Rajkiya Balika Inter College, Kandhla\n   📞 8273242551",
  
  "Saharanpur": "📍 *Saharanpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9358485140\n\n2. D.C. Jain Inter College, Sarsawan\n   📞 9720075179\n\n3. K.L.G.M. Inter College, Nakud\n   📞 9410469606\n\n4. H.A.V. Inter College, Deoband\n   📞 8837571455\n\n5. Rajkiya Inter College, Panchkuwan\n   📞 8411670448",
  
  "Moradabad": "📍 *Moradabad District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9058183344, 9027676358\n\n2. S.D.H. Inter College, Thakurdwara\n   📞 9719709394, 9997983962\n\n3. Arya Kanya Inter College\n   📞 7599349542, 9634197032",
  
  "Sambhal": "📍 *Sambhal District - Nodal Centers:*\n\n1. Hindu Inter College\n   📞 7983427146, 9411858569\n\n2. S.M. Inter College, Chandausi\n   📞 9837501701\n\n3. Bhartiya Kanya Inter College, Chandausi\n   📞 9870612983",
  
  "Amroha": "📍 *Amroha (J.P. Nagar) District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9897541346, 9837379980\n\n2. Gandhi Vidyalaya Inter College, Dhanaura\n   📞 9837758640, 9410613126\n\n3. Smt. Sukhdevi Inter College, Hasanpur\n   📞 9412633254, 9412635001\n\n4. Rajkiya Balika Inter College\n   📞 9027260047, 8755403674",
  
  "Bijnor": "📍 *Bijnor District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9410846298, 9457841225\n\n2. Rajkiya Inter College, Najibabad\n   📞 7579114682\n\n3. M.M. Inter College, Nagina\n   📞 9058586348, 9897411748\n\n4. K.M. Inter College, Dhampur\n   📞 9412489524\n\n5. M.M. Inter College, Chandpur\n   📞 9411012250, 7895139598",
  
  "Rampur": "📍 *Rampur District - Nodal Centers:*\n\n1. Rajkiya Raja Inter College\n   📞 9412151336, 7906680263\n\n2. Rajkiya Hamid Inter College\n   📞 9411997828\n\n3. Rajkiya Inter College, Shahabad\n   📞 9412872082, 9759093384\n\n4. Arya Vidyalaya Inter College, Milak\n   📞 7520124978, 9410466238\n\n5. D.A.V. Inter College, Vishardnagar, Bilaspur\n   📞 9719118477, 9412362257",
  
  "Bareilly": "📍 *Bareilly District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9412603663\n\n2. M.G.M. Inter College, Bahedi\n   📞 7983471624\n\n3. Jai Prakash Narayan Inter College, Nawabganj\n   📞 9411219683, 8273119641\n\n4. Shri Subhash Inter College, Aonla\n   📞 9411004862\n\n5. Chaudhary Rajeshwar Singh Kisan Inter College, Faridpur\n   📞 9412606337",
  
  "Badaun": "📍 *Badaun District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9411009026\n\n2. Madanlal Inter College, Bisauli\n   📞 9456400464\n\n3. Pramod Inter College, Sahaswan\n   📞 9412602075\n\n4. Rajkiya Balika Inter College\n   📞 8755791831",
  
  "Shahjahanpur": "📍 *Shahjahanpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9412151192\n\n2. Puwaiya Inter College, Puwaiya\n   📞 9918609788\n\n3. Seth Siyaram Inter College, Jalalabad\n   📞 9198219040\n\n4. R.P.M. Inter College, Tilhar\n\n5. Rajkiya Balika Inter College\n   📞 9451386486",
  
  "Pilibhit": "📍 *Pilibhit District - Nodal Centers:*\n\n1. Drummond Rajkiya Inter College\n   📞 7088887664\n\n2. Public Inter College, Puranpur\n   📞 9084645939\n\n3. S.R.M. Inter College, Bisalpur\n   📞 9412554905\n\n4. Rajkiya Balika Inter College\n   📞 9412846564",
  
  "Kheri": "📍 *Kheri District - Nodal Centers:*\n\n1. Rajkiya Inter College, Lakhimpur Kheri\n   📞 9984384534\n\n2. J.P. Inter College, Mohammadi\n   📞 9450376780\n\n3. Jila Panchayat Inter College, Nighasan\n   📞 9450795999\n\n4. B.B.L.C. Inter College, Khamaria\n   📞 8476920672\n\n5. Public Inter College, Gola Gokarnath\n   📞 9450221357",
  
  "Sitapur": "📍 *Sitapur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9453666650\n\n2. Gandhi Inter College, Sidhauli\n   📞 9454119723\n\n3. H.R.D. Inter College, Biswan\n   📞 8576076122\n\n4. Kalvin Inter College, Mahmudabad\n   📞 9454671307\n\n5. M.D. Inter College, Mishrikh\n   📞 9415525729",
  
  "Hardoi": "📍 *Hardoi District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9455108166\n\n2. Baba Manshannath Inter College, Bilgram\n   📞 9336278403\n\n3. Basant Lal Inter College, Shahabad\n   📞 8299789910\n\n4. Bhagwan Buddha Inter College, Sandila\n   📞 9415378557, 9026480123\n\n5. Veni Madhav Kanya Inter College\n   📞 7905454921",
  
  "Lucknow": "📍 *Lucknow District - Nodal Centers:*\n\n1. Rajkiya Jubilee Inter College\n   📞 9411089316\n\n2. Rajkiya Inter College, Husainabad\n   📞 9415180708\n\n3. Mahatma Gandhi Inter College, Malihabad\n   📞 7607587999, 9450648028\n\n4. Harichand Inter College, Sadar\n   📞 9621809426, 9415579684\n\n5. Rajkiya Inter College, Nishatganj\n   📞 9450064108",
  
  "Unnao": "📍 *Unnao District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9598893358\n\n2. Mahatma Gandhi Inter College, Safipur\n   📞 9935613988\n\n3. Bharatiya Adarsh Anglo-Sanskrit Inter College, Purwa\n   📞 9264922350\n\n4. Gandhi Mission H.M.K.D. Inter College, Mohan\n   📞 9458097703\n\n5. Rajkiya Balika Inter College\n   📞 8881073609",
  
  "Raebareli": "📍 *Raebareli District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9889323365\n\n2. Har Narayan Inter College, Unchahar\n   📞 9415631985\n\n3. Baiswara Inter College, Lalganj\n   📞 9161011999\n\n4. Raja Chandrachud Singh Vidyapeeth Inter College, Maharajganj\n   📞 8090645270\n\n5. Sarvoday Vidyapeeth Inter College, Salon\n   📞 9795125724",
  
  "Kanpur Nagar": "📍 *Kanpur Nagar District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9580444036\n\n2. Bilhaur Inter College, Bilhaur\n   📞 8081242086, 9793113968\n\n3. Gandhi Vidyapeeth Inter College, Ghatampur\n   📞 9451983534\n\n4. Purna Devi Khanna Balika Inter College\n   📞 7054937499",
  
  "Kanpur Dehat": "📍 *Kanpur Dehat (Ramabai Nagar) District - Nodal Centers:*\n\n1. Akbarpur Inter College, Akbarpur\n   📞 9935000363\n\n2. B.M.S. Inter College, Katheti\n   📞 9919911425\n\n3. Rajkiya Balika Inter College, Pukhrayan\n   📞 8423049538",
  
  "Farrukhabad": "📍 *Farrukhabad District - Nodal Centers:*\n\n1. Rajkiya Inter College, Fatehgarh\n   📞 9450109285\n\n2. S.N. Inter College, Kaimganj\n   📞 7275873035\n\n3. Dayanand Inter College, Amritpur\n   📞 9456697678\n\n4. Rajkiya Balika Inter College, Fatehgarh\n   📞 9473989175",
  
  "Etawah": "📍 *Etawah District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 6398266425\n\n2. Jan Sahyogi Inter College, Mori\n   📞 9456003290\n\n3. Shri Amitabh Bachchan Rajkiya Inter College, Saifai\n   📞 9412865050\n\n4. Hindu Vidyalaya Inter College, Jaswantnagar\n   📞 9720297418\n\n5. Rajkiya Balika Inter College\n   📞 9410057559",
  
  "Kannauj": "📍 *Kannauj District - Nodal Centers:*\n\n1. K.K. Inter College\n   📞 9936939766\n\n2. Hira Lal B.N. Inter College, Chibramau\n   📞 6394451070\n\n3. Durga Narayan Inter College, Tirwa\n   📞 9415474760\n\n4. J.P. Girls Inter College\n   📞 9839856370",
  
  "Auraiya": "📍 *Auraiya District - Nodal Centers:*\n\n1. Vedic Technical Inter College, Dibiyapur\n   📞 9719934766\n\n2. Public Inter College, Bidhuna\n   📞 9412540371\n\n3. Shri Janta Inter College, Ajitmal\n   📞 9719712148\n\n4. Nagar Palika Inter College\n   📞 9457141881",
  
  "Jalaun": "📍 *Jalaun District - Nodal Centers:*\n\n1. Rajkiya Inter College, Orai\n   📞 7398394493, 9628398359\n\n2. Chhatrasal Inter College, Jalaun\n   📞 9415592138\n\n3. M.S.V. Inter College, Kalpi\n   📞 9621463916\n\n4. Rajkiya Inter College, Bangra\n   📞 9198817875\n\n5. Rajkiya Balika Inter College, Orai\n   📞 9452603581",
  
  "Jhansi": "📍 *Jhansi District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9451935757\n\n2. Adarsh Inter College, Moth\n   📞 9793708686\n\n3. Rajkiya Inter College, Samthar\n   📞 6386773245\n\n4. Khair Inter College, Gursarai\n   📞 9839476872\n\n5. Suraj Prasad Rajkiya Balika Inter College\n   📞 7678896906",
  
  "Lalitpur": "📍 *Lalitpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 8090157907\n\n2. Madan Singh Inter College, Talbehat\n   📞 9358705666\n\n3. Shanti Niketan Inter College, Mahrauni\n   📞 8887819800\n\n4. Rajkiya Balika Inter College\n   📞 9453855963",
  
  "Hamirpur": "📍 *Hamirpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9451185997\n\n2. Brahmanand Inter College, Rath\n   📞 9450997158\n\n3. National Inter College, Maudaha\n   📞 9453403898\n\n4. Rajkiya Balika Inter College\n   📞 9452878757",
  
  "Mahoba": "📍 *Mahoba District - Nodal Centers:*\n\n1. D.A.V. Inter College\n   📞 9450040280, 9450274478\n\n2. Rajkiya Inter College, Charkhari\n   📞 7376585422\n\n3. Janatra Inter College, Kulpahar\n   📞 9936238427\n\n4. Rajkiya Balika Inter College\n   📞 9557412296",
  
  "Banda": "📍 *Banda District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9455097467\n\n2. Pt. Jwala Prasad Inter College, Baberu\n   📞 9450166858\n\n3. Raj Kumar Inter College, Naraini\n   📞 9450167726\n\n4. Brahma Vigyan Inter College, Atarra\n   📞 9451430396\n\n5. Rajkiya Balika Inter College\n   📞 9628298460",
  
  "Chitrakoot": "📍 *Chitrakoot District - Nodal Centers:*\n\n1. Seth Radhakrishna Poddar Inter College, Chitrakoot Dham\n   📞 9956122058\n\n2. Chitrakoot Inter College, Karwi\n   📞 9450224969\n\n3. Ratan Nath Inter College, Rasin\n   📞 9450370193\n\n4. Rajkiya Balika Inter College, Karwi\n   📞 9451084809",
  
  "Pratapgarh": "📍 *Pratapgarh District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9335174681\n\n2. S.P. Inter College, Kunda\n   📞 9450839112\n\n3. Ramraj Inter College, Patti\n   📞 9455576899\n\n4. Ram Anjor Inter College, Lalganj\n   📞 9554134766\n\n5. Rajkiya Balika Inter College\n   📞 9919926466",
  
  "Prayagraj": "📍 *Prayagraj District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9415630258, 9450592934\n\n2. Mewalal Ayodhya Prasad Gupta Smarak Inter College, Soraon\n   📞 9450606974\n\n3. Madan Mohan Malviya Inter College, Karchana\n   📞 9305812340\n\n4. Vijay Lakshmi Inter College, Phulpur\n   📞 9450582446\n\n5. Raja Kamlakar Inter College, Shankargarh\n   📞 9838703264",
  
  "Fatehpur": "📍 *Fatehpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9450129390\n\n2. Dayanand Inter College, Bindki\n   📞 9792058523\n\n3. Inter College, Budaon\n   📞 7068305308\n\n4. Rajkiya Balika Inter College\n   📞 8604500532",
  
  "Kaushambi": "📍 *Kaushambi District - Nodal Centers:*\n\n1. Durga Devi Inter College, Osa Manjhanpur\n   📞 8858549422, 9839370307\n\n2. S.A.V. Inter College, Saini\n   📞 9936666191\n\n3. Shri Man Singh Inter College, Alipur Jeeta\n   📞 9956611622\n\n4. Hubalal Inter College, Bharwari\n   📞 8318587858",
  
  "Sultanpur": "📍 *Sultanpur District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9454267780\n\n2. National Inter College, Kadipur\n   📞 9506402588\n\n3. Sarvoday Inter College, Lambhua\n   📞 9454851698\n\n4. Kesh Kumari Rajkiya Balika Inter College\n   📞 9415185134",
  
  "Amethi": "📍 *Amethi District - Nodal Centers:*\n\n1. Subhash Pashupati Nath Inter College, Tilaoi\n   📞 9415740540\n\n2. A.H. Inter College, Musafirkhana\n   📞 9598897831\n\n3. Rajkiya Balika Inter College\n   📞 9807836516",
  
  "Ayodhya": "📍 *Ayodhya District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 7905541567\n\n2. Bharati Inter College, Bikapur\n   📞 9415721110\n\n3. Dr. Badri Prasad Pandey Smarak Sarvoday Inter College, Ramganj\n   📞 9415720495\n\n4. Hindu Inter College, Rudauli\n   📞 7355174025\n\n5. Rajkiya Balika Inter College\n   📞 9839983006",
  
  "Barabanki": "📍 *Barabanki District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9415787406\n\n2. Union Inter College, Ramnagar\n   📞 7376949066\n\n3. Sarvajanik Vidyalaya Inter College, Haidargarh\n   📞 9415063198\n\n4. Rajkiya Inter College, Sirauli Gauspur\n   📞 9450743633\n\n5. Rajkiya Balika Inter College\n   📞 8429215831",
  
  "Ambedkar Nagar": "📍 *Ambedkar Nagar District - Nodal Centers:*\n\n1. B.N. Inter College, Akbarpur\n   📞 9450404707\n\n2. Hober Triloknath Inter College, Tanda\n   📞 6388118163\n\n3. Rajkiya Balika Inter College, Akbarpur\n   📞 9956462706",
  
  "Bahraich": "📍 *Bahraich District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 7408554347, 9451029735\n\n2. Hukum Singh Inter College, Kaiserganj\n   📞 8887624750\n\n3. Shriram Janaki Inter College, Rupaidiha\n   📞 9026029518\n\n4. Rajkiya Inter College, Lakhyakala\n   📞 7007346595\n\n5. Rajkiya Balika Inter College\n   📞 7068502255",
  
  "Gonda": "📍 *Gonda District - Nodal Centers:*\n\n1. Fakhruddin Ali Ahmed Rajkiya Inter College\n   📞 9451029735\n\n2. Kanhaiya Lal Inter College, Colonelganj\n   📞 8874747700\n\n3. M.D.B.S. Inter College, Balesar\n   📞 7571095515\n\n4. A.P. Inter College, Mankapur\n   📞 9453104379\n\n5. Rajkiya Balika Inter College\n   📞 9415188137",
  
  "Shravasti": "📍 *Shravasti District - Nodal Centers:*\n\n1. Alakhendra Inter College, Bhinga\n   📞 8005167856",
  
  "Balrampur": "📍 *Balrampur District - Nodal Centers:*\n\n1. Mohammed Yusuf Usmani Inter College, Utraula\n   📞 9415055804\n\n2. M.P.P. Inter College\n   📞 9415701895\n\n3. Swatantra Bharat Inter College, Tulsipur\n   📞 9565954974",
  
  "Basti": "📍 *Basti District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9450575768\n\n2. Kisan Inter College, Bhanpur\n   📞 918300071\n\n3. National Inter College, Harraiya\n   📞 9628424000\n\n4. M.P.K. Inter College, Harraiya\n   📞 9415539466\n\n5. Rajkiya Balika Inter College\n   📞 9838650892",
  
  "Siddharth Nagar": "📍 *Siddharth Nagar District - Nodal Centers:*\n\n1. Shivpati Inter College, Shohratgarh\n   📞 05544-263053\n\n2. Tilak Inter College, Bansi\n   📞 8318873932\n\n3. Peoples Inter College, Dumariaganj\n   📞 9450549714\n\n4. Rajkiya Balika Inter College, Dumariaganj\n   📞 9918397412",
  
  "Sant Kabir Nagar": "📍 *Sant Kabir Nagar District - Nodal Centers:*\n\n1. Krishak Aud. Pal Inter College, Hariharpur\n\n2. H.R. Inter College, Khalilabad\n   📞 9439456989\n\n3. Jagatguru Shankaracharya Inter College, Mehdawal\n   📞 9452902573",
  
  "Gorakhpur": "📍 *Gorakhpur District - Nodal Centers:*\n\n1. Rajkiya Jubilee Inter College\n   📞 9415823761\n\n2. Gandhi Inter College, Mahuapar Badhalganj\n   📞 9695078809\n\n3. S.K. Inter College, Kaudiram\n   📞 9519309295, 9415259359\n\n4. J.P. Inter College, Campierganj\n   📞 7007445897\n\n5. Bhola Ram Maskara Inter College, Sahjanwa\n   📞 7007669181",
  
  "Maharajganj": "📍 *Maharajganj District - Nodal Centers:*\n\n1. Maharajganj Inter College\n   📞 9936085038\n\n2. S.A.J. Inter College, Anandnagar\n   📞 9450433743",
  
  "Deoria": "📍 *Deoria District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9415260885\n\n2. Bapu Inter College, Salempur\n   📞 7355763775, 9415672896\n\n3. B.R.D. Inter College, Bhatparrani\n   📞 9451062291\n\n4. D.N. Inter College, Rudrapur\n   📞 9415715839\n\n5. Kasturba Gandhi Rajkiya Balika Inter College\n   📞 9935646329",
  
  "Kushinagar": "📍 *Kushinagar District - Nodal Centers:*\n\n1. Goswami Tulsidas Inter College, Padrauna\n   📞 7398609411, 7392921937\n\n2. F.M. Inter College, Tamkuhi Raj\n   📞 9415271074, 7905494091",
  
  "Azamgarh": "📍 *Azamgarh District - Nodal Centers:*\n\n1. Shivali National Inter College\n   📞 9956115053\n\n2. Udyog Vidyalaya Inter College, Koilsa\n   📞 9450596714\n\n3. Inter College, Kaptanganj\n   📞 9451500612\n\n4. S.K.G.N. Inter College, Lalganj\n   📞 9450828807\n\n5. Rajkiya Balika Inter College\n   📞 9452647308",
  
  "Mau": "📍 *Mau District - Nodal Centers:*\n\n1. D.A.V. Inter College\n   📞 9450653994\n\n2. Victory Inter College, Dohari Ghat\n   📞 9450479783\n\n3. Sarvoday Inter College, Ghosi\n   📞 9452068305\n\n4. Shri Dadhiwal Inter College, Raini\n   📞 9984411222",
  
  "Ballia": "📍 *Ballia District - Nodal Centers:*\n\n1. Rajkiya Inter College\n   📞 9454788166, 9532626366\n\n2. Bansdeeh Inter College, Bansdeeh\n   📞 9532433706\n\n3. Narhaji Inter College, Narhi Rasda\n   📞 7398512317\n\n4. Ramnath Pathak Intermediate College, Muraipatti, Lalganj\n   📞 9452048350",
  
  "Jaunpur": "📍 *Jaunpur District - Nodal Centers:*\n\n1. T.D. Inter College\n   📞 7408235003\n\n2. S.B. Inter College, Badlapur\n   📞 9598942506\n\n3. St. Thomas Inter College, Shahganj\n   📞 9839438950\n\n4. Sarvajanik Inter College, Mungrabad Shahpur\n   📞 9415660432\n\n5. Rajkiya Balika Inter College\n   📞 9453475230",
  
  "Ghazipur": "📍 *Ghazipur District - Nodal Centers:*\n\n1. Rajkiya City Inter College\n   📞 9454503672, 9415374970\n\n2. Town National Inter College, Saidpur\n   📞 9451781931, 9415255917\n\n3. Shri Motilal Nehru Inter College, Basupur\n   📞 9415281029\n\n4. Rajkiya Balika Inter College\n   📞 9415241686",
  
  "Varanasi": "📍 *Varanasi District - Nodal Centers:*\n\n1. Rajkiya Queens Inter College\n   📞 9450720427, 9415370160\n\n2. Subhadra Kumar Inter College, Basni\n   📞 9452348133\n\n3. Rajkiya Balika Inter College\n   📞 7905536207, 8707606834",
  
  "Chandauli": "📍 *Chandauli District - Nodal Centers:*\n\n1. Mahendra Technical Inter College\n   📞 9889177934\n\n2. A.N.R. Inter College, Chakiya\n   📞 9452804270, 9452889467\n\n3. Jila Parishad K. Inter College\n   📞 8922914940\n\n4. Jila Panchayat K. Inter College, Chakiya\n   📞 7348649693",
  
  "Bhadohi": "📍 *Bhadohi (Sant Ravidas Nagar) District - Nodal Centers:*\n\n1. V.N.R. Inter College, Gyanpur\n   📞 9450254691, 9451711541\n\n2. Indra Bahadur Singh National Inter College\n   📞 9450711902, 9450088692\n\n3. Jila Parishad K. Inter College, Gyanpur\n   📞 8601696724\n\n4. Gyandevi Balika Inter College\n   📞 9451890032",
  
  "Mirzapur": "📍 *Mirzapur District - Nodal Centers:*\n\n1. Ram Inter College\n   📞 9415899919, 8299585226\n\n2. Shanti Niketan Inter College, Pachokhra\n   📞 9415683230, 7271974907\n\n3. P.D.N.D. Inter College, Chunar\n   📞 9415675256\n\n4. Bapu Uprodh Inter College, Lalganj\n   📞 7522018047\n\n5. Ra. Ba. Inter College, Chunar\n   📞 7275296255",
  
  "Sonbhadra": "📍 *Sonbhadra District - Nodal Centers:*\n\n1. Raja Sharda Mahesh Inter College, Robertsganj\n   📞 9451806160, 9452790500\n\n2. Rajkiya Inter College, Ghorawal\n   📞 9936524921, 9452253177\n\n3. Obra Inter College, Obra\n   📞 9415900709, 8004083188\n\n4. Rajkiya Inter College, Duddhi\n   📞 9598670345\n\n5. Rajkiya Inter College, Pipri\n   📞 9532573307"
};

// Get all district names
const getAllDistrictNames = () => Object.keys(districtCenters).sort();

console.log('🤖 UPSOSB Bot chal raha hai...');

// ============================================
// HELPER FUNCTIONS
// ============================================

function sendWelcomeMessage(chatId, userName) {
    userState[chatId] = { screen: 'language' };
    
    const welcomeMsg = `
╔═══════════════════════════════╗
║                                                        ║
║         🎓 UPSOSB Portal 🎓          ║
║   उत्तर प्रदेश राज्य मुक्त विद्यालय परिषद   ║
║                                                        ║
╚═══════════════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

नमस्ते ${userName}! 👋
Welcome ${userName}!

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

कृपया अपनी भाषा चुनें
Please Select Your Language

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🇮🇳 हिंदी', callback_data: 'lang_hindi' }],
                [{ text: '🇬🇧 English', callback_data: 'lang_english' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, welcomeMsg, options);
}

// ============================================
// MAIN MENUS
// ============================================

function showHindiMainMenu(chatId) {
    const menuMsg = `
╔══════════════════════╗
║                                           ║
║      📚  मुख्य मेन्यू  📚       ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 सेवाएं एवं जानकारी
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

कृपया विकल्प चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'ℹ️ हमारे बारे में', callback_data: 'h_about' }],
                [{ text: '📝 प्रवेश जानकारी', callback_data: 'h_admission' }],
                [{ text: '📅 महत्वपूर्ण तिथियां', callback_data: 'h_dates' }],
                [{ text: '📋 परीक्षा', callback_data: 'h_exams' }],
                [{ text: '🎯 परिणाम', callback_data: 'h_results' }],
                [{ text: '🏢 नोडल सेंटर', callback_data: 'h_centers' }],
                [{ text: '📖 अध्ययन सामग्री', callback_data: 'h_study' }],
                [{ text: '❓ FAQ', callback_data: 'h_faq' }],
                [{ text: '📞 संपर्क करें', callback_data: 'h_contact' }],
                [{ text: '🌐 भाषा बदलें', callback_data: 'change_lang' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

function showEnglishMainMenu(chatId) {
    const menuMsg = `
╔══════════════════════╗
║                                           ║
║       📚  MAIN MENU  📚        ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 Services & Information
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

Please select an option:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'ℹ️ About Us', callback_data: 'e_about' }],
                [{ text: '📝 Admission Info', callback_data: 'e_admission' }],
                [{ text: '📅 Important Dates', callback_data: 'e_dates' }],
                [{ text: '📋 Exams', callback_data: 'e_exams' }],
                [{ text: '🎯 Results', callback_data: 'e_results' }],
                [{ text: '🏢 Nodal Centers', callback_data: 'e_centers' }],
                [{ text: '📖 Study Material', callback_data: 'e_study' }],
                [{ text: '❓ FAQ', callback_data: 'e_faq' }],
                [{ text: '📞 Contact Us', callback_data: 'e_contact' }],
                [{ text: '🌐 Change Language', callback_data: 'change_lang' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

// ============================================
// ABOUT US MODULE
// ============================================

function showHindiAboutUs(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║   ℹ️  हमारे बारे में  ℹ️      ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 उत्तर प्रदेश राज्य
 मुक्त विद्यालय शिक्षा बोर्ड
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

जानकारी चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎯 विजन/मिशन', callback_data: 'h_vision' }],
                [{ text: '📜 अध्यादेश/अधिनियम', callback_data: 'h_ordinance' }],
                [{ text: '📚 कार्यक्रम', callback_data: 'h_programmes' }],
                [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishAboutUs(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║      ℹ️  ABOUT US  ℹ️           ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 Uttar Pradesh State
 Open School Board
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

Select information:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎯 Vision/Mission', callback_data: 'e_vision' }],
                [{ text: '📜 Ordinance/Act', callback_data: 'e_ordinance' }],
                [{ text: '📚 Programmes', callback_data: 'e_programmes' }],
                [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Vision/Mission Functions
function showHindiVision(chatId) {
    const msg = `
╔══════════════════════╗
║    🎯 विजन/मिशन 🎯        ║
╚══════════════════════╝

📖 यूपीएसओएसबी का उद्देश्य समाज के सभी वर्गों के लिए शिक्षा को सुलभ बनाना है।

✨ हम समावेशी और लचीली शिक्षा प्रणाली के माध्यम से सामाजिक-आर्थिक विकास में योगदान करते हैं।

🎓 हमारा लक्ष्य गुणवत्तापूर्ण शिक्षा प्रदान करना और सभी को सीखने का अवसर देना है।

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 विस्तृत जानकारी के लिए PDF डाउनलोड करें`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 PDF डाउनलोड करें', callback_data: 'h_vision_pdf' }],
                [{ text: '⬅️ हमारे बारे में', callback_data: 'h_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishVision(chatId) {
    const msg = `
╔══════════════════════╗
║   🎯 VISION/MISSION 🎯    ║
╚══════════════════════╝

📖 UPSOSB aims to make education accessible to all sections of society.

✨ We contribute to socio-economic development through an inclusive and flexible education system.

🎓 Our goal is to provide quality education and learning opportunities for everyone.

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 Download PDF for detailed information`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 Download PDF', callback_data: 'e_vision_pdf' }],
                [{ text: '⬅️ About Us', callback_data: 'e_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Ordinance/Act Functions
function showHindiOrdinance(chatId) {
    const msg = `
╔══════════════════════╗
║   📜 अध्यादेश/अधिनियम 📜   ║
╚══════════════════════╝

📖 यूपीएसओएसबी की स्थापना उत्तर प्रदेश राज्य मुक्त विद्यालय शिक्षा बोर्ड अधिनियम, 2008 के तहत की गई थी।

🏛️ यह एक स्वायत्त संस्था है जो मुक्त और दूरस्थ शिक्षा को बढ़ावा देती है।

⚖️ बोर्ड राज्य सरकार द्वारा मान्यता प्राप्त है और कानूनी रूप से अधिकृत है।

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 विस्तृत जानकारी के लिए PDF डाउनलोड करें`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 PDF डाउनलोड करें', callback_data: 'h_ordinance_pdf' }],
                [{ text: '⬅️ हमारे बारे में', callback_data: 'h_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishOrdinance(chatId) {
    const msg = `
╔══════════════════════╗
║   📜 ORDINANCE/ACT 📜     ║
╚══════════════════════╝

📖 UPSOSB was established under the UP State Open School Board Act, 2008.

🏛️ It is an autonomous institution that promotes open and distance education.

⚖️ The Board is recognized by the State Government and legally authorized.

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 Download PDF for detailed information`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 Download PDF', callback_data: 'e_ordinance_pdf' }],
                [{ text: '⬅️ About Us', callback_data: 'e_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Programmes Functions
function showHindiProgrammes(chatId) {
    const msg = `
╔══════════════════════╗
║     📚 कार्यक्रम 📚         ║
╚══════════════════════╝

📖 यूपीएसओएसबी कक्षा 10, 11, 12 और व्यावसायिक शिक्षा कार्यक्रम संचालित करता है।

✨ सभी पाठ्यक्रम लचीले और मान्यता प्राप्त हैं।

🎓 छात्र अपनी सुविधा के अनुसार अध्ययन कर सकते हैं।

📋 व्यावसायिक पाठ्यक्रम रोजगार के अवसर बढ़ाते हैं।

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 विस्तृत जानकारी के लिए PDF डाउनलोड करें`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 PDF डाउनलोड करें', callback_data: 'h_programmes_pdf' }],
                [{ text: '⬅️ हमारे बारे में', callback_data: 'h_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishProgrammes(chatId) {
    const msg = `
╔══════════════════════╗
║    📚 PROGRAMMES 📚       ║
╚══════════════════════╝

📖 UPSOSB conducts Class 10, 11, 12 and vocational education programmes.

✨ All courses are flexible and recognized.

🎓 Students can study at their own convenience.

📋 Vocational courses enhance employment opportunities.

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📄 Download PDF for detailed information`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📥 Download PDF', callback_data: 'e_programmes_pdf' }],
                [{ text: '⬅️ About Us', callback_data: 'e_about' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// ============================================
// ADMISSION MODULE
// ============================================

function showHindiAdmission(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║    📝  प्रवेश जानकारी  📝     ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 नए प्रवेश के लिए
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

अपनी कक्षा चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📘 कक्षा 9वीं प्रवेश', callback_data: 'h_adm_9' }],
                [{ text: '📗 कक्षा 10वीं प्रवेश', callback_data: 'h_adm_10' }],
                [{ text: '📙 कक्षा 11वीं प्रवेश', callback_data: 'h_adm_11' }],
                [{ text: '📕 कक्षा 12वीं प्रवेश', callback_data: 'h_adm_12' }],
                [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishAdmission(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║   📝  ADMISSION INFO  📝    ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 New Admissions Open
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

Choose your class:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📘 Class 9th Admission', callback_data: 'e_adm_9' }],
                [{ text: '📗 Class 10th Admission', callback_data: 'e_adm_10' }],
                [{ text: '📙 Class 11th Admission', callback_data: 'e_adm_11' }],
                [{ text: '📕 Class 12th Admission', callback_data: 'e_adm_12' }],
                [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// ============================================
// STUDENT SERVICES
// ============================================

function showHindiStudentServices(chatId) {
    const msg = `╔═══════════════════════╗
║    👨‍🎓 छात्र सेवाएं        ║
╚═══════════════════════╝

अपनी सेवा चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎫 एडमिट कार्ड डाउनलोड', callback_data: 'h_admit_card' }],
                [{ text: '📋 रोल नंबर से जानकारी', callback_data: 'h_roll_info' }],
                [{ text: '📜 प्रमाणपत्र स्थिति', callback_data: 'h_cert_status' }],
                [{ text: '🔄 माइग्रेशन प्रक्रिया', callback_data: 'h_migration' }],
                [{ text: '📃 स्थानांतरण प्रमाणपत्र', callback_data: 'h_tc' }],
                [{ text: '📝 शिकायत दर्ज करें', callback_data: 'h_complaint' }],
                [{ text: '⬅️ वापस जाएं', callback_data: 'back_main_h' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// ============================================
// BOT COMMANDS
// ============================================

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'User';
    sendWelcomeMessage(chatId, userName);
});

bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    
    const infoMsg = `╔════════════════════════╗
║   ℹ️  BOT INFORMATION   ║
╚════════════════════════╝

🤖 UP State Open School Board Bot

🔗 Bot Link: t.me/upsosb_bot

📚 Features:
   • Admission Information
   • Course Details  
   • Exam Updates
   • Results & Certificates
   • Study Material
   • Fee Payment Info
   • Nodal Centers
   • Student Services

💬 Commands:
   /start - Start bot
   /info - Bot info
   /help - Help menu
   /services - Student services

📞 24/7 Active Support!`;
    
    bot.sendMessage(chatId, infoMsg);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMsg = `╔════════════════════════╗
║      🆘 HELP MENU       ║
╚════════════════════════╝

📝 Main Features:
   • Admission info for classes 9-12
   • Course & subject details
   • Exam schedules & admit cards
   • Result checking
   • Study material download
   • Fee payment methods
   • Nearest center finder

👨‍🎓 Student Services:
   • Roll number details
   • Admit card download
   • Certificate status
   • Migration process
   • TC application

🔄 Navigation:
   • Click buttons to navigate
   • Use "Back" to return
   • Type /start to restart

💡 Quick Start:
   1. Choose language
   2. Select service
   3. Follow instructions

Need help? Type /contact`;
    
    bot.sendMessage(chatId, helpMsg);
});

bot.onText(/\/services/, (msg) => {
    const chatId = msg.chat.id;
    const lang = userState[chatId]?.language || 'hindi';
    
    if (lang === 'hindi') {
        showHindiStudentServices(chatId);
    } else {
        showEnglishStudentServices(chatId);
    }
});

bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    
    const contactMsg = `╔════════════════════════╗
║    📞 CONTACT DETAILS   ║
╚════════════════════════╝

🏢 UP State Open School Board

📍 Address:
   Sector-2, Vistar
   Lucknow, Uttar Pradesh

📞 Helpline:
   0522-2234567
   0522-2234568

📱 Toll Free:
   1800-123-4567

📧 Email:
   info@upsosb.org
   helpdesk@upsosb.org

🌐 Website:
   www.upsosb.org

⏰ Office Hours:
   Mon-Fri: 10:00 AM - 5:00 PM
   Sat: 10:00 AM - 2:00 PM
   Sun: Closed`;
    
    bot.sendMessage(chatId, contactMsg);
});

// Handle text messages
bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('/')) {
        return;
    }
    
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.trim() : '';
    const textLower = text.toLowerCase();
    const userName = msg.from.first_name || 'User';
    
    const greetings = ['hi', 'hello', 'hey', 'start', 'namaste', 'namaskar', 'हाय', 'हेलो', 'नमस्ते', 'नमस्कार'];
    
    // Handle greetings
    if (greetings.includes(textLower)) {
        sendWelcomeMessage(chatId, userName);
        return;
    }
    
    // Handle Study Material Login Flow
    const state = userState[chatId];
    
    if (state && state.screen === 'study_login_reg') {
        // User sent registration number
        const regNum = text;
        
        if (studentDatabase[regNum]) {
            // Valid registration, ask for DOB
            userState[chatId].regNum = regNum;
            userState[chatId].screen = 'study_login_dob';
            
            bot.sendMessage(chatId, 
                state.lang === 'hindi' ?
                `✅ पंजीकरण संख्या मिली!\n\n📅 अब अपनी *जन्म तिथि* भेजें\n\n📝 Format: DD/MM/YYYY\n(उदाहरण: 15/08/2010)` :
                `✅ Registration Number found!\n\n📅 Now send your *Date of Birth*\n\n📝 Format: DD/MM/YYYY\n(Example: 15/08/2010)`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: state.lang === 'hindi' ? '⬅️ रद्द करें' : '⬅️ Cancel', 
                              callback_data: state.lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
                        ]]
                    }
                }
            );
        } else {
            bot.sendMessage(chatId, 
                state.lang === 'hindi' ?
                `❌ *गलत पंजीकरण संख्या*\n\n_Invalid Registration Number_\n\n💡 कृपया पुनः प्रयास करें\n_Please try again_` :
                `❌ *Invalid Registration Number*\n\n_गलत पंजीकरण संख्या_\n\n💡 Please try again\n_कृपया पुनः प्रयास करें_`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: state.lang === 'hindi' ? '⬅️ मुख्य मेन्यू' : '⬅️ Main Menu', 
                              callback_data: state.lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
                        ]]
                    }
                }
            );
        }
        return;
    }
    
    if (state && state.screen === 'study_login_dob') {
        // User sent DOB
        const dob = text;
        const regNum = state.regNum;
        const studentData = studentDatabase[regNum];
        
        if (studentData && studentData.dob === dob) {
            // Successful login
            bot.sendMessage(chatId, 
                state.lang === 'hindi' ?
                `✅ *लॉगिन सफल!*\n\n👤 नाम: ${studentData.name}\n📚 कक्षा: ${studentData.class}` :
                `✅ *Login Successful!*\n\n👤 Name: ${studentData.name}\n📚 Class: ${studentData.class}`,
                { parse_mode: 'Markdown' }
            );
            
            // Show subject selection
            setTimeout(() => {
                showSubjectSelection(chatId, studentData, state.lang);
            }, 1000);
        } else {
            bot.sendMessage(chatId, 
                state.lang === 'hindi' ?
                `❌ *गलत जन्म तिथि*\n\n_Invalid Date of Birth_\n\n💡 Format: DD/MM/YYYY\n(उदाहरण: 01/01/2000)\n\nकृपया पुनः प्रयास करें\n_Please try again_` :
                `❌ *Invalid Date of Birth*\n\n_गलत जन्म तिथि_\n\n💡 Format: DD/MM/YYYY\n(Example: 01/01/2000)\n\nPlease try again\n_कृपया पुनः प्रयास करें_`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: state.lang === 'hindi' ? '⬅️ रद्द करें' : '⬅️ Cancel', 
                              callback_data: state.lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
                        ]]
                    }
                }
            );
        }
        return;
    }
});

// ============================================
// CALLBACK QUERY HANDLERS
// ============================================

bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    
    bot.answerCallbackQuery(callbackQuery.id);
    
    // Language Selection
    if (data === 'lang_hindi') {
        userState[chatId] = { screen: 'main_menu', language: 'hindi' };
        showHindiMainMenu(chatId);
    }
    else if (data === 'lang_english') {
        userState[chatId] = { screen: 'main_menu', language: 'english' };
        showEnglishMainMenu(chatId);
    }
    else if (data === 'change_lang') {
        sendWelcomeMessage(chatId, msg.from.first_name || 'User');
    }
    
    // Hindi Main Menu
    else if (data === 'h_about') {
        showHindiAboutUs(chatId);
    }
    else if (data === 'h_admission') {
        showHindiAdmission(chatId);
    }
    else if (data === 'h_courses') {
        showHindiCourses(chatId);
    }
    else if (data === 'h_exams') {
        showHindiExams(chatId);
    }
    else if (data === 'h_results') {
        showHindiResults(chatId);
    }
    else if (data === 'h_centers') {
        showHindiCenters(chatId);
    }
    else if (data === 'h_study') {
        showHindiStudyMaterial(chatId);
    }
    else if (data === 'h_fee') {
        showHindiFeePayment(chatId);
    }
    else if (data === 'h_faq') {
        showHindiFAQ(chatId);
    }
    else if (data === 'h_contact') {
        bot.sendMessage(chatId, getContactDetails('hindi'), {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🗺️ Google Maps पर देखें', url: 'https://www.google.com/maps/dir//Patrachar+shiksha+sansthan+G.I.C+LECTURE+ROOM+1+Lowther+Rd,+North+Malaka+Prayagraj,+Uttar+Pradesh+211002/@25.4460863,81.8491671,17z/data=!4m5!4m4!1m0!1m2!1m1!1s0x399acb6bbad5b161:0x7b58666b4cd31bbc' }],
                    [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
                ]
            }
        });
    }
    
    // English Main Menu  
    else if (data === 'e_about') {
        showEnglishAboutUs(chatId);
    }
    else if (data === 'e_admission') {
        showEnglishAdmission(chatId);
    }
    else if (data === 'e_courses') {
        showEnglishCourses(chatId);
    }
    else if (data === 'e_exams') {
        showEnglishExams(chatId);
    }
    else if (data === 'e_results') {
        showEnglishResults(chatId);
    }
    else if (data === 'e_centers') {
        showEnglishCenters(chatId);
    }
    else if (data === 'e_study') {
        showEnglishStudyMaterial(chatId);
    }
    else if (data === 'e_fee') {
        showEnglishFeePayment(chatId);
    }
    else if (data === 'e_faq') {
        showEnglishFAQ(chatId);
    }
    else if (data === 'e_contact') {
        bot.sendMessage(chatId, getContactDetails('english'), {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🗺️ View on Google Maps', url: 'https://www.google.com/maps/dir//Patrachar+shiksha+sansthan+G.I.C+LECTURE+ROOM+1+Lowther+Rd,+North+Malaka+Prayagraj,+Uttar+Pradesh+211002/@25.4460863,81.8491671,17z/data=!4m5!4m4!1m0!1m2!1m1!1s0x399acb6bbad5b161:0x7b58666b4cd31bbc' }],
                    [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
                ]
            }
        });
    }
    
    // Back buttons
    else if (data === 'back_main_h') {
        showHindiMainMenu(chatId);
    }
    else if (data === 'back_main_e') {
        showEnglishMainMenu(chatId);
    }
    
    // Admission Details
    else if (data.startsWith('h_adm_') || data.startsWith('e_adm_')) {
        const classNum = data.split('_')[2];
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showClassAdmissionDetails(chatId, classNum, lang);
    }
    
    // Fee Structure
    else if (data === 'h_fee_structure' || data === 'e_fee_structure') {
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showFeeStructure(chatId, lang);
    }
    
    // Documents
    else if (data === 'h_documents' || data === 'e_documents') {
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showRequiredDocuments(chatId, lang);
    }
    
    // Important Dates
    else if (data === 'h_dates' || data === 'e_dates') {
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showImportantDates(chatId, lang);
    }
    
    // Application Process
    else if (data === 'h_process' || data === 'e_process') {
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showApplicationProcess(chatId, lang);
    }
    
    // District Center Selection
    else if (data.startsWith('center_')) {
        const districtName = data.replace('center_', '');
        showDistrictCenters(chatId, districtName);
    }
    
    // All Districts List
    else if (data === 'h_all_districts' || data === 'e_all_districts') {
        const lang = data.startsWith('h_') ? 'hindi' : 'english';
        showAllDistrictsList(chatId, lang);
    }
    
    // Study Material - Subject Selection
    else if (data === 'subject_math') {
        const lang = userState[chatId]?.lang || 'hindi';
        showMathChapters(chatId, lang);
    }
    else if (data === 'subject_science' || data === 'subject_social' || data === 'subject_english' || data === 'subject_hindi') {
        const lang = userState[chatId]?.lang || 'hindi';
        bot.sendMessage(chatId, 
            lang === 'hindi' ? 
            '📚 *यह विषय जल्द ही उपलब्ध होगा*\n\n⏳ सामग्री जल्दी ही सूची में जोड़ी जाएगी।\n\n🙏 कृपया धैर्य रखें।' : 
            '📚 *This subject will be available soon*\n\n⏳ Content will be added to the list shortly.\n\n🙏 Please be patient.',
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' }
                    ]]
                }
            }
        );
    }
    else if (data === 'back_subjects') {
        const studentData = userState[chatId]?.studentData;
        const lang = userState[chatId]?.lang || 'hindi';
        if (studentData) {
            showSubjectSelection(chatId, studentData, lang);
        } else {
            if (lang === 'hindi') showHindiStudyMaterial(chatId);
            else showEnglishStudyMaterial(chatId);
        }
    }
    
    // Study Material - Chapter Downloads (Only Math for now)
    else if (data.startsWith('math_')) {
        const lang = userState[chatId]?.lang || 'hindi';
        const chapterKey = data.replace('math_', '');
        sendMathChapter(chatId, chapterKey, lang);
    }
    
    // About Us - Vision/Mission
    else if (data === 'h_vision') {
        showHindiVision(chatId);
    }
    else if (data === 'e_vision') {
        showEnglishVision(chatId);
    }
    
    // About Us - Ordinance/Act
    else if (data === 'h_ordinance') {
        showHindiOrdinance(chatId);
    }
    else if (data === 'e_ordinance') {
        showEnglishOrdinance(chatId);
    }
    
    // About Us - Programmes
    else if (data === 'h_programmes') {
        showHindiProgrammes(chatId);
    }
    else if (data === 'e_programmes') {
        showEnglishProgrammes(chatId);
    }
    
    // PDF Downloads for About Us
    else if (data === 'h_vision_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF Hindi/विजन और मिशन.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 विजन और मिशन PDF'
        });
    }
    else if (data === 'e_vision_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF English/Vision_Mission.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 Vision/Mission PDF'
        });
    }
    else if (data === 'h_ordinance_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF Hindi/अधिनियम की पृष्ठभूमि.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 अधिनियम की पृष्ठभूमि PDF'
        });
    }
    else if (data === 'e_ordinance_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF English/Ordinance_Act_.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 Ordinance/Act PDF'
        });
    }
    else if (data === 'h_programmes_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF Hindi/कार्यक्रम.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 कार्यक्रम PDF'
        });
    }
    else if (data === 'e_programmes_pdf') {
        const pdfPath = '/home/alok-mohan/WhatsApp Boat/PDF English/Programmes.pdf';
        bot.sendDocument(chatId, pdfPath, {
            caption: '📄 Programmes PDF'
        });
    }
    
    // FAQ Category Handlers - Hindi
    else if (data === 'faq_h_admission') {
        showHindiFAQAdmission(chatId);
    }
    else if (data === 'faq_h_exam') {
        showHindiFAQExam(chatId);
    }
    else if (data === 'faq_h_fees') {
        showHindiFAQFees(chatId);
    }
    else if (data === 'faq_h_study') {
        showHindiFAQStudy(chatId);
    }
    else if (data === 'faq_h_result') {
        showHindiFAQResult(chatId);
    }
    else if (data === 'faq_h_certificate') {
        showHindiFAQCertificate(chatId);
    }
    else if (data === 'faq_h_contact') {
        showHindiFAQContact(chatId);
    }
    
    // FAQ Category Handlers - English
    else if (data === 'faq_e_admission') {
        showEnglishFAQAdmission(chatId);
    }
    else if (data === 'faq_e_exam') {
        showEnglishFAQExam(chatId);
    }
    else if (data === 'faq_e_fees') {
        showEnglishFAQFees(chatId);
    }
    else if (data === 'faq_e_study') {
        showEnglishFAQStudy(chatId);
    }
    else if (data === 'faq_e_result') {
        showEnglishFAQResult(chatId);
    }
    else if (data === 'faq_e_certificate') {
        showEnglishFAQCertificate(chatId);
    }
    else if (data === 'faq_e_contact') {
        showEnglishFAQContact(chatId);
    }
});

// ============================================
// DETAILED INFORMATION FUNCTIONS
// ============================================

function showClassAdmissionDetails(chatId, classNum, lang) {
    let msg = '';
    
    if (lang === 'hindi') {
        if (classNum === '9' || classNum === '10') {
            msg = `╔═══════════════════════╗
║  📘 कक्षा ${classNum}वीं प्रवेश    ║
╚═══════════════════════╝

कक्षा ${classNum}वीं प्रवेश सभी छात्रों के लिए खुला है।

✅ पात्रता:
   • न्यूनतम आयु 14 वर्ष
   • कोई भी पिछली कक्षा उत्तीर्ण

📄 आवश्यक दस्तावेज़:

📌 आयु प्रमाणपत्र:
   • जन्म प्रमाणपत्र/आधार कार्ड/
     स्कूल छोड़ने का प्रमाणपत्र

📌 पिछली कक्षा की मार्कशीट:
   • किसी भी कक्षा की मार्कशीट

📌 श्रेणी प्रमाणपत्र:
   • SC/ST/OBC प्रमाणपत्र
     (यदि लागू हो)`;
        } else if (classNum === '11') {
            msg = `╔═══════════════════════╗
║  📙 कक्षा 11वीं प्रवेश   ║
╚═══════════════════════╝

कक्षा 11वीं (पत्राचार) - दो वर्षीय पाठ्यक्रम जो कक्षा 12वीं की ओर ले जाता है।

✅ पात्रता:
   • कक्षा 10वीं उत्तीर्ण (अनिवार्य)
   • कक्षा 11वीं फेल छात्र पात्र नहीं

📄 आवश्यक दस्तावेज़:
   • कक्षा 10वीं मार्कशीट/प्रमाणपत्र
   • स्थानांतरण प्रमाणपत्र (TC)
   • आधार कार्ड

💰 शुल्क: ₹2,000

🔗 ऑनलाइन आवेदन करें`;
        } else { // Class 12
            msg = `╔═══════════════════════╗
║  📕 कक्षा 12वीं प्रवेश   ║
╚═══════════════════════╝

कक्षा 12वीं (पत्राचार) - एक वर्षीय पाठ्यक्रम, लचीली शिक्षा।

✅ पात्रता:
   • कक्षा 11वीं उत्तीर्ण

📄 आवश्यक दस्तावेज़:
   • कक्षा 11वीं मार्कशीट
   • स्थानांतरण प्रमाणपत्र (TC)
   • आधार कार्ड

💰 शुल्क: ₹2,000

🔗 ऑनलाइन आवेदन करें`;
        }
    } else {
        if (classNum === '9' || classNum === '10') {
            msg = `╔═══════════════════════╗
║  📘 Class ${classNum}th Admission║
╚═══════════════════════╝

Class ${classNum}th admission is open for all learners.

✅ Eligibility:
   • Minimum age 14 years
   • Any previous class passed

📄 Documents Required:

📌 Age Certificate:
   • Birth Certificate/Aadhaar Card/
     School Leaving Certificate

📌 Previous Class Marksheet:
   • Any class marksheet

📌 Category Certificate:
   • SC/ST/OBC Certificate
     (if applicable)`;
        } else if (classNum === '11') {
            msg = `╔═══════════════════════╗
║  📙 Class 11th Admission║
╚═══════════════════════╝

Class 11 (Patrachar) - Two year course leading to Class 12.

✅ Eligibility:
   • Class 10 PASSED (mandatory)
   • Class 11 FAIL students NOT eligible

📄 Documents Required:
   • Class 10 Marksheet/Certificate
   • Transfer Certificate (TC)
   • Aadhaar Card

💰 Fees: ₹2,000

🔗 Apply Online`;
        } else { // Class 12
            msg = `╔═══════════════════════╗
║  📕 Class 12th Admission║
╚═══════════════════════╝

Class 12 (Patrachar) - One year course, flexible learning.

✅ Eligibility:
   • Class 11 passed

📄 Documents Required:
   • Class 11 Marksheet
   • Transfer Certificate (TC)
   • Aadhaar Card

💰 Fees: ₹2,000

🔗 Apply Online`;
        }
    }
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: lang === 'hindi' ? '📝 आवेदन करें' : '📝 Apply Now', url: 'https://www.upsosb.org' }],
                [{ text: lang === 'hindi' ? '⬅️ वापस जाएं' : '⬅️ Go Back', callback_data: lang === 'hindi' ? 'h_admission' : 'e_admission' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showFeeStructure(chatId, lang) {
    let msg = lang === 'hindi' ? 
`╔═══════════════════════╗
║    💰 शुल्क संरचना      ║
╚═══════════════════════╝

📘 कक्षा 9वीं-10वीं:
   • प्रवेश शुल्क: ₹1,200
   • परीक्षा शुल्क: ₹800
   • कुल: ₹2,000

📙 कक्षा 11वीं-12वीं:
   • प्रवेश शुल्क: ₹1,500
   • परीक्षा शुल्क: ₹1,000
   • कुल: ₹2,500

💳 भुगतान विधि:
   • ऑनलाइन (डेबिट/क्रेडिट)
   • नेट बैंकिंग
   • UPI
   • चालान (बैंक में)

📌 नोट: SC/ST छात्रों को 50% छूट` 
: 
`╔═══════════════════════╗
║   💰 FEE STRUCTURE     ║
╚═══════════════════════╝

📘 Class 9th-10th:
   • Admission Fee: ₹1,200
   • Exam Fee: ₹800
   • Total: ₹2,000

📙 Class 11th-12th:
   • Admission Fee: ₹1,500
   • Exam Fee: ₹1,000
   • Total: ₹2,500

💳 Payment Methods:
   • Online (Debit/Credit)
   • Net Banking
   • UPI
   • Challan (Bank)

📌 Note: 50% discount for SC/ST`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: lang === 'hindi' ? '⬅️ वापस जाएं' : '⬅️ Go Back', callback_data: lang === 'hindi' ? 'h_admission' : 'e_admission' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showRequiredDocuments(chatId, lang) {
    let msg = lang === 'hindi' ?
`╔═══════════════════════╗
║   📄 आवश्यक दस्तावेज़    ║
╚═══════════════════════╝

✅ अनिवार्य दस्तावेज़:

1️⃣ पिछली कक्षा की मार्कशीट
   (स्व-सत्यापित प्रति)

2️⃣ जन्म प्रमाणपत्र
   (नगर निगम/ग्राम पंचायत)

3️⃣ आधार कार्ड
   (छात्र + अभिभावक)

4️⃣ फोटोग्राफ
   • 4 पासपोर्ट साइज फोटो
   • सफेद बैकग्राउंड
   • हाल का (3 माह से कम)

5️⃣ निवास प्रमाणपत्र
   (यूपी का मूल निवासी)

6️⃣ जाति प्रमाणपत्र
   (SC/ST/OBC के लिए)

📌 सभी दस्तावेज़ स्व-सत्यापित होने चाहिए`
:
`╔═══════════════════════╗
║  📄 REQUIRED DOCUMENTS  ║
╚═══════════════════════╝

✅ Mandatory Documents:

1️⃣ Previous Class Marksheet
   (Self-attested copy)

2️⃣ Birth Certificate
   (Municipality/Panchayat)

3️⃣ Aadhaar Card
   (Student + Guardian)

4️⃣ Photographs
   • 4 passport size photos
   • White background
   • Recent (less than 3 months)

5️⃣ Residence Certificate
   (UP domicile)

6️⃣ Caste Certificate
   (For SC/ST/OBC)

📌 All documents must be self-attested`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: lang === 'hindi' ? '⬅️ वापस जाएं' : '⬅️ Go Back', callback_data: lang === 'hindi' ? 'h_admission' : 'e_admission' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showImportantDates(chatId, lang) {
    let msg = lang === 'hindi' ?
`╔═══════════════════════╗
║   📅 महत्वपूर्ण तिथियां   ║
╚═══════════════════════╝

📝 प्रवेश सत्र 2025:
   शुरुआत: 1 जनवरी 2025
   अंतिम तिथि: 31 मार्च 2025

📋 परीक्षा कार्यक्रम:
   Theory: मार्च-अप्रैल
   Practical: फरवरी-मार्च

🎯 परिणाम:
   घोषणा: मई-जून

📄 फॉर्म भरने की तिथियां:
   • बिना विलंब शुल्क: 31 जनवरी
   • विलंब शुल्क ₹500: 28 फरवरी
   • विलंब शुल्क ₹1000: 31 मार्च

⚠️ महत्वपूर्ण:
समय पर फॉर्म भरें, विलंब शुल्क से बचें!`
:
`╔═══════════════════════╗
║   📅 IMPORTANT DATES   ║
╚═══════════════════════╝

📝 Admission Session 2025:
   Start: January 1, 2025
   Last Date: March 31, 2025

📋 Exam Schedule:
   Theory: March-April
   Practical: February-March

🎯 Results:
   Declaration: May-June

📄 Form Submission:
   • Without late fee: Jan 31
   • Late fee ₹500: Feb 28
   • Late fee ₹1000: March 31

⚠️ Important:
Submit forms on time to avoid late fees!`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: lang === 'hindi' ? '⬅️ वापस जाएं' : '⬅️ Go Back', callback_data: lang === 'hindi' ? 'h_admission' : 'e_admission' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showApplicationProcess(chatId, lang) {
    let msg = lang === 'hindi' ?
`╔═══════════════════════╗
║    📝 आवेदन प्रक्रिया    ║
╚═══════════════════════╝

✅ स्टेप-बाय-स्टेप गाइड:

1️⃣ रजिस्ट्रेशन:
   • www.upsosb.org पर जाएं
   • "New Registration" क्लिक करें
   • मोबाइल नंबर OTP से verify करें

2️⃣ फॉर्म भरें:
   • व्यक्तिगत जानकारी
   • शैक्षिक योग्यता
   • पता विवरण
   • विषय चयन

3️⃣ दस्तावेज़ अपलोड:
   • फोटो (JPG, 50KB)
   • हस्ताक्षर (JPG, 30KB)
   • मार्कशीट (PDF, 200KB)

4️⃣ शुल्क भुगतान:
   • ऑनलाइन पेमेंट
   • Receipt डाउनलोड करें

5️⃣ फॉर्म सबमिट:
   • Preview देखें
   • Submit करें
   • Print निकालें

✅ आपका रजिस्ट्रेशन पूरा हुआ!`
:
`╔═══════════════════════╗
║ 📝 APPLICATION PROCESS ║
╚═══════════════════════╝

✅ Step-by-Step Guide:

1️⃣ Registration:
   • Visit www.upsosb.org
   • Click "New Registration"
   • Verify mobile with OTP

2️⃣ Fill Form:
   • Personal information
   • Educational qualifications
   • Address details
   • Subject selection

3️⃣ Upload Documents:
   • Photo (JPG, 50KB)
   • Signature (JPG, 30KB)
   • Marksheet (PDF, 200KB)

4️⃣ Fee Payment:
   • Online payment
   • Download receipt

5️⃣ Submit Form:
   • Preview details
   • Submit form
   • Take printout

✅ Registration Complete!`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: lang === 'hindi' ? '🔗 ऑनलाइन आवेदन' : '🔗 Apply Online', url: 'https://www.upsosb.org' }],
                [{ text: lang === 'hindi' ? '⬅️ वापस जाएं' : '⬅️ Go Back', callback_data: lang === 'hindi' ? 'h_admission' : 'e_admission' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Add placeholder functions for other menus
function showHindiCourses(chatId) {
    bot.sendMessage(chatId, '📚 पाठ्यक्रम जानकारी जल्द उपलब्ध होगी...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ वापस', callback_data: 'back_main_h' }]]
        }
    });
}

function showEnglishCourses(chatId) {
    bot.sendMessage(chatId, '📚 Course information coming soon...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_main_e' }]]
        }
    });
}

function showHindiExams(chatId) {
    bot.sendMessage(chatId, '📋 परीक्षा जानकारी जल्द उपलब्ध होगी...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ वापस', callback_data: 'back_main_h' }]]
        }
    });
}

function showEnglishExams(chatId) {
    bot.sendMessage(chatId, '📋 Exam information coming soon...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_main_e' }]]
        }
    });
}

function showHindiResults(chatId) {
    bot.sendMessage(chatId, '🎯 परिणाम जानकारी जल्द उपलब्ध होगी...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ वापस', callback_data: 'back_main_h' }]]
        }
    });
}

function showEnglishResults(chatId) {
    bot.sendMessage(chatId, '🎯 Results information coming soon...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_main_e' }]]
        }
    });
}

function showHindiCenters(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║    🏢  नोडल सेंटर  🏢         ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 जिला-वार नोडल सेंटर
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

✅ *उत्तर प्रदेश के सभी 75 जिलों के नोडल सेंटर उपलब्ध*

📌 कृपया नीचे बटन से अपना जिला चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 सभी 75 जिलों की सूची देखें', callback_data: 'h_all_districts' }],
                [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
            ]
        },
        parse_mode: 'Markdown'
    };
    
    bot.sendMessage(chatId, msg, options);
}

function showEnglishCenters(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║    🏢  NODAL CENTERS  🏢    ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 District-wise Centers
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

✅ *All 75 Districts of Uttar Pradesh Available*

📌 Please select your district using the button below:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 View All 75 Districts List', callback_data: 'e_all_districts' }],
                [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
            ]
        },
        parse_mode: 'Markdown'
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Show District Centers
function showDistrictCenters(chatId, districtName) {
    const centerInfo = districtCenters[districtName];
    
    if (centerInfo) {
        const options = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️ Back to Centers', callback_data: userState[chatId]?.language === 'hindi' ? 'h_centers' : 'e_centers' }],
                    [{ text: '🏠 Main Menu', callback_data: userState[chatId]?.language === 'hindi' ? 'back_main_h' : 'back_main_e' }]
                ]
            }
        };
        bot.sendMessage(chatId, centerInfo, options);
    } else {
        bot.sendMessage(chatId, `❌ Sorry, centers for "${districtName}" are not available yet.`);
    }
}

// Show All Districts List
function showAllDistrictsList(chatId, lang) {
    const districts = getAllDistrictNames();
    
    const msg = lang === 'hindi' ? 
        `📋 *उत्तर प्रदेश के सभी 75 जिले*\n\n🔍 कृपया अपना जिला चुनें:` :
        `📋 *All 75 Districts of Uttar Pradesh*\n\n🔍 Please select your district:`;
    
    // Create inline keyboard with 2 districts per row
    const keyboard = [];
    for (let i = 0; i < districts.length; i += 2) {
        const row = [];
        row.push({ text: districts[i], callback_data: `center_${districts[i]}` });
        if (i + 1 < districts.length) {
            row.push({ text: districts[i + 1], callback_data: `center_${districts[i + 1]}` });
        }
        keyboard.push(row);
    }
    
    // Add navigation buttons
    keyboard.push([
        { text: lang === 'hindi' ? '⬅️ वापस' : '⬅️ Back', callback_data: lang === 'hindi' ? 'h_centers' : 'e_centers' },
        { text: lang === 'hindi' ? '🏠 मुख्य मेनू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
    ]);
    
    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: keyboard
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

// Study Material - Login Request
function showHindiStudyMaterial(chatId) {
    userState[chatId] = { screen: 'study_login_reg', lang: 'hindi' };
    
    const msg = `
╔══════════════════════╗
║                                           ║
║    📚  अध्ययन सामग्री  📚      ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 लॉगिन आवश्यक
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🔐 कृपया लॉगिन करें:

📝 *पंजीकरण संख्या* भेजें

━━━━━━━━━━━━━━━━━━━
🧪 *Demo/Testing के लिए:*

📌 Registration: \`12345\`
📅 DOB: \`01/01/2000\`
👤 Name: Rahul Kumar
📚 Class: 10
━━━━━━━━━━━━━━━━━━━

💡 अपनी Registration Number टाइप करें:`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showEnglishStudyMaterial(chatId) {
    userState[chatId] = { screen: 'study_login_reg', lang: 'english' };
    
    const msg = `
╔══════════════════════╗
║                                           ║
║    📚  STUDY MATERIAL  📚   ║
║                                           ║
╚══════════════════════╝

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 Login Required
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🔐 Please Login:

📝 Send your *Registration Number*

━━━━━━━━━━━━━━━━━━━
🧪 *Demo/Testing:*

📌 Registration: \`12345\`
📅 DOB: \`01/01/2000\`
👤 Name: Rahul Kumar
📚 Class: 10
━━━━━━━━━━━━━━━━━━━

💡 Type your Registration Number:`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

// Subject Selection after Login
function showSubjectSelection(chatId, studentData, lang) {
    userState[chatId].studentData = studentData;
    userState[chatId].screen = 'subject_selection';
    
    const msg = lang === 'hindi' ?
        `✅ स्वागत है *${studentData.name}*!\n📚 कक्षा: *${studentData.class}*\n\n📖 *अपना विषय चुनें:*` :
        `✅ Welcome *${studentData.name}*!\n📚 Class: *${studentData.class}*\n\n📖 *Select your Subject:*`;
    
    const subjects = lang === 'hindi' ? [
        [{ text: '📐 गणित (Mathematics)', callback_data: 'subject_math' }],
        [{ text: '🔬 विज्ञान (Science)', callback_data: 'subject_science' }],
        [{ text: '📜 सामाजिक विज्ञान (Social Science)', callback_data: 'subject_social' }],
        [{ text: '🌐 अंग्रेजी (English)', callback_data: 'subject_english' }],
        [{ text: '🇮🇳 हिंदी (Hindi)', callback_data: 'subject_hindi' }],
        [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
    ] : [
        [{ text: '📐 Mathematics', callback_data: 'subject_math' }],
        [{ text: '🔬 Science', callback_data: 'subject_science' }],
        [{ text: '📜 Social Science', callback_data: 'subject_social' }],
        [{ text: '🌐 English', callback_data: 'subject_english' }],
        [{ text: '🇮🇳 Hindi', callback_data: 'subject_hindi' }],
        [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
    ];
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: subjects }
    });
}

// Mathematics Chapters
function showMathChapters(chatId, lang) {
    userState[chatId].screen = 'math_chapters';
    
    const msg = lang === 'hindi' ?
        `📐 *गणित - अध्याय चुनें:*\n\nकृपया अध्याय चुनें:` :
        `📐 *Mathematics - Select Chapter:*\n\nPlease select a chapter:`;
    
    const chapters = [];
    
    // Add all 14 chapters (3 per row)
    for (let i = 1; i <= 14; i++) {
        const chKey = `ch${i}`;
        const chapter = mathChapters[chKey];
        if (chapter) {
            // Create rows of 3 buttons
            const rowIndex = Math.floor((i - 1) / 3);
            if (!chapters[rowIndex]) {
                chapters[rowIndex] = [];
            }
            chapters[rowIndex].push({
                text: `${i}`,
                callback_data: `math_${chKey}`
            });
        }
    }
    
    // Add navigation buttons
    chapters.push([
        { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' },
        { text: lang === 'hindi' ? '🏠 मुख्य मेन्यू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
    ]);
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: chapters }
    });
}

// Science Chapters
function showScienceChapters(chatId, lang) {
    userState[chatId].screen = 'science_chapters';
    
    const msg = lang === 'hindi' ?
        `🔬 *विज्ञान - अध्याय चुनें:*\n\nकृपया अध्याय चुनें:` :
        `🔬 *Science - Select Chapter:*\n\nPlease select a chapter:`;
    
    const chapters = [];
    
    // Add complete book option
    chapters.push([{ text: lang === 'hindi' ? '📖 संपूर्ण पुस्तक' : '📖 Complete Book', callback_data: 'science_complete' }]);
    
    // Add all 13 chapters (3 per row)
    for (let i = 1; i <= 13; i++) {
        const chKey = `ch${i}`;
        const chapter = scienceChapters[chKey];
        if (chapter) {
            const rowIndex = Math.floor((i - 1) / 3) + 1;
            if (!chapters[rowIndex]) {
                chapters[rowIndex] = [];
            }
            chapters[rowIndex].push({
                text: `${i}`,
                callback_data: `science_${chKey}`
            });
        }
    }
    
    chapters.push([
        { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' },
        { text: lang === 'hindi' ? '🏠 मुख्य मेन्यू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
    ]);
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: chapters }
    });
}

// Social Science Chapters
function showSocialChapters(chatId, lang) {
    userState[chatId].screen = 'social_chapters';
    
    const msg = lang === 'hindi' ?
        `📜 *सामाजिक विज्ञान - अध्याय चुनें:*\n\n📚 इतिहास, भूगोल, नागरिक शास्त्र, अर्थशास्त्र` :
        `📜 *Social Science - Select Chapter:*\n\n📚 History, Geography, Civics, Economics`;
    
    const chapters = [
        [{ text: lang === 'hindi' ? '📖 संपूर्ण पुस्तक' : '📖 Complete Book', callback_data: 'social_complete' }],
        [{ text: lang === 'hindi' ? '📜 इतिहास 1' : '📜 History 1', callback_data: 'social_history1' }],
        [{ text: lang === 'hindi' ? '📜 इतिहास 2' : '📜 History 2', callback_data: 'social_history2' }],
        [{ text: lang === 'hindi' ? '📜 इतिहास 3' : '📜 History 3', callback_data: 'social_history3' }],
        [{ text: lang === 'hindi' ? '🌍 भूगोल 1' : '🌍 Geography 1', callback_data: 'social_geo1' }],
        [{ text: lang === 'hindi' ? '🌍 भूगोल 2' : '🌍 Geography 2', callback_data: 'social_geo2' }],
        [{ text: lang === 'hindi' ? '🌍 भूगोल 3' : '🌍 Geography 3', callback_data: 'social_geo3' }],
        [{ text: lang === 'hindi' ? '🌍 भूगोल 4' : '🌍 Geography 4', callback_data: 'social_geo4' }],
        [{ text: lang === 'hindi' ? '🌍 भूगोल 5' : '🌍 Geography 5', callback_data: 'social_geo5' }],
        [{ text: lang === 'hindi' ? '⚖️ नागरिक शास्त्र 1' : '⚖️ Civics 1', callback_data: 'social_civic1' }],
        [{ text: lang === 'hindi' ? '⚖️ नागरिक शास्त्र 2' : '⚖️ Civics 2', callback_data: 'social_civic2' }],
        [{ text: lang === 'hindi' ? '💰 अर्थशास्त्र 1' : '💰 Economics 1', callback_data: 'social_eco1' }],
        [{ text: lang === 'hindi' ? '💰 अर्थशास्त्र 2' : '💰 Economics 2', callback_data: 'social_eco2' }],
        [{ text: lang === 'hindi' ? '💰 अर्थशास्त्र 3' : '💰 Economics 3', callback_data: 'social_eco3' }],
        [
            { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' },
            { text: lang === 'hindi' ? '🏠 मुख्य मेन्यू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
        ]
    ];
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: chapters }
    });
}

// English Chapters
function showEnglishChapters(chatId, lang) {
    userState[chatId].screen = 'english_chapters';
    
    const msg = lang === 'hindi' ?
        `🌐 *अंग्रेजी - अध्याय चुनें:*\n\n📚 Prose, Poetry, Grammar, Writing` :
        `🌐 *English - Select Chapter:*\n\n📚 Prose, Poetry, Grammar, Writing`;
    
    const chapters = [
        [{ text: lang === 'hindi' ? '📖 संपूर्ण पुस्तक' : '📖 Complete Book', callback_data: 'english_complete' }],
        [{ text: '📝 Prose 1', callback_data: 'english_prose1' }],
        [{ text: '📝 Prose 2', callback_data: 'english_prose2' }],
        [{ text: '📝 Prose 3', callback_data: 'english_prose3' }],
        [{ text: '📝 Prose 4', callback_data: 'english_prose4' }],
        [{ text: '📝 Prose 5', callback_data: 'english_prose5' }],
        [{ text: '✒️ Poem 1', callback_data: 'english_poem1' }],
        [{ text: '✒️ Poem 2', callback_data: 'english_poem2' }],
        [{ text: '✒️ Poem 3', callback_data: 'english_poem3' }],
        [{ text: '📚 Grammar 1', callback_data: 'english_grammar1' }],
        [{ text: '📚 Grammar 2', callback_data: 'english_grammar2' }],
        [{ text: '✍️ Writing 1', callback_data: 'english_writing1' }],
        [{ text: '✍️ Writing 2', callback_data: 'english_writing2' }],
        [
            { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' },
            { text: lang === 'hindi' ? '🏠 मुख्य मेन्यू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
        ]
    ];
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: chapters }
    });
}

// Hindi Chapters
function showHindiChapters(chatId, lang) {
    userState[chatId].screen = 'hindi_chapters';
    
    const msg = lang === 'hindi' ?
        `🇮🇳 *हिंदी - अध्याय चुनें:*\n\n📚 गद्य, काव्य, व्याकरण, लेखन` :
        `🇮🇳 *Hindi - Select Chapter:*\n\n📚 Prose, Poetry, Grammar, Writing`;
    
    const chapters = [
        [{ text: lang === 'hindi' ? '📖 संपूर्ण पुस्तक' : '📖 Complete Book', callback_data: 'hindi_complete' }],
        [{ text: lang === 'hindi' ? '📝 गद्य 1' : '📝 Prose 1', callback_data: 'hindi_prose1' }],
        [{ text: lang === 'hindi' ? '📝 गद्य 2' : '📝 Prose 2', callback_data: 'hindi_prose2' }],
        [{ text: lang === 'hindi' ? '📝 गद्य 3' : '📝 Prose 3', callback_data: 'hindi_prose3' }],
        [{ text: lang === 'hindi' ? '📝 गद्य 4' : '📝 Prose 4', callback_data: 'hindi_prose4' }],
        [{ text: lang === 'hindi' ? '📝 गद्य 5' : '📝 Prose 5', callback_data: 'hindi_prose5' }],
        [{ text: lang === 'hindi' ? '✒️ काव्य 1' : '✒️ Poem 1', callback_data: 'hindi_poem1' }],
        [{ text: lang === 'hindi' ? '✒️ काव्य 2' : '✒️ Poem 2', callback_data: 'hindi_poem2' }],
        [{ text: lang === 'hindi' ? '✒️ काव्य 3' : '✒️ Poem 3', callback_data: 'hindi_poem3' }],
        [{ text: lang === 'hindi' ? '📚 व्याकरण 1' : '📚 Grammar 1', callback_data: 'hindi_grammar1' }],
        [{ text: lang === 'hindi' ? '📚 व्याकरण 2' : '📚 Grammar 2', callback_data: 'hindi_grammar2' }],
        [{ text: lang === 'hindi' ? '✍️ लेखन 1' : '✍️ Writing 1', callback_data: 'hindi_writing1' }],
        [{ text: lang === 'hindi' ? '✍️ लेखन 2' : '✍️ Writing 2', callback_data: 'hindi_writing2' }],
        [
            { text: lang === 'hindi' ? '⬅️ विषय चुनें' : '⬅️ Back to Subjects', callback_data: 'back_subjects' },
            { text: lang === 'hindi' ? '🏠 मुख्य मेन्यू' : '🏠 Main Menu', callback_data: lang === 'hindi' ? 'back_main_h' : 'back_main_e' }
        ]
    ];
    
    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: chapters }
    });
}

// Send Chapter PDF
// Generic function to send chapters for any subject
function sendChapter(chatId, chapterKey, lang, subject) {
    const subjectMaps = {
        'math': { chapters: mathChapters, icon: '📐', callback: 'subject_math' },
        'science': { chapters: scienceChapters, icon: '🔬', callback: 'subject_science' },
        'social': { chapters: socialChapters, icon: '📜', callback: 'subject_social' },
        'english': { chapters: englishChapters, icon: '🌐', callback: 'subject_english' },
        'hindi': { chapters: hindiChapters, icon: '🇮🇳', callback: 'subject_hindi' }
    };
    
    const subjectMap = subjectMaps[subject];
    if (!subjectMap) return;
    
    const chapter = subjectMap.chapters[chapterKey];
    
    if (!chapter) {
        bot.sendMessage(chatId, lang === 'hindi' ? '❌ अध्याय उपलब्ध नहीं है' : '❌ Chapter not available');
        return;
    }
    
    const fs = require('fs');
    
    // Check if file exists
    if (!fs.existsSync(chapter.path)) {
        bot.sendMessage(chatId, 
            lang === 'hindi' ? 
            `📥 *${chapter.name}*\n\n⚠️ PDF फ़ाइल जल्द ही उपलब्ध होगी।` :
            `📥 *${chapter.nameEng}*\n\n⚠️ PDF file will be available soon.`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: lang === 'hindi' ? '⬅️ वापस' : '⬅️ Back', callback_data: subjectMap.callback }
                    ]]
                }
            }
        );
        return;
    }
    
    // Send loading message
    bot.sendMessage(chatId, 
        lang === 'hindi' ? '📥 PDF डाउनलोड हो रहा है...' : '📥 Downloading PDF...'
    ).then(() => {
        // Send the PDF
        bot.sendDocument(chatId, chapter.path, {
            caption: lang === 'hindi' ? 
                `${subjectMap.icon} *${chapter.name}*\n\n✅ डाउनलोड सफल!` :
                `${subjectMap.icon} *${chapter.nameEng}*\n\n✅ Download successful!`,
            parse_mode: 'Markdown'
        }).then(() => {
            // Show options after sending
            setTimeout(() => {
                bot.sendMessage(chatId, 
                    lang === 'hindi' ? '📚 और सामग्री चाहिए?' : '📚 Need more content?',
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: lang === 'hindi' ? '📖 वापस' : '📖 Back to Chapters', callback_data: subjectMap.callback },
                                { text: lang === 'hindi' ? '📚 अन्य विषय' : '📚 Other Subjects', callback_data: 'back_subjects' }
                            ]]
                        }
                    }
                );
            }, 1000);
        }).catch(err => {
            console.error('Error sending PDF:', err);
            bot.sendMessage(chatId, 
                lang === 'hindi' ? 
                '❌ PDF भेजने में त्रुटि। कृपया पुनः प्रयास करें।' :
                '❌ Error sending PDF. Please try again.'
            );
        });
    });
}

// Keep old function for backward compatibility
function sendMathChapter(chatId, chapterKey, lang) {
    sendChapter(chatId, chapterKey, lang, 'math');
}

function showHindiFeePayment(chatId) {
    bot.sendMessage(chatId, '💰 शुल्क भुगतान जानकारी जल्द उपलब्ध होगी...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ वापस', callback_data: 'back_main_h' }]]
        }
    });
}

function showEnglishFeePayment(chatId) {
    bot.sendMessage(chatId, '💰 Fee payment info coming soon...', {
        reply_markup: {
            inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_main_e' }]]
        }
    });
}

function showHindiFAQ(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║    ❓  FAQ  ❓                    ║
║    अक्सर पूछे जाने वाले प्रश्न    ║
║                                           ║
╚══════════════════════╝

कृपया श्रेणी चुनें:`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📝 प्रवेश', callback_data: 'faq_h_admission' }],
                [{ text: '📅 परीक्षा', callback_data: 'faq_h_exam' }],
                [{ text: '💰 शुल्क', callback_data: 'faq_h_fees' }],
                [{ text: '📚 अध्ययन सामग्री', callback_data: 'faq_h_study' }],
                [{ text: '🎯 परिणाम', callback_data: 'faq_h_result' }],
                [{ text: '📜 प्रमाणपत्र', callback_data: 'faq_h_certificate' }],
                [{ text: '📞 संपर्क', callback_data: 'faq_h_contact' }],
                [{ text: '⬅️ मुख्य मेन्यू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showEnglishFAQ(chatId) {
    const msg = `
╔══════════════════════╗
║                                           ║
║    ❓  FAQ  ❓                    ║
║    Frequently Asked Questions    ║
║                                           ║
╚══════════════════════╝

Please select category:`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📝 Admission', callback_data: 'faq_e_admission' }],
                [{ text: '📅 Examination', callback_data: 'faq_e_exam' }],
                [{ text: '💰 Fees', callback_data: 'faq_e_fees' }],
                [{ text: '📚 Study Material', callback_data: 'faq_e_study' }],
                [{ text: '🎯 Results', callback_data: 'faq_e_result' }],
                [{ text: '📜 Certificates', callback_data: 'faq_e_certificate' }],
                [{ text: '📞 Contact', callback_data: 'faq_e_contact' }],
                [{ text: '⬅️ Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

// Hindi FAQ Category Functions
function showHindiFAQAdmission(chatId) {
    const msg = `
╔════════════════════╗
║   📝 प्रवेश FAQ    ║
╚════════════════════╝

*1️⃣ प्रवेश कब शुरू होते हैं?*
प्रवेश आमतौर पर वर्ष में दो बार होते हैं - अप्रैल-मई (गर्मी बैच) और अक्टूबर-नवंबर (सर्दी बैच)। सटीक तिथियों के लिए आधिकारिक वेबसाइट देखें।

*2️⃣ प्रवेश के लिए न्यूनतम आयु क्या है?*
• कक्षा 9-10: न्यूनतम 14 वर्ष
• कक्षा 11-12: कक्षा 10/11 उत्तीर्ण होना आवश्यक

*3️⃣ क्या मैं ऑनलाइन आवेदन कर सकता हूं?*
हां, आप आधिकारिक वेबसाइट के माध्यम से ऑनलाइन आवेदन कर सकते हैं या निकटतम नोडल केंद्र पर जाकर भी प्रवेश ले सकते हैं।

*4️⃣ कौन से दस्तावेज़ आवश्यक हैं?*
• आधार कार्ड
• पिछली कक्षा की मार्कशीट
• स्थानांतरण प्रमाण पत्र (TC)
• पासपोर्ट साइज फोटो
• जन्म प्रमाण पत्र

*5️⃣ क्या स्कूल छोड़ने वाले छात्र प्रवेश ले सकते हैं?*
हां, स्कूल छोड़ने वाले या असफल छात्र भी प्रवेश ले सकते हैं। आपको केवल अपने पिछले स्कूल से TC और मार्कशीट की आवश्यकता होगी।

*6️⃣ प्रवेश शुल्क कितना है?*
सभी कक्षाओं (9-12) के लिए प्रवेश शुल्क ₹2,000 है। इसमें पंजीकरण और परीक्षा शुल्क शामिल है।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQExam(chatId) {
    const msg = `
╔════════════════════╗
║   📅 परीक्षा FAQ   ║
╚════════════════════╝

*1️⃣ परीक्षाएं कब होती हैं?*
वार्षिक परीक्षाएं आमतौर पर मार्च-अप्रैल में आयोजित की जाती हैं। बोर्ड द्वारा सटीक तिथियों की घोषणा की जाती है और वेबसाइट पर अपडेट की जाती है।

*2️⃣ प्रवेश पत्र कैसे डाउनलोड करें?*
परीक्षा से 15-20 दिन पहले प्रवेश पत्र उपलब्ध होते हैं। आप अपने रजिस्ट्रेशन नंबर से आधिकारिक वेबसाइट या इस बॉट के माध्यम से डाउनलोड कर सकते हैं।

*3️⃣ परीक्षा केंद्र कैसे चुनें?*
प्रवेश के समय आप अपनी पसंद का परीक्षा केंद्र चुन सकते हैं। बोर्ड आपके पते के आधार पर निकटतम केंद्र आवंटित करने का प्रयास करता है।

*4️⃣ परीक्षा पैटर्न क्या है?*
• सभी कक्षाओं के लिए लिखित परीक्षा
• प्रत्येक विषय के लिए थ्योरी और प्रैक्टिकल (यदि लागू हो)
• कक्षा 10: 5 विषय अनिवार्य
• कक्षा 11-12: स्ट्रीम के अनुसार विषय

*5️⃣ क्या पुनर्मूल्यांकन संभव है?*
हां, यदि आप परिणाम से संतुष्ट नहीं हैं तो आप पुनर्मूल्यांकन के लिए आवेदन कर सकते हैं। इसके लिए निर्धारित शुल्क और समय सीमा होती है।

*6️⃣ अगर कोई छात्र परीक्षा में अनुत्तीर्ण हो जाए?*
असफल छात्र अगले बैच में पुनः परीक्षा दे सकते हैं। आपको केवल असफल विषयों की परीक्षा देनी होगी, पूरी कक्षा दोबारा नहीं करनी होगी।

*7️⃣ प्रवेश पत्र में नाम गलत है, क्या करें?*
तुरंत अपने नोडल केंद्र या हेल्पलाइन (1800 00 000) पर संपर्क करें। सुधार के लिए आवश्यक दस्तावेज जमा करें।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQFees(chatId) {
    const msg = `
╔════════════════════╗
║   💰 शुल्क FAQ    ║
╚════════════════════╝

*1️⃣ कक्षा 10 के लिए कुल फीस कितनी है?*
कक्षा 10 के लिए कुल शुल्क ₹2,000 है। इसमें पंजीकरण, पाठ्यक्रम सामग्री और परीक्षा शुल्क शामिल है। कोई छिपा हुआ शुल्क नहीं है।

*2️⃣ कक्षा 11 और 12 की फीस क्या है?*
कक्षा 11 और 12 दोनों के लिए शुल्क ₹2,000 प्रति कक्षा है। यह सभी स्ट्रीम (आर्ट्स, साइंस, कॉमर्स) के लिए समान है।

*3️⃣ शुल्क भुगतान का तरीका?*
आप निम्नलिखित तरीकों से भुगतान कर सकते हैं:
• ऑनलाइन (UPI, कार्ड, नेट बैंकिंग)
• नोडल केंद्र पर नकद/चेक
• बैंक चालान के माध्यम से

*4️⃣ क्या कोई छात्रवृत्ति उपलब्ध है?*
हां, SC/ST/OBC और आर्थिक रूप से कमजोर वर्ग के छात्रों के लिए सरकारी छात्रवृत्तियां उपलब्ध हैं। आवेदन प्रक्रिया के लिए अपने नोडल केंद्र से संपर्क करें।

*5️⃣ रिफंड नीति क्या है?*
यदि आप प्रवेश रद्द करते हैं:
• 15 दिन के भीतर: 80% रिफंड
• 30 दिन के भीतर: 50% रिफंड
• 30 दिन के बाद: कोई रिफंड नहीं
परीक्षा शुल्क गैर-वापसी योग्य है।

*6️⃣ क्या फीस किस्तों में दी जा सकती है?*
वर्तमान में पूरा शुल्क एक साथ देना अनिवार्य है। हालांकि, वित्तीय कठिनाई के मामलों में विशेष विचार के लिए प्रधानाचार्य से संपर्क करें।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQStudy(chatId) {
    const msg = `
╔════════════════════════╗
║  📚 अध्ययन सामग्री FAQ  ║
╚════════════════════════╝

*1️⃣ अध्ययन सामग्री कैसे मिलेगी?*
प्रवेश के बाद, आप अपने रजिस्ट्रेशन नंबर से इस बॉट के "Study Material" सेक्शन में लॉगिन करके सभी विषयों की सामग्री डाउनलोड कर सकते हैं।

*2️⃣ क्या अध्ययन सामग्री निःशुल्क है?*
हां, आपके प्रवेश शुल्क में सभी अध्ययन सामग्री शामिल है। आपको कोई अतिरिक्त शुल्क नहीं देना होगा।

*3️⃣ किन विषयों की सामग्री उपलब्ध है?*
• कक्षा 10: हिंदी, अंग्रेजी, गणित, विज्ञान, सामाजिक विज्ञान
• कक्षा 11-12: स्ट्रीम के अनुसार सभी विषय
सभी सामग्री PDF फॉर्मेट में उपलब्ध है।

*4️⃣ क्या वीडियो लेक्चर उपलब्ध हैं?*
वर्तमान में हम PDF अध्ययन सामग्री प्रदान करते हैं। वीडियो लेक्चर जल्द ही उपलब्ध होंगे। अपडेट के लिए बॉट को चेक करते रहें।

*5️⃣ क्या मैं प्रिंट सामग्री प्राप्त कर सकता हूं?*
हां, आप अपने नोडल केंद्र से प्रिंटेड बुक्स खरीद सकते हैं। कीमत ₹500-₹1000 के बीच होती है (विषय के अनुसार)।

*6️⃣ सामग्री किस भाषा में है?*
अधिकांश सामग्री हिंदी और अंग्रेजी दोनों में उपलब्ध है। आप अपनी पसंद की भाषा चुन सकते हैं।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQResult(chatId) {
    const msg = `
╔════════════════════╗
║   🎯 परिणाम FAQ   ║
╚════════════════════╝

*1️⃣ परिणाम कब आएगा?*
परीक्षा समाप्त होने के 45-60 दिन बाद परिणाम घोषित किए जाते हैं। आमतौर पर मई-जून में परिणाम आते हैं।

*2️⃣ परिणाम कैसे देखें?*
आप तीन तरीकों से परिणाम देख सकते हैं:
• इस बॉट के Results सेक्शन में
• आधिकारिक वेबसाइट पर रोल नंबर डालकर
• SMS द्वारा (रोल नंबर के साथ RESULT भेजें)

*3️⃣ मार्कशीट कब मिलेगी?*
परिणाम घोषणा के 2-3 महीने बाद मार्कशीट जारी होती है। आप अपने नोडल केंद्र से मार्कशीट प्राप्त कर सकते हैं।

*4️⃣ क्या मार्कशीट ऑनलाइन डाउनलोड हो सकती है?*
वर्तमान में डिजिटल मार्कशीट पायलट मोड में है। आपको भौतिक मार्कशीट नोडल केंद्र से लेनी होगी।

*5️⃣ परिणाम में त्रुटि है, क्या करें?*
यदि आपको परिणाम में कोई त्रुटि दिखती है, तो तुरंत:
• परिणाम घोषणा के 15 दिन के भीतर आवेदन करें
• आवश्यक दस्तावेज के साथ नोडल केंद्र पर जाएं
• ऑनलाइन शिकायत दर्ज करें

*6️⃣ क्या ग्रेस मार्क्स दिए जाते हैं?*
हां, बोर्ड की नीति के अनुसार कुछ मामलों में ग्रेस मार्क्स दिए जा सकते हैं। यह स्वचालित रूप से लागू होता है, अलग से आवेदन की आवश्यकता नहीं।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQCertificate(chatId) {
    const msg = `
╔════════════════════════╗
║   📜 प्रमाणपत्र FAQ    ║
╚════════════════════════╝

*1️⃣ मूल प्रमाणपत्र कब मिलेगा?*
मार्कशीट जारी होने के साथ ही मूल प्रमाणपत्र भी तैयार हो जाते हैं। आप परिणाम घोषणा के 2-3 महीने बाद प्राप्त कर सकते हैं।

*2️⃣ प्रमाणपत्र कहां से लें?*
सभी मूल प्रमाणपत्र आपके नोडल केंद्र से जारी किए जाते हैं। आपको:
• ID प्रूफ ले जाना होगा
• रसीद/रजिस्ट्रेशन कार्ड दिखाना होगा
• यदि कोई और ले जा रहा है तो authorization letter

*3️⃣ क्या प्रमाणपत्र सभी जगह मान्य हैं?*
हां, UP Open School Board के सभी प्रमाणपत्र:
• सरकारी नौकरी के लिए मान्य
• उच्च शिक्षा के लिए स्वीकार्य
• केंद्र सरकार द्वारा मान्यता प्राप्त
• विदेश में भी वैध

*4️⃣ Transfer Certificate (TC) कैसे प्राप्त करें?*
TC के लिए:
• आवेदन पत्र भरें (नोडल केंद्र से मिलेगा)
• मार्कशीट की कॉपी संलग्न करें
• TC शुल्क जमा करें (₹100)
• 7-10 दिन में TC जारी हो जाएगा

*5️⃣ डुप्लीकेट मार्कशीट कैसे मिलेगी?*
यदि मूल मार्कशीट खो गई है:
• FIR/खो गया प्रमाण पत्र जमा करें
• ₹500 डुप्लीकेट शुल्क भरें
• आवेदन पत्र भरें
• 30-45 दिन में डुप्लीकेट मार्कशीट मिलेगी

*6️⃣ Migration Certificate कैसे मिलेगा?*
दूसरे बोर्ड/विश्वविद्यालय में प्रवेश के लिए:
• माइग्रेशन आवेदन पत्र भरें
• मूल मार्कशीट दिखाएं
• ₹200 शुल्क भरें
• 15-20 दिन में migration certificate जारी होगा

*7️⃣ Character Certificate कैसे प्राप्त करें?*
Character Certificate के लिए नोडल केंद्र के प्रिंसिपल से मिलें। यह आमतौर पर 2-3 दिन में जारी हो जाता है। कोई शुल्क नहीं है।

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

function showHindiFAQContact(chatId) {
    const msg = `
╔════════════════════╗
║   📞 संपर्क FAQ    ║
╚════════════════════╝

*1️⃣ हेल्पलाइन नंबर क्या है?*
📱 टोल फ्री नंबर: 1800 00 000
⏰ उपलब्धता: सोम-शुक्र, 10 AM - 5 PM
यह नंबर हिंदी और अंग्रेजी दोनों में सहायता प्रदान करता है।

*2️⃣ ईमेल से कैसे संपर्क करें?*
✉️ ईमेल: patracharshikshasansthan@gmail.com
• किसी भी query के लिए
• दस्तावेज़ भेजने के लिए
• शिकायत दर्ज करने के लिए
जवाब आमतौर पर 2-3 कार्य दिवसों में मिलता है।

*3️⃣ मुख्य कार्यालय का पता क्या है?*
🏢 Patrachar Shiksha Sansthan
📍 G.I.C Lecture Room 1
   Lowther Road, North Malaka
   Prayagraj, Uttar Pradesh - 211001
🕒 सोम-शुक्र: 10 AM - 5 PM
🕒 शनिवार: 10 AM - 2 PM
🕒 रविवार: बंद

*4️⃣ अपने जिले के नोडल सेंटर की जानकारी कैसे पाएं?*
इस बॉट में "Centers" सेक्शन में जाएं और अपना जिला चुनें। आपको:
• सेंटर का पता मिलेगा
• फोन नंबर मिलेगा
• संपर्क व्यक्ति की जानकारी मिलेगी

*5️⃣ शिकायत कैसे दर्ज करें?*
आप निम्नलिखित तरीकों से शिकायत दर्ज कर सकते हैं:
• ऑनलाइन शिकायत पोर्टल
• हेल्पलाइन नंबर पर कॉल करें
• ईमेल भेजें
• नोडल केंद्र में लिखित शिकायत दें
शिकायत संख्या नोट करें और ट्रैकिंग करें।

*6️⃣ सोशल मीडिया पर कैसे जुड़ें?*
हम इन प्लेटफ़ॉर्म पर सक्रिय हैं:
📱 Facebook: @UPOpenSchoolBoard
🐦 Twitter: @UPOSB_Official
📸 Instagram: @uposb_official
💬 Telegram Bot: @upsosb_bot

*7️⃣ क्या 24x7 सहायता उपलब्ध है?*
वर्तमान में 24x7 सहायता उपलब्ध नहीं है। हालांकि:
• यह Telegram बॉट हमेशा उपलब्ध है
• आप ईमेल भेज सकते हैं (24-72 घंटे में जवाब)
• आपातकालीन मामलों के लिए WhatsApp भी जल्द आएगा

━━━━━━━━━━━━━━━━━━━
💡 और सवाल? हमसे संपर्क करें!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📞 संपर्क करें', callback_data: 'h_contact' }],
                [{ text: '⬅️ FAQ वापस', callback_data: 'h_faq' }],
                [{ text: '🏠 मुख्य मेनू', callback_data: 'back_main_h' }]
            ]
        }
    });
}

// English FAQ Category Functions
function showEnglishFAQAdmission(chatId) {
    const msg = `
╔════════════════════╗
║   📝 Admission FAQ ║
╚════════════════════╝

*1️⃣ When do admissions start?*
Admissions are typically open twice a year - April-May (Summer batch) and October-November (Winter batch). Check the official website for exact dates.

*2️⃣ What is the minimum age for admission?*
• Class 9-10: Minimum 14 years
• Class 11-12: Must have passed Class 10/11

*3️⃣ Can I apply online?*
Yes, you can apply online through the official website or visit the nearest nodal center for admission.

*4️⃣ What documents are required?*
• Aadhaar Card
• Previous class marksheet
• Transfer Certificate (TC)
• Passport size photos
• Date of Birth certificate

*5️⃣ Can school dropouts take admission?*
Yes, school dropouts or failed students can also take admission. You just need your TC and marksheet from previous school.

*6️⃣ What is the admission fee?*
The admission fee for all classes (9-12) is ₹2,000. This includes registration and examination fees.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQExam(chatId) {
    const msg = `
╔════════════════════╗
║   📅 Examination FAQ║
╚════════════════════╝

*1️⃣ When are exams conducted?*
Annual exams are usually held in March-April. Exact dates are announced by the board and updated on the website.

*2️⃣ How to download admit card?*
Admit cards are available 15-20 days before exams. Download using your registration number from the official website or through this bot.

*3️⃣ How to choose exam center?*
You can choose your preferred exam center during admission. The board tries to allot the nearest center based on your address.

*4️⃣ What is the exam pattern?*
• Written exams for all classes
• Theory and Practical (if applicable) for each subject
• Class 10: 5 subjects compulsory
• Class 11-12: Subjects as per stream

*5️⃣ Is re-evaluation possible?*
Yes, you can apply for re-evaluation if not satisfied with results. There's a prescribed fee and time limit for this.

*6️⃣ What if a student fails?*
Failed students can reappear in the next batch. You only need to take exams for failed subjects, not repeat the entire class.

*7️⃣ Name is wrong in admit card, what to do?*
Immediately contact your nodal center or helpline (1800 00 000). Submit required documents for correction.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQFees(chatId) {
    const msg = `
╔════════════════════╗
║   💰 Fees FAQ      ║
╚════════════════════╝

*1️⃣ What is the total fee for Class 10?*
Total fee for Class 10 is ₹2,000. This includes registration, course material, and examination fees. No hidden charges.

*2️⃣ What is the fee for Class 11 and 12?*
Fee for both Class 11 and 12 is ₹2,000 per class. Same for all streams (Arts, Science, Commerce).

*3️⃣ Fee payment methods?*
You can pay through:
• Online (UPI, Card, Net Banking)
• Cash/Cheque at nodal center
• Bank Challan

*4️⃣ Are scholarships available?*
Yes, government scholarships are available for SC/ST/OBC and economically weaker sections. Contact your nodal center for application process.

*5️⃣ What is the refund policy?*
If you cancel admission:
• Within 15 days: 80% refund
• Within 30 days: 50% refund
• After 30 days: No refund
Examination fee is non-refundable.

*6️⃣ Can fees be paid in installments?*
Currently, full fees must be paid together. However, contact the principal for special consideration in cases of financial hardship.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQStudy(chatId) {
    const msg = `
╔════════════════════════╗
║  📚 Study Material FAQ  ║
╚════════════════════════╝

*1️⃣ How will I get study material?*
After admission, login with your registration number in the "Study Material" section of this bot to download all subject materials.

*2️⃣ Is study material free?*
Yes, all study material is included in your admission fee. No additional charges.

*3️⃣ Which subjects' materials are available?*
• Class 10: Hindi, English, Math, Science, Social Science
• Class 11-12: All subjects as per stream
All materials available in PDF format.

*4️⃣ Are video lectures available?*
Currently we provide PDF study materials. Video lectures coming soon. Keep checking the bot for updates.

*5️⃣ Can I get printed material?*
Yes, you can purchase printed books from your nodal center. Price ranges ₹500-₹1000 (depending on subject).

*6️⃣ In which language is the material?*
Most materials are available in both Hindi and English. You can choose your preferred language.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQResult(chatId) {
    const msg = `
╔════════════════════╗
║   🎯 Results FAQ   ║
╚════════════════════╝

*1️⃣ When will results be declared?*
Results are declared 45-60 days after exams end. Usually in May-June.

*2️⃣ How to check results?*
You can check results in three ways:
• In Results section of this bot
• On official website using roll number
• Via SMS (send RESULT with roll number)

*3️⃣ When will marksheet be available?*
Marksheets are issued 2-3 months after result declaration. Collect from your nodal center.

*4️⃣ Can marksheet be downloaded online?*
Currently digital marksheets are in pilot mode. You need to collect physical marksheet from nodal center.

*5️⃣ Error in result, what to do?*
If you find any error in result:
• Apply within 15 days of result declaration
• Visit nodal center with required documents
• File online complaint

*6️⃣ Are grace marks given?*
Yes, grace marks may be given in some cases as per board policy. This is applied automatically, no separate application needed.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQCertificate(chatId) {
    const msg = `
╔════════════════════════╗
║   📜 Certificates FAQ   ║
╚════════════════════════╝

*1️⃣ When will original certificate be available?*
Original certificates are ready along with marksheet issuance. Collect 2-3 months after result declaration.

*2️⃣ Where to get certificates?*
All original certificates are issued from your nodal center. You need:
• ID proof
• Receipt/Registration card
• Authorization letter if someone else is collecting

*3️⃣ Are certificates valid everywhere?*
Yes, UP Open School Board certificates are:
• Valid for government jobs
• Accepted for higher education
• Recognized by Central Government
• Valid abroad

*4️⃣ How to get Transfer Certificate (TC)?*
For TC:
• Fill application form (available at nodal center)
• Attach marksheet copy
• Pay TC fee (₹100)
• TC will be issued in 7-10 days

*5️⃣ How to get duplicate marksheet?*
If original marksheet is lost:
• Submit FIR/Lost certificate
• Pay ₹500 duplicate fee
• Fill application form
• Duplicate marksheet in 30-45 days

*6️⃣ How to get Migration Certificate?*
For admission to other board/university:
• Fill migration application form
• Show original marksheet
• Pay ₹200 fee
• Migration certificate issued in 15-20 days

*7️⃣ How to get Character Certificate?*
Contact the principal of your nodal center for Character Certificate. Usually issued in 2-3 days. No fee.

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishFAQContact(chatId) {
    const msg = `
╔════════════════════╗
║   📞 Contact FAQ   ║
╚════════════════════╝

*1️⃣ What is the helpline number?*
📱 Toll Free: 1800 00 000
⏰ Available: Mon-Fri, 10 AM - 5 PM
Support in both Hindi and English.

*2️⃣ How to contact via email?*
✉️ Email: patracharshikshasansthan@gmail.com
• For any query
• To send documents
• To file complaints
Response usually within 2-3 working days.

*3️⃣ What is the main office address?*
🏢 Patrachar Shiksha Sansthan
📍 G.I.C Lecture Room 1
   Lowther Road, North Malaka
   Prayagraj, Uttar Pradesh - 211001
🕒 Mon-Fri: 10 AM - 5 PM
🕒 Saturday: 10 AM - 2 PM
🕒 Sunday: Closed

*4️⃣ How to find my district nodal center info?*
Go to "Centers" section in this bot and select your district. You'll get:
• Center address
• Phone number
• Contact person details

*5️⃣ How to file a complaint?*
You can file complaint through:
• Online complaint portal
• Call helpline number
• Send email
• Submit written complaint at nodal center
Note the complaint number for tracking.

*6️⃣ How to connect on social media?*
We're active on:
📱 Facebook: @UPOpenSchoolBoard
🐦 Twitter: @UPOSB_Official
📸 Instagram: @uposb_official
💬 Telegram Bot: @upsosb_bot

*7️⃣ Is 24x7 support available?*
Currently 24x7 support not available. However:
• This Telegram bot is always available
• You can send email (response in 24-72 hours)
• WhatsApp support coming soon for emergencies

━━━━━━━━━━━━━━━━━━━
💡 More questions? Contact us!
━━━━━━━━━━━━━━━━━━━`;

    bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📞 Contact Us', callback_data: 'e_contact' }],
                [{ text: '⬅️ Back to FAQ', callback_data: 'e_faq' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main_e' }]
            ]
        }
    });
}

function showEnglishStudentServices(chatId) {
    const msg = `╔═══════════════════════╗
║  👨‍🎓 STUDENT SERVICES   ║
╚═══════════════════════╝

Choose service:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎫 Download Admit Card', callback_data: 'e_admit_card' }],
                [{ text: '📋 Roll Number Info', callback_data: 'e_roll_info' }],
                [{ text: '📜 Certificate Status', callback_data: 'e_cert_status' }],
                [{ text: '🔄 Migration Process', callback_data: 'e_migration' }],
                [{ text: '📃 Transfer Certificate', callback_data: 'e_tc' }],
                [{ text: '📝 Register Complaint', callback_data: 'e_complaint' }],
                [{ text: '⬅️ Go Back', callback_data: 'back_main_e' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, msg, options);
}

function getContactDetails(lang) {
    return lang === 'hindi' ?
`╔════════════════════════╗
║    📞 संपर्क करें        ║
╚════════════════════════╝

🏢 *पत्राचार शिक्षा संस्थान*
   Patrachar Shiksha Sansthan

📍 *पता / Address:*
   G.I.C Lecture Room 1
   Lowther Road, North Malaka
   Prayagraj, Uttar Pradesh
   📮 PIN: 211001

📞 *टोल फ्री / Toll Free:*
   📱 1800 00 000

📧 *ईमेल / Email:*
   ✉️ patracharshikshasansthan@gmail.com

⏰ *कार्यालय समय:*
   सोम-शुक्र: 10:00 AM - 5:00 PM
   शनिवार: 10:00 AM - 2:00 PM
   रविवार: बंद

━━━━━━━━━━━━━━━━━━━
💡 *Get in Touch*
━━━━━━━━━━━━━━━━━━━`
:
`╔════════════════════════╗
║    📞 GET IN TOUCH      ║
╚════════════════════════╝

🏢 *Patrachar Shiksha Sansthan*
   पत्राचार शिक्षा संस्थान

📍 *Address / पता:*
   G.I.C Lecture Room 1
   Lowther Road, North Malaka
   Prayagraj, Uttar Pradesh
   📮 PIN: 211001

📞 *Toll Free / टोल फ्री:*
   📱 1800 00 000

📧 *Email / ईमेल:*
   ✉️ patracharshikshasansthan@gmail.com

⏰ *Office Hours:*
   Mon-Fri: 10:00 AM - 5:00 PM
   Saturday: 10:00 AM - 2:00 PM
   Sunday: Closed

━━━━━━━━━━━━━━━━━━━
💡 *संपर्क करें*
━━━━━━━━━━━━━━━━━━━`;
}

// Error handling
bot.on('polling_error', (error) => {
    if (error.code === 'EFATAL' || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
        console.log('Network issue - bot will retry...');
    } else {
        console.log('Polling error:', error.code || error.message);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    if (reason.code === 'ETIMEDOUT' || reason.code === 'ECONNRESET') {
        console.log('Network timeout - continuing...');
    }
});

process.on('SIGINT', () => {
    console.log('\n👋 Bot band ho raha hai...');
    bot.stopPolling();
    process.exit(0);
});
