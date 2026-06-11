import { 
  LayoutDashboard,
  BrainCircuit,
  Briefcase,
  PieChart,
  Settings,
  DollarSign,
  TrendingUp,
  BarChart3,
  Percent
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path?: string;
  name: string;
  nameTh?: string;
  icon?: any;
  isConfidential?: boolean;
  category?: string;
  subItems?: { id: string; name: string; nameTh?: string; path: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Top Level
  { id: 'dashboard', path: '/', name: 'OVERVIEW', nameTh: 'ภาพรวม', icon: LayoutDashboard, category: 'TOP' },
  { id: 'copilot', path: '/copilot', name: 'AI COPILOT', nameTh: 'ผู้ช่วย AI', icon: BrainCircuit, category: 'TOP' },
  { id: 'cb_margin', name: 'MARGIN', nameTh: 'กำไรขั้นต้น', path: '/core/margin', icon: DollarSign, category: 'TOP' },
  { id: 'cb_sale', name: 'SALE REVENUE', nameTh: 'รายได้จากการขาย', path: '/core/sale-revenue', icon: TrendingUp, category: 'TOP' },
  { id: 'cb_cost', name: 'COST & EXPENSE', nameTh: 'ต้นทุนและค่าใช้จ่าย', path: '/core/cost-expense', icon: BarChart3, category: 'TOP' },
  { id: 'da_sale', name: 'SALE ANALYSIS', nameTh: 'วิเคราะห์การขาย', path: '/data/sale', icon: PieChart, category: 'TOP' },
  { id: 'da_expense', name: 'EXPENSE ANALYSIS', nameTh: 'วิเคราะห์ค่าใช้จ่าย', path: '/data/expense', icon: Percent, category: 'TOP' },
  { id: 'da_margin', name: 'MARGIN ANALYSIS', nameTh: 'วิเคราะห์กำไร', path: '/data/margin', icon: Briefcase, category: 'TOP' },
  
  // ADMINISTRATION
  { 
    id: 'system_settings', 
    name: 'SETTINGS',
    nameTh: 'การตั้งค่าระบบ', 
    icon: Settings, 
    category: 'ADMINISTRATION',
    subItems: [
      { id: 'user_permission', name: 'USER PERMISSION', nameTh: 'สิทธิ์ผู้ใช้งาน', path: '/permissions' },
      { id: 'system_config', name: 'SYSTEM CONFIG', nameTh: 'ตั้งค่าระบบ', path: '/settings' },
      { id: 'google_sheets_sync', name: 'GOOGLE SHEETS SYNC', nameTh: 'ซิงค์ข้อมูล Google Sheets', path: '/google-sheets' },
      { id: 'auto_sync', name: 'AUTO SYNC', nameTh: 'ซิงค์อัตโนมัติ', path: '/auto-sync' },
      { id: 'dev_permit', name: 'DEV PERMIT BETA', nameTh: 'สิทธิ์นักพัฒนา', path: '/dev-permit' },
      { id: 'dev_logs', name: 'SYSTEM LOGS', nameTh: 'บันทึกระบบ', path: '/dev-logs' }
    ]
  }
];
