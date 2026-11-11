import { DashboardPlaceholder } from '@/components/dashboard-placeholder'
import { requirePageRole } from '@/lib/auth/server'
export const instant = false
export default async function BuyerDashboard(){await requirePageRole(['buyer']);return <DashboardPlaceholder role="Buyer" actions={['Saved sourcing','My offers','Orders and delivery']}/>}
