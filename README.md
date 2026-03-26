# 🚀 NexusFlow | Enterprise Team & Task Management

<div align="center">

![Angular Version](https://img.shields.io/badge/Angular-20-dd0031.svg?style=for-the-badge&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**מערכת מתקדמת לניהול צוותים, פרויקטים ומשימות בזמן אמת.** פלטפורמה הוליסטית המעניקה חוויית משתמש מודרנית (UX) בשילוב ביצועים גבוהים.

[🌐 לצפייה בגרסת ה-Live ב-Render](https://nexus-flow-client.onrender.com/landing)

</div>

---

## 🌟 סקירה כללית (Overview)
**NexusFlow** נבנתה כמענה לצורך בניהול היררכי חכם של משימות בתוך ארגונים. המערכת מאפשרת הפרדה ברורה בין צוותים, שיוך פרויקטים לכל צוות, וניהול משימות פרטני לכל פרויקט – הכל תחת ממשק אחוד ומאובטח המבוסס על הארכיטקטורות החדישות ביותר.

## ✨ תכונות עיקריות (Key Features)
* **ניהול היררכי מלא:** יצירת צוותים, שיוך חברים, והקמת פרויקטים ייעודיים לכל צוות.
* **לוח משימות אינטראקטיבי (Task Board):** ניהול מחזור חיים מלא של משימות (CRUD) הכולל סטטוסים ועדיפויות.
* **שיתוף פעולה בזמן אמת:** מערכת תגובות מובנית לכל משימה המאפשרת שיח צוותי שוטף.
* **אבטחה והרשאות:** הגנה על נתיבים (Guards) וניהול התחברות מאובטח מבוסס JWT Token.
* **עיצוב פרימיום:** ממשק Dark Mode מודרני בסגנון **Glassmorphism** הכולל אנימציות CSS3 מתקדמות.

## 🛠 ארכיטקטורה וטכנולוגיות (Tech Stack)

### Frontend (The Heart of NexusFlow)
* **Angular 20:** ניצול מלא של יכולות הפרימוורק החדשות:
    * **Signals:** לניהול מצב (State) ריאקטיבי יעיל ואופטימיזציה מקסימלית של ה-DOM.
    * **Standalone Components:** מבנה אפליקציה מודרני, נקי וקל לתחזוקה.
    * **HTTP Interceptors:** הזרקה אוטומטית של Auth Headers (Bearer Token) לכל קריאה.
* **Reactive Forms:** ניהול טפסים מורכבים עם וולידציות צד-לקוח מתקדמות.
* **Lucide Icons:** שימוש באייקונים וקטוריים קלים למראה נקי ומקצועי.

### Backend & Infrastructure
* **Node.js & Express:** שרת API מהיר, יציב ומאובטח.
* **PostgreSQL / SQLite:** ניהול נתונים רלציוני המבטיח שלמות נתונים.
* **Render:** אירוח ענן מלא (Full-stack Deployment) עם CI/CD.

---

## 🚀 הרצה מקומית (Local Setup)

### 1. שיבוט הפרויקט
```bash
git clone [https://github.com/h48503652-web/AngularProject.git](https://github.com/h48503652-web/AngularProject.git)
cd nexus-flow
2. הגדרת השרת (Server)
Bash
cd server
npm install
npm start
השרת יפעל בכתובת: http://localhost:3000

3. הגדרת הקליינט (Client)
פתח טרמינל חדש והרצי:

Bash
cd client
npm install
ng serve
האפליקציה תהיה זמינה בדפדפן בכתובת: http://localhost:4200

📂 מבנה הפרויקט (Project Structure)
Plaintext
nexus-flow/
├── client/                 # Angular 20 Source Code
│   ├── src/app/
│   │   ├── core/           # Interceptors, Guards & Global Models
│   │   ├── services/       # Feature-based API Services (Signal-driven)
│   │   ├── components/      # Reusable Shared UI Components
│   │   └── pages/          # Main Views (Dashboard, Teams, Tasks)
├── server/                 # Node.js Express Backend
└── README.md               # Project Documentation
📸 מבט מהמערכת (Snapshots)
🔐 מסך התחברות והרשמה
תהליך הזדהות מאובטח עם עיצוב זכוכית מודרני.

👥 ניהול צוותי עבודה
ממשק ניהול צוותים המאפשר יצירה ומעקב אחר חברי הצוות.

פותח בהשקעה רבה כחלק ממטלת פיתוח ב-Angular. נשמח למשוב והצעות לשיפור! 🚀
