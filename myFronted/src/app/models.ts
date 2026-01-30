export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Team {
  id: number;
  name: string;
  members_count?: number; // מגיע רק ברשימה
}

export interface Project {
  id: number;
  team_id: number; // השרת מחזיר snake_case בקריאת SELECT
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done'; // או כל סטטוס אחר שתחליטי
  priority: 'low' | 'normal' | 'high';
  assignee_id?: number; // השרת שומר ומחזיר את זה ככה
  due_date?: string;    // השרת שומר ומחזיר את זה ככה
  order_index: number;
}

// Interface מיוחד ליצירת משימה (כי השרת מצפה ל-camelCase ביצירה)
export interface CreateTaskPayload {
  projectId: number;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'normal' | 'high';
  assigneeId?: number; // camelCase
  dueDate?: string;    // camelCase
  orderIndex?: number;
}

// Interface מיוחד לעדכון משימה (כי השרת מצפה ל-snake_case בעדכון)
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'normal' | 'high';
  assignee_id?: number; // snake_case
  due_date?: string;    // snake_case
  order_index?: number;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author_name: string; // מגיע מה-JOIN בשרת
}