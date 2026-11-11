import { DashboardPlaceholder } from '@/components/dashboard-placeholder'
import { requirePageRole } from '@/lib/auth/server'
export const instant = false
export default async function LogisticsDashboard(){await requirePageRole(['logistics_provider']);return <DashboardPlaceholder role="Logistics" actions={['Transport requests','Vehicles','Active bookings']}/>}
