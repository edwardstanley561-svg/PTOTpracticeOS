export type PatientStatus = 'INTAKE' | 'ACTIVE' | 'RE_EVAL_DUE' | 'DISCHARGED';
export type AuthAlertStatus = 'EXPIRED' | 'EXHAUSTED' | 'URGENT' | 'VISITS_LOW' | 'SOON' | 'OK';
export type AppointmentStatus = 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED' | 'RESCHEDULED';
export type AppointmentType = 'INITIAL_EVAL' | 'TREATMENT' | 'RE_EVAL' | 'DISCHARGE';
export type ClaimStatus = 'DRAFT' | 'SUBMITTED' | 'PAID' | 'PARTIALLY_PAID' | 'DENIED' | 'APPEALED' | 'WRITTEN_OFF';
export type NoteStatus = 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED' | 'AMENDED' | 'VOIDED';
export type NoteType = 'INITIAL_EVALUATION' | 'SOAP' | 'PROGRESS' | 'RE_EVALUATION' | 'DISCHARGE' | 'HEP';
export type UserRole = 'OWNER' | 'ADMIN' | 'THERAPIST' | 'FRONT_DESK' | 'BILLER' | 'AUDITOR';
export type PayerType = 'COMMERCIAL' | 'MEDICARE' | 'MEDICAID' | 'WORKERS_COMP' | 'SELF_PAY' | 'OTHER';
export type ReferralSourceType = 'PHYSICIAN' | 'CLINIC' | 'HOSPITAL' | 'COMMUNITY' | 'OTHER';
export type PlanStatus = 'ACTIVE' | 'RE_EVAL_DUE' | 'COMPLETED' | 'DISCONTINUED';
export type ReauthStatus = 'NOT_NEEDED_YET' | 'REQUEST_SUBMITTED' | 'APPROVED' | 'DENIED';

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  status: PatientStatus;
  intakeDate: string;
  dischargeDate?: string;
  primaryDiagnosisCode?: string;
  primaryDiagnosisDescription?: string;
  referralSourceId?: string;
  payerId?: string;
}

export interface Payer {
  id: string;
  name: string;
  payerType: PayerType;
  phone?: string;
}

export interface ReferralSource {
  id: string;
  name: string;
  sourceType: ReferralSourceType;
  specialty?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  lastFollowUpDate?: string;
  referralCount: number;
  lastReferralDate?: string;
  needsFollowUp: boolean;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  planName: string;
  diagnosis?: string;
  longTermGoals?: string;
  shortTermGoals?: string;
  frequencyPerWeek?: number;
  frequencyLabel?: string;
  durationPrescribedWeeks?: number;
  startDate?: string;
  targetEndDate?: string;
  reEvalDueDate?: string;
  status: PlanStatus;
  createdBy: string;
}

export interface Authorization {
  id: string;
  patientId: string;
  payerId: string;
  treatmentPlanId?: string;
  authorizationName: string;
  authorizationNumber?: string;
  authorizationStartDate: string;
  authorizationExpirationDate: string;
  visitsAuthorized: number;
  visitsUsed: number;
  reauthStatus: ReauthStatus;
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'CANCELLED';
  alertStatus: AuthAlertStatus;
  assignedOwnerId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId?: string;
  treatmentPlanId?: string;
  authorizationId?: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  startsAt: string;
  endsAt: string;
  locationId?: string;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  appointmentId?: string;
  treatmentPlanId?: string;
  authorId: string;
  noteType: NoteType;
  status: NoteStatus;
  serviceDate: string;
  content: Record<string, any>;
  signedAt?: string;
  signedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  patientId: string;
  payerId?: string;
  appointmentId?: string;
  dateOfService: string;
  claimNumber?: string;
  amountBilledCents: number;
  amountPaidCents: number;
  status: ClaimStatus;
  denialReason?: string;
  followUpDate?: string;
  submittedAt?: string;
  paidAt?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

export interface DashboardData {
  todayAppointments: Appointment[];
  authorizationAlerts: Authorization[];
  reEvalsDue: TreatmentPlan[];
  claimsNeedingAction: Claim[];
  unsignedNotes: ClinicalNote[];
  practicePulse: {
    scheduledToday: number;
    completedToday: number;
    noShowsToday: number;
    outstandingClaims: number;
  };
}
