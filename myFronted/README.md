# MyFronted

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

# MyFronted — Frontend (Angular)

מדריך קצר ומעשי להרצת ותחזוקת פרונטאנד הפרויקט.

קבצי מקור עיקריים:
- מקור: `src/` — רכיבים, שירותים, אינטרספטורים
- תצורה: `src/environments/environment.ts` ו־`environment.prod.ts`
- תיעוד API: `docs/API.md` (שרת: `WolfTasksServer-main/docs/API.md`)

Prerequisites
- Node 18+ ו‑npm
- Angular CLI (מומלץ, לא חובה אם משתמשים ב‑npm scripts)

התקנה והרצה בפיתוח
1. התקנת תלויות:

```bash
cd myFronted
npm install
```

2. הרצת שרת פיתוח:

```bash
npm run start
# או
ng serve
```

פתחו את: `http://localhost:4200/`.

הגדרת API (environment)
- כתובת ה‑API נקבעת ב־`src/environments/environment.ts` באמצעות השדה `apiBaseUrl`.
- דוגמה (dev):

```ts
export const environment = {
	production: false,
	apiBaseUrl: 'http://localhost:3000/api'
};
```

הערה: הפרויקט משתמש ב־`sessionStorage` בלבד לאחסון ה‑JWT (אין שימוש ב‑localStorage).

מבנה ופיצ'רים חשובים (מה שמוממש את הדרישות)
- Authentication: `src/app/services/auth.ts` — `login`, `register`, `logout`, `getToken`, `currentUser`.
- Interceptor: `src/app/interceptors/auth-interceptor.ts` — מוסיף `Authorization: Bearer <token>`, מטפל ב‑401/403.
- Guard: `src/app/guards/auth.guard.ts` — מגן על ראוטים פרטיים.
- Screens / Components:
	- `src/app/components/login` — Login
	- `src/app/components/register` — Register
	- `src/app/components/teams` — Teams (list, create, add member)
	- `src/app/components/projects` — Projects (list, create)
	- `src/app/components/tasks` — Tasks (list per project, create/update/delete)
	- `src/app/components/comments` — Comments (list/add)
- Environments: `src/environments/environment.ts`, `environment.prod.ts`.

מה מומלץ לבדוק ידנית אחרי הרצה
1. התחברות: וודאו ש־sessionStorage מכיל `token` לאחר login.
2. קריאות מוגנות: בתעבורת הרשת (Network) בדקו שכל בקשה ל־`/api/*` כוללת header `Authorization: Bearer <token>`.
3. Logout: לאחר logout אין token ב־sessionStorage וה־guard מנווט ל־/login.

פיתוח נוסף מומלץ (אופציונלי)
- להוסיף בדיקות E2E (Cypress/Playwright) לכיסוי זרימות: login → teams → projects → tasks → comments.
- להריץ Lighthouse/axe לאaudit נגישות ולשפר ARIA/contrast בהתאם.
- להוסיף מדיניות טיפול בטעויות 500/404 מרכזית או Retry/Backoff במקום שבו זה רלוונטי.

מדריך פריסה מהיר (production)
1. עדכון `src/environments/environment.prod.ts` עם כתובת ה‑API הייצורית.
2. בנייה לפרודקשן:

```bash
npm run build
# או
ng build --configuration production
```

3. פרסו את תיקיית ה־`dist` בהתאם לפלטפורמת ה‑hosting שלכם (Netlify/Render/Vercel/NGINX).

קישורים שימושיים
- תיעוד ה‑API (שרת): `WolfTasksServer-main/docs/API.md`.

אם תרצה, אעדכן את ה־README עם הוראות פריסה מפורטות ל‑Render, אוסיף דוגמאות `curl` שימושיות להפעלת API מקומית, או אצרף סקריפט `npm run health` שיבדוק את `GET /health` לפני הרצת האפליקציה.
אוכל להמשיך וליישם את השלבים הבאים:
