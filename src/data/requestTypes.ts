export interface RequestType {
  id: string
  title: string
  description: string
  color: string
  category: 'salary' | 'leave' | 'documents' | 'hr'
  fields: FormField[]
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'date' | 'select' | 'number' | 'file' | 'textarea'
  required: boolean
  options?: string[]
  placeholder?: string
}

export const requestTypes: RequestType[] = [
  {
    id: 'salary-freeze',
    title: 'تثبيت راتب',
    description: 'طلب خطاب تثبيت الراتب لأغراض رسمية',
    color: '#3b6bfa',
    category: 'salary',
    fields: [
      { id: 'bank_name',  label: 'اسم البنك',   type: 'text',   required: true,  placeholder: 'أدخل اسم البنك' },
      { id: 'purpose',    label: 'الغرض',       type: 'select', required: true,  options: ['قرض عقاري', 'قرض شخصي', 'تأشيرة', 'أخرى'] },
      { id: 'notes',      label: 'ملاحظات',     type: 'textarea', required: false, placeholder: 'أي ملاحظات إضافية' },
    ],
  },
  {
    id: 'cancel-salary-freeze',
    title: 'إلغاء تثبيت راتب',
    description: 'إلغاء طلب تثبيت راتب سابق',
    color: '#f59e0b',
    category: 'salary',
    fields: [
      { id: 'previous_request', label: 'الطلب السابق', type: 'select', required: true, options: ['طلب #001', 'طلب #002', 'طلب #003'] },
    ],
  },
  {
    id: 'bank-change',
    title: 'تغيير الحساب البنكي',
    description: 'تحديث بيانات الحساب البنكي لصرف الراتب',
    color: '#10b981',
    category: 'salary',
    fields: [
      { id: 'bank_name',    label: 'البنك الجديد',   type: 'select',  required: true,  options: ['الراجحي', 'الأهلي', 'الرياض', 'سامبا', 'الإنماء'] },
      { id: 'iban',         label: 'رقم الآيبان',    type: 'text',    required: true,  placeholder: 'SA...' },
      { id: 'start_date',   label: 'تاريخ البداية',  type: 'date',    required: true },
    ],
  },
  {
    id: 'end-of-service',
    title: 'إنهاء العلاقة التعاقدية',
    description: 'تقديم طلب إنهاء الخدمة للموظف',
    color: '#ef4444',
    category: 'hr',
    fields: [
      { id: 'termination_type', label: 'نوع الإنهاء',    type: 'select', required: true,  options: ['استقالة', 'إنهاء من الشركة', 'انتهاء العقد'] },
      { id: 'last_day',         label: 'آخر يوم عمل',   type: 'date',   required: true },
      { id: 'reason',           label: 'السبب',          type: 'select', required: true,  options: ['ظروف شخصية', 'عرض عمل أفضل', 'أخرى'] },
    ],
  },
  {
    id: 'experience-certificate',
    title: 'شهادة خبرة',
    description: 'طلب شهادة خبرة رسمية من الشركة',
    color: '#8b5cf6',
    category: 'documents',
    fields: [
      { id: 'purpose', label: 'الغرض', type: 'select', required: true, options: ['بحث عن عمل', 'سفارة', 'بنك', 'أخرى'] },
      { id: 'notes',   label: 'ملاحظات', type: 'textarea', required: false },
    ],
  },
  {
    id: 'salary-statement',
    title: 'تعريف الراتب',
    description: 'طلب خطاب تعريف بالراتب والوظيفة',
    color: '#06b6d4',
    category: 'documents',
    fields: [
      { id: 'destination_type', label: 'نوع الجهة',   type: 'select', required: true,  options: ['سفارة', 'بنك', 'أخرى'] },
      { id: 'destination_name', label: 'اسم الجهة',   type: 'text',   required: true,  placeholder: 'اسم الجهة المرسل إليها' },
      { id: 'include_salary',   label: 'تضمين الراتب', type: 'select', required: true,  options: ['نعم', 'لا'] },
      { id: 'purpose_ar',       label: 'الغرض بالعربية', type: 'text', required: true },
      { id: 'purpose_en',       label: 'الغرض بالإنجليزية', type: 'text', required: true },
    ],
  },
  {
    id: 'loan',
    title: 'سلفة',
    description: 'طلب سلفة من الراتب بحد أقصى 3 أشهر',
    color: '#f97316',
    category: 'salary',
    fields: [
      { id: 'amount',       label: 'مبلغ السلفة',    type: 'number', required: true,  placeholder: 'الحد الأقصى 9000' },
      { id: 'installments', label: 'عدد الأقساط',    type: 'select', required: true,  options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      { id: 'guarantor',    label: 'رقم الموظف الكفيل', type: 'text', required: true,  placeholder: 'أدخل رقم الموظف' },
    ],
  },
  {
    id: 'salary-suspension-lift',
    title: 'رفع إيقاف راتب',
    description: 'رفع إيقاف الراتب لموظف',
    color: '#ec4899',
    category: 'salary',
    fields: [
      { id: 'previous_suspension', label: 'طلب الإيقاف السابق', type: 'select', required: true, options: ['طلب #S001', 'طلب #S002'] },
    ],
  },
  {
    id: 'resume-after-leave',
    title: 'مباشرة عمل بعد إجازة',
    description: 'تسجيل مباشرة العمل بعد إجازة 5 أيام أو أكثر',
    color: '#14b8a6',
    category: 'leave',
    fields: [
      { id: 'return_date', label: 'تاريخ المباشرة', type: 'date', required: true },
    ],
  },
  {
    id: 'chamber-attestation',
    title: 'تصديق غرفة تجارية',
    description: 'تصديق معاملة من الغرفة التجارية',
    color: '#6366f1',
    category: 'documents',
    fields: [
      { id: 'transaction_type',   label: 'نوع المعاملة',  type: 'text',   required: true },
      { id: 'transaction_number', label: 'رقم المعاملة',  type: 'text',   required: true },
    ],
  },
  {
    id: 'exit-reentry',
    title: 'خروج وعودة / نهائي',
    description: 'طلب تأشيرة خروج وعودة أو خروج نهائي',
    color: '#d946ef',
    category: 'hr',
    fields: [
      { id: 'leave_type',  label: 'نوع الإجازة',  type: 'select', required: true,  options: ['سنوية', 'عمل', 'مرضية'] },
      { id: 'exit_type',   label: 'نوع التأشيرة', type: 'select', required: true,  options: ['خروج وعودة', 'خروج نهائي'] },
      { id: 'duration',    label: 'المدة',         type: 'number', required: true,  placeholder: 'بالأيام' },
    ],
  },
  {
    id: 'medical-insurance',
    title: 'إضافة تأمين طبي',
    description: 'إضافة تأمين طبي لأحد المعالين',
    color: '#0ea5e9',
    category: 'hr',
    fields: [
      { id: 'dependent',   label: 'التابع',         type: 'select', required: true,  options: ['زوجة', 'ابن', 'ابنة', 'والد', 'والدة'] },
      { id: 'birth_date',  label: 'تاريخ الميلاد',  type: 'date',   required: true },
      { id: 'id_number',   label: 'رقم الهوية',     type: 'text',   required: true },
      { id: 'action_type', label: 'النوع',           type: 'select', required: true,  options: ['إضافة', 'إزالة'] },
    ],
  },
  {
    id: 'marriage-newborn',
    title: 'إعانة زواج / هدية مولود',
    description: 'طلب إعانة زواج أو هدية مولود جديد',
    color: '#f43f5e',
    category: 'hr',
    fields: [
      { id: 'request_type', label: 'نوع الطلب', type: 'select', required: true,  options: ['دعم زواج', 'هدية مولود جديد'] },
      { id: 'request_date', label: 'تاريخ الحدث', type: 'date', required: true },
    ],
  },
  {
    id: 'government-relations',
    title: 'العلاقات الحكومية',
    description: 'طلبات الإقامة والتأشيرات والمعاملات الحكومية',
    color: '#84cc16',
    category: 'hr',
    fields: [
      { id: 'request_type', label: 'نوع الطلب',  type: 'select', required: true,
        options: ['طباعة تأشيرة زائر', 'إقامة', 'تجديد إقامة', 'تغيير الوظيفة', 'تحديث المعلومات'] },
      { id: 'description',  label: 'وصف الطلب', type: 'textarea', required: false },
    ],
  },
]
