import {
  FileText, SealCheck, Prohibit, Bank, SignOut, Certificate, Money, ArrowUp,
  AirplaneLanding, Stamp, AirplaneTakeoff, FirstAidKit, Gift, Buildings,
  BookOpen, AirplaneTilt, House, EnvelopeSimple, Receipt, Wallet, FolderSimple,
  TreePalm, UsersThree, type Icon,
} from '@phosphor-icons/react'
import type { RequestCategory } from '@/data/requestTypes'

/**
 * One icon per request type, mirroring the Oracle self-service tiles.
 * Kept out of `requestTypes.ts` so the data stays framework-free.
 */
const iconMap: Record<string, Icon> = {
  'salary-freeze':          SealCheck,
  'cancel-salary-freeze':   Prohibit,
  'bank-change':            Bank,
  'end-of-service':         SignOut,
  'experience-certificate': Certificate,
  'salary-statement':       FileText,
  loan:                     Money,
  'salary-suspension-lift': ArrowUp,
  'resume-after-leave':     AirplaneLanding,
  'chamber-attestation':    Stamp,
  'exit-reentry':           AirplaneTakeoff,
  'medical-insurance':      FirstAidKit,
  'marriage-newborn':       Gift,
  'government-relations':   Buildings,
  'classes-allowance':      BookOpen,
  'ticket-allowance':       AirplaneTilt,
  'housing-allowance':      House,
  'notice-letter':          EnvelopeSimple,
}

export const iconForType = (id?: string): Icon => (id ? iconMap[id] : undefined) ?? FileText

/** Icon per category, used for the section headings in the request picker. */
const categoryIconMap: Record<RequestCategory, Icon> = {
  salary:     Wallet,
  documents:  FolderSimple,
  leave:      TreePalm,
  hr:         UsersThree,
  allowances: Gift,
}

export const iconForCategory = (id: RequestCategory): Icon => categoryIconMap[id] ?? FileText

/** Request-number prefix per category, e.g. «REQ» for everything in the demo */
export const receiptIcon = Receipt
