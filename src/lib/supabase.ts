// This file re-exports admin functionality for public-facing components
// All Supabase functionality has been moved to /admin/lib/supabase-admin.ts

export { 
  supabase,
  createLead, 
  createContactSubmission, 
  addLeadActivity,
  type Lead,
  type ContactSubmission,
  type LeadActivity
} from '../../admin/lib/supabase-admin'
