import type { Employee } from '@/types'

/**
 * Demo employee directory seed.
 * In production this is replaced by `GET /employees`.
 */
export const seedEmployees: Employee[] = [
  {
    id: 'employee@hr.com',
    name: 'أحمد محمد علي',
    email: 'employee@hr.com',
    employeeNumber: 'EMP-1024',
    department: 'تقنية المعلومات',
    position: 'مطور برمجيات',
    location: 'الرياض - المقر الرئيسي',
    nationality: 'سعودي',
    hireDate: '2021-03-14',
    monthlySalary: 12000,
    managerId: 'manager@hr.com',
    role: 'employee',
    status: 'active',
    dependents: [
      { id: 'dep-1', name: 'مريم أحمد', relation: 'زوجة', birthDate: '1993-06-02', gender: 'أنثى', idNumber: '1098765432' },
      { id: 'dep-2', name: 'يوسف أحمد', relation: 'ابن',   birthDate: '2018-01-20', gender: 'ذكر', idNumber: '1122334455' },
      { id: 'dep-3', name: 'سارة أحمد', relation: 'ابنة',  birthDate: '2021-09-11', gender: 'أنثى', idNumber: '2233445566' },
    ],
  },
  {
    id: 'manager@hr.com',
    name: 'محمد عبدالله',
    email: 'manager@hr.com',
    employeeNumber: 'EMP-1002',
    department: 'تقنية المعلومات',
    position: 'مدير القسم',
    location: 'الرياض - المقر الرئيسي',
    nationality: 'سعودي',
    hireDate: '2017-08-01',
    monthlySalary: 18000,
    managerId: 'admin@hr.com',
    role: 'manager',
    status: 'active',
    dependents: [],
  },
  {
    id: 'admin@hr.com',
    name: 'سارة أحمد',
    email: 'admin@hr.com',
    employeeNumber: 'EMP-1001',
    department: 'الموارد البشرية',
    position: 'مسؤول النظام',
    location: 'الرياض - المقر الرئيسي',
    nationality: 'سعودية',
    hireDate: '2016-01-05',
    monthlySalary: 16000,
    managerId: null,
    role: 'admin',
    status: 'active',
    dependents: [],
  },
  {
    id: 'omar@hr.com',
    name: 'عمر الزهراني',
    email: 'omar@hr.com',
    employeeNumber: 'EMP-1086',
    department: 'تقنية المعلومات',
    position: 'مهندس شبكات',
    location: 'جدة - فرع الغربية',
    nationality: 'سعودي',
    hireDate: '2022-11-06',
    monthlySalary: 9500,
    managerId: 'manager@hr.com',
    role: 'employee',
    status: 'active',
    dependents: [
      { id: 'dep-4', name: 'هند عمر', relation: 'زوجة', birthDate: '1995-02-17', gender: 'أنثى', idNumber: '3344556677' },
    ],
  },
  {
    id: 'fatima@hr.com',
    name: 'فاطمة علي سعد',
    email: 'fatima@hr.com',
    employeeNumber: 'EMP-1031',
    department: 'المالية',
    position: 'محاسب أول',
    location: 'الرياض - المقر الرئيسي',
    nationality: 'سعودية',
    hireDate: '2019-05-19',
    monthlySalary: 11000,
    managerId: 'admin@hr.com',
    role: 'employee',
    status: 'active',
    dependents: [],
  },
  {
    id: 'khaled@hr.com',
    name: 'خالد إبراهيم',
    email: 'khaled@hr.com',
    employeeNumber: 'EMP-1042',
    department: 'المبيعات',
    position: 'مندوب مبيعات',
    location: 'الدمام - فرع الشرقية',
    nationality: 'سعودي',
    hireDate: '2020-02-23',
    monthlySalary: 9000,
    managerId: 'admin@hr.com',
    role: 'employee',
    status: 'active',
    dependents: [],
  },
  {
    id: 'noura@hr.com',
    name: 'نورة سعد الغامدي',
    email: 'noura@hr.com',
    employeeNumber: 'EMP-1053',
    department: 'الموارد البشرية',
    position: 'أخصائي موارد بشرية',
    location: 'الرياض - المقر الرئيسي',
    nationality: 'سعودية',
    hireDate: '2018-07-30',
    monthlySalary: 10500,
    managerId: 'admin@hr.com',
    role: 'employee',
    status: 'inactive',
    dependents: [],
  },
  {
    id: 'layan@hr.com',
    name: 'ليان الحربي',
    email: 'layan@hr.com',
    employeeNumber: 'EMP-1075',
    department: 'المالية',
    position: 'محلل مالي',
    location: 'جدة - فرع الغربية',
    nationality: 'سعودية',
    hireDate: '2023-04-02',
    monthlySalary: 11500,
    managerId: 'admin@hr.com',
    role: 'employee',
    status: 'active',
    dependents: [],
  },
]

/* ────────────────────────────────────────
   Live registry
   ────────────────────────────────────────
   `employeesStore` calls `setEmployees`
   whenever the admin adds/edits/removes a
   member, keeping this module-level copy
   in sync so framework-free helpers below
   (and `lib/requests`) always see the
   current directory.
──────────────────────────────────────── */

let registry: Employee[] = seedEmployees

export const getEmployees = () => registry

export const setEmployees = (list: Employee[]) => {
  registry = list
}

export const getEmployeeById = (id?: string | null) =>
  id ? registry.find(e => e.id === id) ?? null : null

export const getEmployeeByEmail = (email?: string | null) =>
  registry.find(e => e.id === email) ?? null

/** Employees reporting to a given manager id */
export const getTeam = (managerId?: string | null) =>
  managerId ? registry.filter(e => e.managerId === managerId) : []
