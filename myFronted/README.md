# MyFronted

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

# MyFronted

מדריך מהיר לפרויקט הפרונטאנד (Angular)

## חיבור ל־API (`apiBaseUrl`)

הפרויקט משתמש בערכי סביבה בנתיב `src/environments` כדי להגדיר את כתובת ה־API:

- `src/environments/environment.ts` — פיתוח (local)
- `src/environments/environment.prod.ts` — פרודקשן

הערך לשינוי הוא `apiBaseUrl`. דוגמה ל־`environment.ts`:

```ts
export const environment = {
	production: false,
	apiBaseUrl: 'http://localhost:3000/api'
};
```

אם רוצים להשתמש ב־`.env` חיצוני, יש להגדיר תהליך build שיחליף משתנים אלה או לנהל אותם בזמן פריסה.

## התקנה והרצה מקומית

1. התקנת תלויות:

```powershell
cd myFronted
npm install
```

2. הרצת סרבר פיתוח:

```powershell
npm run start
# או
ng serve
```

הדפדפן יפתח בכתובת `http://localhost:4200/` (ברירת מחדל של Angular).

3. ודאו שה־API רץ (למשל `http://localhost:3000`) וש־`environment.apiBaseUrl` מתאים.

## מהשינויים שבוצעו בפרויקט

- הוספת `authGuard` והגנה על ראוטים פרטיים.
- שינוי אחסון טוקן ל־in-memory + `sessionStorage` (המלצה על אבטחה).
- אינטרספטור שמוסיף `Authorization: Bearer <token>` וטיפול גלובלי ב־401/403.
- הוצאת כתובת ה־API לקבצי `environment`.
- שירות `Toast` קל לתצוגת הודעות במקום `alert()`.
- שדרוג שירותי `Auth` להחזיר `Observable` במקום `subscribe()` פנימי.
- ניווט `Teams -> Projects` עם `teamId` כ־query param.

## האם להמשיך?

אוכל להמשיך וליישם את השלבים הבאים:
- להוסיף ARIA ושיפורי נגישות ברכיבים
- לעדכן README בהוראות פריסה על Render
- להריץ בדיקת build/compile כדי לאתר שגיאות TypeScript

ספר/י לי מה להמשיך לבצע.
