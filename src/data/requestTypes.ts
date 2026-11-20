export type FieldType =
  | 'text'
  | 'date'
  | 'select'
  | 'number'
  | 'file'
  | 'textarea'
  | 'checkbox'
  | 'iban'
  | 'dependent'

export interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
  placeholder?: string
  /** Short helper shown under the field */
  help?: string
  min?: number
  max?: number
  maxLength?: number
  /** Filled automatically from the employee/dependent record */
  readOnly?: boolean
  /** Stored with the request but not rendered as an input */
  hidden?: boolean
}

export type RequestCategory = 'salary' | 'leave' | 'documents' | 'hr' | 'allowances'

export interface RequestType {
  id: string
  title: string
  description: string
  color: string
  category: RequestCategory
  fields: FormField[]
  attachments?: { required: boolean; hint: string }
}

/* ════════════════════════════════════════
   REQUEST CATALOGUE
   Mirrors the Oracle self-service processes
   in hr.pdf (+ the appendix extras).
════════════════════════════════════════ */
export const requestTypes: RequestType[] = [
  {
    id: 'salary-freeze',
    title: 'خطاب تثبيت راتب',
    description: 'طلب خطاب تثبيت الراتب لأغراض رسمية (بنك، سفارة، تأشيرة)',
    color: '#3b6bfa',
    category: 'salary',
    attachments: { required: false, hint: 'مرفقات إضافية إن وجدت' },
    fields: [
      { id: 'language', label: 'لغة الخطاب', type: 'select', required: true, options: ['عربي', 'إنجليزي'] },
      { id: 'bank_name', label: 'اسم البنك الحالي', type: 'text', required: true, placeholder: 'أدخل اسم البنك' },
      { id: 'purpose', label: 'الغرض', type: 'select', required: true, options: ['قرض عقاري', 'قرض شخصي', 'تأشيرة', 'تأشيرة زيارة', 'أخرى'] },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false, placeholder: 'أي ملاحظات إضافية' },
    ],
  },
  {
    id: 'cancel-salary-freeze',
    title: 'إلغاء تثبيت راتب',
    description: 'إلغاء طلب خطاب تثبيت راتب سابق',
    color: '#f59e0b',
    category: 'salary',
    fields: [
      { id: 'previous_request', label: 'رقم الطلب السابق', type: 'text', required: true, placeholder: 'REQ-2026-0001', help: 'تجد الرقم في صفحة «طلباتي»' },
      { id: 'notes', label: 'سبب الإلغاء', type: 'textarea', required: false },
    ],
  },
  {
    id: 'bank-change',
    title: 'تغيير الحساب البنكي',
    description: 'تحديث بيانات الحساب البنكي لصرف الراتب',
    color: '#10b981',
    category: 'salary',
    attachments: { required: true, hint: 'خطاب البنك أو شهادة الآيبان (PDF / صورة)' },
    fields: [
      { id: 'bank_name', label: 'البنك', type: 'select', required: true, options: ['الراجحي', 'الأهلي', 'الرياض', 'سامبا', 'الإنماء', 'البلاد', 'الجزيرة'] },
      { id: 'iban', label: 'رقم الآيبان (IBAN)', type: 'iban', required: true, placeholder: 'SA0000000000000000000000' },
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'end-of-service',
    title: 'إنهاء العلاقة التعاقدية',
    description: 'تقديم طلب إنهاء الخدمة للموظف',
    color: '#ef4444',
    category: 'hr',
    attachments: { required: true, hint: 'خطاب الاستقالة أو قرار إنهاء الخدمة' },
    fields: [
      { id: 'termination_type', label: 'نوع إنهاء الخدمة', type: 'select', required: true, options: ['استقالة', 'إنهاء من الشركة', 'انتهاء العقد', 'تقاعد', 'وفاة'] },
      { id: 'last_day', label: 'آخر يوم عمل', type: 'date', required: true },
      { id: 'reason', label: 'الأسباب', type: 'select', required: true, options: ['ظروف شخصية', 'عرض عمل أفضل', 'عدم توافق وظيفي', 'أخرى'] },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'experience-certificate',
    title: 'شهادة خبرة',
    description: 'طلب شهادة خبرة رسمية من الشركة',
    color: '#8b5cf6',
    category: 'documents',
    attachments: { required: false, hint: 'مستندات داعمة إن وجدت' },
    fields: [
      { id: 'nationality', label: 'الجنسية', type: 'text', required: true, placeholder: 'سعودي' },
      { id: 'purpose', label: 'الغرض', type: 'select', required: true, options: ['بحث عن عمل', 'سفارة', 'بنك', 'جهة حكومية', 'أخرى'] },
      { id: 'dms_reference', label: 'مرجع المستند (DMS)', type: 'text', required: false, placeholder: 'يُملأ تلقائياً إن وجد' },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'salary-statement',
    title: 'خطاب تعريف الراتب',
    description: 'طلب خطاب تعريف بالراتب والوظيفة',
    color: '#06b6d4',
    category: 'documents',
    attachments: { required: false, hint: 'مرفقات إضافية إن وجدت' },
    fields: [
      { id: 'destination_type', label: 'نوع الجهة', type: 'select', required: true, options: ['سفارة', 'بنك', 'جهة حكومية', 'أخرى'] },
      { id: 'destination_name', label: 'اسم الجهة بالعربي', type: 'text', required: true, placeholder: 'اسم الجهة' },
      { id: 'destination_name_en', label: 'اسم الجهة بالإنجليزي', type: 'text', required: true, placeholder: 'Destination name' },
      { id: 'include_salary', label: 'تضمين الراتب', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'chamber_of_commerce', label: 'التصديق من الغرفة التجارية', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'deduction_ack', label: 'أقر بخصم قيمة التصديق من راتبي عند اختيار «نعم»', type: 'checkbox', required: false },
      { id: 'purpose_ar', label: 'الغرض من التعريف بالعربي', type: 'text', required: true },
      { id: 'purpose_en', label: 'الغرض من التعريف بالإنجليزي', type: 'text', required: true },
    ],
  },
  {
    id: 'loan',
    title: 'سلفة',
    description: 'طلب سلفة من الراتب بحد أقصى 3 أشهر (9000 ريال)',
    color: '#f97316',
    category: 'salary',
    attachments: { required: false, hint: 'مرفقات إن وجدت' },
    fields: [
      { id: 'amount', label: 'مبلغ السلفة', type: 'number', required: true, min: 1, max: 9000, placeholder: 'الحد الأقصى 9000', help: 'أقصى مبلغ = مجموع 3 أشهر من الراتب' },
      { id: 'installments', label: 'عدد الأقساط', type: 'select', required: true, options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      { id: 'monthly_deduction', label: 'مبلغ الخصم الشهري', type: 'number', required: true, min: 1, help: 'يُحسب تلقائياً = مبلغ السلفة ÷ عدد الأقساط' },
      { id: 'payroll_date', label: 'فترة المعالجة', type: 'date', required: true, help: 'تاريخ نزول السلفة مع الراتب' },
      { id: 'guarantor_number', label: 'رقم الموظف الكفيل', type: 'text', required: true, placeholder: 'EMP-1002' },
      { id: 'guarantor_name', label: 'اسم الموظف الكفيل', type: 'text', required: true },
      { id: 'guarantor_hire_date', label: 'تاريخ تعيين الكفيل', type: 'date', required: false },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'salary-suspension-lift',
    title: 'رفع إيقاف راتب',
    description: 'رفع إيقاف الراتب لموظف',
    color: '#ec4899',
    category: 'salary',
    fields: [
      { id: 'previous_request', label: 'رقم طلب الإيقاف السابق', type: 'text', required: true, placeholder: 'REQ-2026-0006' },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'resume-after-leave',
    title: 'مباشرة عمل بعد إجازة',
    description: 'تسجيل مباشرة العمل بعد إجازة 5 أيام أو أكثر',
    color: '#14b8a6',
    category: 'leave',
    attachments: { required: true, hint: 'ما يثبت الإجازة (تقرير طبي / موافقة الإجازة)' },
    fields: [
      { id: 'last_leave_type', label: 'نوع آخر إجازة', type: 'select', required: true, options: ['سنوية', 'مرضية', 'بدون راتب', 'اضطرارية'] },
      { id: 'last_leave_start', label: 'تاريخ بداية آخر إجازة', type: 'date', required: true },
      { id: 'last_leave_end', label: 'تاريخ نهاية آخر إجازة', type: 'date', required: true },
      { id: 'return_date', label: 'تاريخ المباشرة', type: 'date', required: true, help: 'يجب أن يكون بعد تاريخ نهاية الإجازة' },
    ],
  },
  {
    id: 'chamber-attestation',
    title: 'تصديق غرفة تجارية',
    description: 'تصديق معاملة من الغرفة التجارية',
    color: '#6366f1',
    category: 'documents',
    attachments: { required: true, hint: 'صورة المعاملة المطلوب تصديقها' },
    fields: [
      { id: 'transaction_type', label: 'نوع المعاملة', type: 'text', required: true },
      { id: 'transaction_number', label: 'رقم المعاملة', type: 'text', required: true },
      { id: 'deduction_ack', label: 'أقر بخصم قيمة التصديق من راتبي', type: 'checkbox', required: true },
    ],
  },
  {
    id: 'exit-reentry',
    title: 'خروج وعودة / نهائي',
    description: 'طلب تأشيرة خروج وعودة أو خروج نهائي',
    color: '#d946ef',
    category: 'hr',
    attachments: { required: true, hint: 'صورة الإقامة أو الجواز' },
    fields: [
      { id: 'leave_type', label: 'النوع', type: 'select', required: true, options: ['أعمال', 'سنوية', 'مرضية'] },
      { id: 'exit_type', label: 'نوع التأشيرة', type: 'select', required: true, options: ['خروج نهائي', 'منفرد (خروج وعودة)'] },
      { id: 'last_vacation', label: 'آخر إجازة', type: 'date', required: false },
      { id: 'duration', label: 'المدة', type: 'number', required: true, min: 1, max: 180, placeholder: 'بالأيام' },
    ],
  },
  {
    id: 'medical-insurance',
    title: 'إضافة تأمين طبي',
    description: 'إضافة أو إزالة تأمين طبي لأحد التابعين المسجلين',
    color: '#0ea5e9',
    category: 'hr',
    attachments: { required: true, hint: 'شهادة الميلاد / عقد الزواج / صك الحضانة' },
    fields: [
      { id: 'action_type', label: 'النوع', type: 'select', required: true, options: ['إضافة', 'إزالة'] },
      { id: 'dependent_id', label: 'التابع المسجل', type: 'dependent', required: true, help: 'يجب تسجيل التابع في صفحة «التابعون» أولاً' },
      { id: 'contact_type', label: 'صفة الشخص', type: 'text', required: true, readOnly: true },
      { id: 'dependent_name', label: 'اسم التابع', type: 'text', required: true, readOnly: true },
      { id: 'gender', label: 'جنس المعال', type: 'text', required: true, readOnly: true },
      { id: 'birth_date', label: 'تاريخ الميلاد', type: 'date', required: true, readOnly: true },
      { id: 'id_number', label: 'رقم الهوية', type: 'text', required: true, readOnly: true, maxLength: 10 },
    ],
  },
  {
    id: 'marriage-newborn',
    title: 'إعانة زواج / هدية مولود',
    description: 'طلب إعانة زواج أو هدية مولود جديد',
    color: '#f43f5e',
    category: 'hr',
    attachments: { required: true, hint: 'عقد الزواج أو شهادة ميلاد المولود' },
    fields: [
      { id: 'request_type', label: 'نوع الطلب', type: 'select', required: true, options: ['دعم زواج', 'هدية مولود جديد'] },
      { id: 'event_date', label: 'تاريخ الحدث', type: 'date', required: true },
      { id: 'payroll_date', label: 'فترة المعالجة', type: 'date', required: true },
      { id: 'eligibility', label: 'أحقية الطلب', type: 'select', required: true, options: ['مستحق', 'غير مستحق'] },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'government-relations',
    title: 'العلاقات الحكومية',
    description: 'طلبات الإقامة والتأشيرات والمعاملات الحكومية',
    color: '#84cc16',
    category: 'hr',
    attachments: { required: false, hint: 'مستندات المعاملة إن وجدت' },
    fields: [
      { id: 'request_type', label: 'نوع الطلب', type: 'select', required: true, options: ['طباعة تأشيرة زائر', 'إصدار إقامة', 'تجديد إقامة', 'تغيير الوظيفة', 'تحديث المعلومات'] },
      { id: 'description', label: 'وصف الطلب', type: 'textarea', required: false },
    ],
  },

  /* ── من قائمة العمليات / الملاحق ── */
  {
    id: 'classes-allowance',
    title: 'بدل حصص إضافية',
    description: 'طلب بدل حصص إضافية عن شهر محدد',
    color: '#a855f7',
    category: 'allowances',
    attachments: { required: true, hint: 'خطاب المدرسة أو جدول الحصص' },
    fields: [
      { id: 'period', label: 'الشهر', type: 'date', required: true },
      { id: 'classes_count', label: 'عدد الحصص الإضافية', type: 'number', required: true, min: 1, max: 100 },
      { id: 'school_name', label: 'الجهة التعليمية', type: 'text', required: false },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'ticket-allowance',
    title: 'بدل تذاكر',
    description: 'طلب بدل تذاكر السفر',
    color: '#f472b6',
    category: 'allowances',
    attachments: { required: true, hint: 'التذكرة أو عرض السعر' },
    fields: [
      { id: 'ticket_type', label: 'نوع التذكرة', type: 'select', required: true, options: ['ذهاب وعودة', 'ذهاب فقط'] },
      { id: 'route', label: 'خط السفر', type: 'text', required: true, placeholder: 'الرياض - القاهرة' },
      { id: 'travel_date', label: 'تاريخ السفر', type: 'date', required: true },
      { id: 'passengers', label: 'عدد التذاكر', type: 'number', required: true, min: 1, max: 6 },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'housing-allowance',
    title: 'بدل سكن',
    description: 'طلب بدل سكن سنوي',
    color: '#22c55e',
    category: 'allowances',
    attachments: { required: true, hint: 'عقد إيجار السكن' },
    fields: [
      { id: 'request_date', label: 'تاريخ الطلب', type: 'date', required: true },
      { id: 'annual_rent', label: 'قيمة الإيجار السنوي', type: 'number', required: true, min: 1 },
      { id: 'contract_start', label: 'بداية العقد', type: 'date', required: true },
      { id: 'contract_end', label: 'نهاية العقد', type: 'date', required: true },
      { id: 'notes', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'notice-letter',
    title: 'خطاب موجه / تعريف راتب موجه',
    description: 'خطاب تعريف راتب موجه إلى جهة محددة',
    color: '#0d9488',
    category: 'documents',
    attachments: { required: false, hint: 'مرفقات إضافية إن وجدت' },
    fields: [
      { id: 'destination_name', label: 'اسم الجهة بالعربي', type: 'text', required: true },
      { id: 'destination_name_en', label: 'اسم الجهة بالإنجليزي', type: 'text', required: true },
      { id: 'include_salary', label: 'تضمين الراتب', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'chamber_of_commerce', label: 'التصديق من الغرفة التجارية', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'purpose', label: 'الغرض', type: 'text', required: true },
    ],
  },
]

/* ── live registry ──
   The admin can add/edit/remove types from the dashboard. The store keeps a
   single source of truth and pushes it here so `getRequestType` — used by
   non-React code and by components that don't subscribe — always sees it. */
let activeTypes: RequestType[] = requestTypes

export const getRequestTypes = () => activeTypes

export const setRequestTypes = (types: RequestType[]) => {
  activeTypes = types
}

export const getRequestType = (id?: string) =>
  activeTypes.find(t => t.id === id) ?? null

export const requestCategories: { id: RequestCategory; label: string }[] = [
  { id: 'salary', label: 'الراتب' },
  { id: 'documents', label: 'الوثائق والخطابات' },
  { id: 'leave', label: 'الإجازات' },
  { id: 'hr', label: 'الموارد البشرية' },
  { id: 'allowances', label: 'البدلات' },
]
