import type { ApprovalRole } from '@/types'

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
  approvalFlow?: ApprovalRole[]
  roles?: ('employee' | 'manager' | 'admin')[]
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
      { id: 'previous_request', label: 'طلب تثبيت الراتب السابق', type: 'select', required: true, help: 'اختر الطلب الذي تريد إلغاءه' },
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
      { id: 'employee_name', label: 'اسم الموظف', type: 'text', required: true, readOnly: true },
      { id: 'service_period', label: 'فترة الخدمة', type: 'text', required: true, readOnly: true },
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
      { id: 'destination_name', label: 'اسم الجهة', type: 'select', required: true, placeholder: 'اختر نوع الجهة أولاً' },
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
    description: 'طلب سلفة بحد أقصى يعادل راتب ثلاثة أشهر',
    color: '#f97316',
    category: 'salary',
    approvalFlow: ['manager', 'admin'],
    attachments: { required: false, hint: 'مرفقات إن وجدت' },
    fields: [
      { id: 'amount', label: 'مبلغ السلفة', type: 'number', required: true, min: 1, placeholder: 'يُحدد حسب الراتب', help: 'أقصى مبلغ = مجموع 3 أشهر من الراتب' },
      { id: 'installments', label: 'عدد الأقساط', type: 'select', required: true, options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      { id: 'monthly_deduction', label: 'مبلغ الخصم الشهري', type: 'number', required: true, min: 1, help: 'يُحسب تلقائياً = مبلغ السلفة ÷ عدد الأقساط' },
      { id: 'payroll_date', label: 'فترة المعالجة', type: 'date', required: true, help: 'تاريخ نزول السلفة مع الراتب' },
      { id: 'guarantor_number', label: 'الموظف الكفيل', type: 'select', required: true },
      { id: 'guarantor_name', label: 'اسم الموظف الكفيل', type: 'text', required: true, readOnly: true },
      { id: 'guarantor_hire_date', label: 'تاريخ تعيين الكفيل', type: 'date', required: true, readOnly: true },
      { id: 'guarantor_service_period', label: 'مدة خدمة الكفيل', type: 'text', required: true, readOnly: true },
      { id: 'assignment_set', label: 'مجموعة الموظفين (Assignment Set)', type: 'select', required: true, options: ['جميع الموظفين', 'الموظفون السعوديون', 'الموظفون غير السعوديين', 'تقنية المعلومات', 'الموارد البشرية', 'المالية', 'المبيعات'] },
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
      { id: 'previous_request', label: 'طلب إيقاف الراتب السابق', type: 'select', required: true, help: 'اختر الطلب لعرض سبب الإيقاف وتاريخه' },
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
      { id: 'last_leave_type', label: 'نوع آخر إجازة', type: 'text', required: true, readOnly: true },
      { id: 'last_leave_start', label: 'تاريخ بداية آخر إجازة', type: 'date', required: true, readOnly: true },
      { id: 'last_leave_end', label: 'تاريخ نهاية آخر إجازة', type: 'date', required: true, readOnly: true },
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
      { id: 'request_date', label: 'تاريخ الطلب', type: 'date', required: true, readOnly: true },
      { id: 'event_date', label: 'تاريخ الحدث', type: 'date', required: true },
      { id: 'payroll_date', label: 'فترة المعالجة', type: 'date', required: true },
      { id: 'eligibility', label: 'أحقية الطلب', type: 'select', required: true, options: ['مستحق', 'غير مستحق'] },
      { id: 'assignment_set', label: 'مجموعة الموظفين (Assignment Set)', type: 'select', required: true, options: ['جميع الموظفين', 'الموظفون السعوديون', 'الموظفون غير السعوديين', 'تقنية المعلومات', 'الموارد البشرية', 'المالية', 'المبيعات'] },
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
      { id: 'ticket_for', label: 'صرف بدل تذكرة عن', type: 'select', required: true, options: ['الموظف', 'تابع'] },
      { id: 'dependent_id', label: 'التابع', type: 'dependent', required: false },
      { id: 'dependent_name', label: 'اسم التابع', type: 'text', required: false, readOnly: true },
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
      { id: 'pending_requests_count', label: 'طلبات بدل السكن المعلقة', type: 'number', required: true, readOnly: true },
      { id: 'department', label: 'الإدارة', type: 'text', required: true, readOnly: true },
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
      { id: 'opening_ar', label: 'مقدمة الخطاب بالعربي', type: 'text', required: true, readOnly: true },
      { id: 'opening_en', label: 'مقدمة الخطاب بالإنجليزي', type: 'text', required: true, readOnly: true },
      { id: 'destination_name', label: 'اسم الجهة بالعربي', type: 'text', required: true },
      { id: 'destination_name_en', label: 'اسم الجهة بالإنجليزي', type: 'text', required: true },
      { id: 'sponsor_entity', label: 'جهة الكفالة', type: 'text', required: true },
      { id: 'residence_profession', label: 'المهنة في الإقامة', type: 'text', required: true },
      { id: 'pending_requests_count', label: 'الخطابات المعلقة', type: 'number', required: true, readOnly: true },
      { id: 'include_salary', label: 'تضمين الراتب', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'chamber_of_commerce', label: 'التصديق من الغرفة التجارية', type: 'select', required: true, options: ['نعم', 'لا'] },
      { id: 'deduction_ack', label: 'أقر بخصم رسوم التصديق من راتبي', type: 'checkbox', required: false },
      { id: 'purpose', label: 'الغرض', type: 'text', required: true },
    ],
  },
  {
    id: 'leave-annual',
    title: 'إجازة سنوية',
    description: 'تقديم ومتابعة طلب إجازة سنوية',
    color: '#8b5cf6',
    category: 'leave',
    roles: ['employee'],
    fields: [
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ النهاية', type: 'date', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 90 },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'leave-bereavement',
    title: 'إجازة وفاة',
    description: 'طلب إجازة وفاة مع تحديد صلة القرابة',
    color: '#64748b',
    category: 'leave',
    roles: ['employee'],
    fields: [
      { id: 'relative', label: 'صلة القرابة', type: 'select', required: true, options: ['الأب', 'الأم', 'الزوج أو الزوجة', 'الابن أو الابنة', 'الأخ أو الأخت'] },
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ النهاية', type: 'date', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 30 },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'leave-exam',
    title: 'إجازة امتحان',
    description: 'طلب إجازة لأداء اختبار أو امتحان',
    color: '#06b6d4',
    category: 'leave',
    roles: ['employee'],
    attachments: { required: true, hint: 'ارفق جدول الاختبارات أو ما يثبت موعد الامتحان' },
    fields: [
      { id: 'institution', label: 'الجهة التعليمية', type: 'text', required: true },
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ النهاية', type: 'date', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 30 },
    ],
  },
  {
    id: 'leave-hajj',
    title: 'إجازة حج',
    description: 'تقديم طلب إجازة لأداء فريضة الحج',
    color: '#10b981',
    category: 'leave',
    roles: ['employee'],
    attachments: { required: true, hint: 'ارفق المستندات الداعمة للطلب' },
    fields: [
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ النهاية', type: 'date', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 30 },
      { id: 'previous_hajj', label: 'هل سبق لك أداء الحج؟', type: 'select', required: true, options: ['لا', 'نعم'] },
    ],
  },
  {
    id: 'leave-marriage',
    title: 'إجازة زواج',
    description: 'طلب إجازة بمناسبة الزواج',
    color: '#ec4899',
    category: 'leave',
    roles: ['employee'],
    attachments: { required: true, hint: 'ارفق عقد الزواج أو ما يثبت المناسبة' },
    fields: [
      { id: 'event_date', label: 'تاريخ الزواج', type: 'date', required: true },
      { id: 'start_date', label: 'تاريخ بداية الإجازة', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ نهاية الإجازة', type: 'date', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 30 },
    ],
  },
  {
    id: 'leave-sale',
    title: 'بيع جزء من رصيد الإجازة',
    description: 'طلب تعويض نقدي مقابل أيام من رصيد الإجازة',
    color: '#f59e0b',
    category: 'leave',
    roles: ['employee'],
    fields: [
      { id: 'days_count', label: 'عدد الأيام المطلوب بيعها', type: 'number', required: true, min: 1, max: 30 },
      { id: 'amount', label: 'قيمة التعويض المطلوبة', type: 'number', required: true, min: 1 },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'leave-donation',
    title: 'التبرع برصيد إجازة',
    description: 'طلب تحويل أيام من رصيدك إلى زميل',
    color: '#14b8a6',
    category: 'leave',
    roles: ['employee'],
    fields: [
      { id: 'recipient_id', label: 'البريد الإلكتروني للموظف المستفيد', type: 'text', required: true, placeholder: 'colleague@company.com' },
      { id: 'recipient_name', label: 'اسم الموظف المستفيد', type: 'text', required: true },
      { id: 'days_count', label: 'عدد الأيام', type: 'number', required: true, min: 1, max: 30 },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'employee-clearance',
    title: 'إخلاء طرف',
    description: 'طلب إخلاء طرف ومتابعة اعتماد الجهات المعنية',
    color: '#6366f1',
    category: 'documents',
    roles: ['employee'],
    fields: [
      { id: 'clearance_date', label: 'التاريخ المطلوب', type: 'date', required: true },
      { id: 'reason', label: 'سبب الطلب', type: 'textarea', required: true },
    ],
  },
  {
    id: 'bank-clearance',
    title: 'إخلاء طرف من البنك',
    description: 'طلب مستند إخلاء طرف بنكي',
    color: '#0ea5e9',
    category: 'documents',
    roles: ['employee'],
    fields: [
      { id: 'bank_name', label: 'اسم البنك', type: 'text', required: true },
      { id: 'account_reference', label: 'رقم مرجعي للحساب', type: 'text', required: false },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'resignation',
    title: 'استقالة',
    description: 'تقديم طلب استقالة وتحديد آخر يوم عمل',
    color: '#ef4444',
    category: 'hr',
    roles: ['employee'],
    approvalFlow: ['manager', 'admin'],
    attachments: { required: false, hint: 'يمكن إرفاق خطاب الاستقالة' },
    fields: [
      { id: 'last_day', label: 'آخر يوم عمل مقترح', type: 'date', required: true },
      { id: 'reason', label: 'سبب الاستقالة', type: 'textarea', required: true },
    ],
  },
  {
    id: 'manager-stop-salary',
    title: 'إيقاف راتب موظف',
    description: 'طلب إيقاف راتب موظف مع توثيق السبب وتاريخ التنفيذ',
    color: '#dc2626',
    category: 'salary',
    roles: ['manager', 'admin'],
    fields: [
      { id: 'effective_date', label: 'تاريخ التنفيذ', type: 'date', required: true },
      { id: 'reason', label: 'سبب إيقاف الراتب', type: 'textarea', required: true },
      { id: 'reference', label: 'رقم القرار أو المرجع', type: 'text', required: false },
    ],
  },
  {
    id: 'manager-cancel-termination',
    title: 'إلغاء إنهاء خدمة',
    description: 'طلب إلغاء قرار إنهاء خدمة سابق',
    color: '#f97316',
    category: 'hr',
    roles: ['manager', 'admin'],
    fields: [
      { id: 'termination_request_id', label: 'رقم طلب إنهاء الخدمة', type: 'text', required: true },
      { id: 'reason', label: 'سبب الإلغاء', type: 'textarea', required: true },
    ],
  },
  {
    id: 'manager-assignment',
    title: 'قرار تكليف',
    description: 'إنشاء طلب قرار تكليف لموظف من الفريق',
    color: '#7c3aed',
    category: 'hr',
    roles: ['manager', 'admin'],
    fields: [
      { id: 'assignment', label: 'المهمة أو جهة التكليف', type: 'text', required: true },
      { id: 'location', label: 'موقع التكليف', type: 'text', required: true },
      { id: 'start_date', label: 'تاريخ البداية', type: 'date', required: true },
      { id: 'end_date', label: 'تاريخ النهاية', type: 'date', required: true },
      { id: 'reason', label: 'ملاحظات', type: 'textarea', required: false },
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
