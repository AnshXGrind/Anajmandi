import { DashboardPlaceholder } from '@/components/dashboard-placeholder'
import { requirePageRole } from '@/lib/auth/server'
export const instant = false
export default async function FarmerDashboard(){await requirePageRole(['farmer']);return <DashboardPlaceholder role="Farmer" actions={['My listings','Offers to review','Orders and earnings']}/>}
