# הנחיות פיתוח צד לקליינט – Team Tasks App

מסמך זה מגדיר לסטודנטים מה לבנות בצד הקליינט מול ה‑API (ראה docs/API.md). אפשר להשתמש בכל פריימוורק מודרני (מומלץ Angular 17/20), אך ההנחיות כלליות.

## מטרות למידה
- אימות מבוסס JWT וזרימת התחברות/התנתקות.
- עבודה עם REST API: קריאות GET/POST/PATCH/DELETE, כותרות Authorization.
- ניהול מצב (state) בסיסי בצד קליינט (עד רמת פרויקט/משימה/תגובה).
- ראוטינג, הגנות ראוטים (guards), מסכי טעינה ושגיאות.
- טפסים ולידציה בסיסית ליצירה/עדכון.
- UI נעים ושמיש (עדיפות לרספונסיבי).

## דרישות פונקציונליות (MVP)
1) אימות
- מסך Login + Register.
- שמירת הטוקן לאחר כניסה, הוספת Authorization: Bearer <token> לכל בקשה מוגנת.
- הצגת שם המשתמש בסרגל עליון וכפתור Logout.

2) צוותים (Teams)
- מסך רשימת הצוותים של המשתמש (GET /api/teams) כולל members_count.
- יצירת צוות חדש (POST /api/teams) – דיאלוג/טופס קטן.
- (אופציונלי) הוספת חבר לצוות (POST /api/teams/:teamId/members) – זמין רק לבעלי הרשאות מתאימות.

3) פרויקטים (Projects)
- מסך רשימת פרויקטים של המשתמש (GET /api/projects).
- יצירת פרויקט חדש (POST /api/projects) עבור צוות נבחר.

4) משימות (Tasks)
- תצוגת רשימת משימות לפי פרויקט נוכחי (GET /api/tasks?projectId=...).
- יצירת משימה (POST /api/tasks) עם שדות בסיסיים: title, description, priority, status.
- עדכון משימה (PATCH /api/tasks/:id) – שינוי status/priority/title.
- מחיקת משימה (DELETE /api/tasks/:id) עם אישור משתמש.

5) תגובות (Comments)
- פאנל תגובות למשימה נוכחית: הצגה (GET /api/comments?taskId=...) והוספה (POST /api/comments).

6) חוויית משתמש
- סטייטים: Loading/Empty/Error.
- Toast/Snackbar להצלחות ושגיאות.
- חיפוש/סינון בסיסי למשימות (בקליינט) – אופציונלי.

## דרישות לא-פונקציונליות
- מבנה פרויקט קריא, קבצים/תיקיות מאורגנים (components/pages/services).
- שימוש ב‑.env לקביעת BASE_URL (למשל http://localhost:3000 או דומיין Render).
- טיפול בשגיאות HTTP: 401 (הפניה ל‑Login), 403 (הודעת הרשאה), 404/500 (הודעות מתאימות).
- נגישות בסיסית: aria-labels לכפתורים/שדות.

## ארכיטקטורת לקוח מוצעת (Angular)
- Routing
  - `/login`, `/register` – מסכי אימות.
  - `/teams` – רשימת צוותים + יצירה.
  - `/projects` – רשימת פרויקטים (ניתן לסנן לפי צוות).
  - `/projects/:id` – דף פרויקט עם טאבים: `tasks`, `activity` (אופציונלי).
  - `/projects/:id/tasks/:taskId` – פרטי משימה + תגובות.
- Guards
  - `authGuard` – מונע גישה לראוטים ללא טוקן.
- Services
  - `auth.service`: login, register, logout, currentUser, token storage.
  - `teams.service`: getTeams, createTeam, addMember.
  - `projects.service`: getProjects, createProject.
  - `tasks.service`: getTasks(projectId), create, update, delete.
  - `comments.service`: getComments(taskId), create.
- State
  - ניהול state מינימלי: BehaviorSubject/Signals או ספרייה (NgRx) למתקדמים.
- UI
  - רכיבי טופס, טבלאות/רשימות, דיאלוגים.

## ניהול טוקן ואבטחה
- אחסון מומלץ: in-memory + sessionStorage (fallback). הימנעו מ‑localStorage בפרודקשן אם לא חייבים.
- בכל בקשה מוגנת: הוסיפו Header: `Authorization: Bearer <token>`.
- בטיפול ב‑401: מחיקה והפניה ל‑/login.

## תצורת סביבה (דוגמה)
- קובץ `.env` בצד הקליינט (Angular):
  - `NG_APP_API_BASE_URL` (או שימוש ב‑environment.ts):
    - לוקאל: `http://localhost:3000`
    - Render: `https://<your-service>.onrender.com`

## זרימות עיקריות (User Journeys)
- רישום/כניסה: מילוי טופס -> POST /api/auth/login|register -> שמירת token -> ניווט ל‑/projects.
- יצירת צוות: כפתור New Team -> טופס -> POST /api/teams -> רענון רשימה.
- יצירת פרויקט: בחירת צוות -> POST /api/projects -> ניווט לפרויקט.
- ניהול משימות: טעינת משימות הפרויקט -> יצירה/עדכון/מחיקה -> רענון/עדכון Optimistic.
- תגובות: פתיחת משימה -> GET comments -> POST תגובה -> הוספה לרשימה.

## דרישות מסך (Acceptance Criteria)
- Login/Register
  - ולידציה בסיסית (אימייל תקין, סיסמה לא ריקה).
  - הודעות שגיאה/הצלחה.
- Projects
  - הצגת רשימה; טעינה/שגיאה; כפתור להוספה.
- Tasks
  - רשימה לפי פרויקט; יצירה/עדכון/מחיקה; Toast על הצלחה/כשל.
- Comments
  - הצגה והוספה; ניקוי שדה לאחר שליחה; גלילה/פוקוס לתגובה חדשה.

## ממשק ל‑API
- עיינו במסמך: `docs/API.md` לכל ה‑endpoints, דוגמאות בקשות/תגובות.
- מומלץ לייבא ל‑Postman את `postman/TeamTasksAPI.postman_collection.json` לבדיקה מהירה.

## הרחבות (למתקדמים)
- Pagination למשימות ותגובות.
- סינון/מיון בצד שרת.
- העלאת קבצים למשימות (למשל קישורים/קבצים מצורפים).
- התראות Real-time (WebSocket) – לא חובה.
- מצב כהה/בהיר (Theme) ושמירה בהעדפות המשתמש.

## קריטריוני הגשה
- ריפוזיטורי Git מסודר (README קצר לסטאפ).
- דמו עובד (localhost או כתובת Render לפרונט).
- עמידה בדרישות פונקציונליות ו‑UX בסיסי.
- קוד נקי, מודולרי, עם שמות משמעותיים ומחולק לרכיבים ושירותים.
