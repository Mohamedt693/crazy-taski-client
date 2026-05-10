import { create } from 'zustand';
import api from '../api/axios';

interface Stat {
  title: string;
  value: string;
  sub: string;
  color: string;
}

interface RecentProject {
  _id: string;
  name: string;
  tasksCount: number;
  progress: number;
}

interface QuickNote {
  _id: string;
  content: string;
}

interface FocusTask {
  _id: string;
  title: string;
  isCompleted: boolean;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  projectId?: string;
}

interface DashboardReminder {
  _id: string;
  title: string;
  remindAt: string; 
}

interface DashboardData {
  stats: Stat[];
  focusTasks: FocusTask[]; 
  recentProjects: RecentProject[];
  quickNotes: QuickNote[];
  reminders: DashboardReminder[];
}

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    data: null,
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get('/dashboard/home');

            const dashboardData = response.data.data || response.data;

            set({ data: dashboardData });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            set({ error: "Failed to fetch dashboard data" });
        } finally {
            set({ isLoading: false });
        }
    },
}));