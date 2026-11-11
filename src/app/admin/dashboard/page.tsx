import { DashboardPlaceholder } from '@/components/dashboard-placeholder'
import { requirePageRole } from '@/lib/auth/server'
export const instant = false
export default async function AdminDashboard(){await requirePageRole(['admin']);return <DashboardPlaceholder role="Admin" actions={['Verification queue','Order monitoring','Audit logs']}/>}
