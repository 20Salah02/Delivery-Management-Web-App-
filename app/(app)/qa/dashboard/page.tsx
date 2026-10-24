import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageHeader } from "@/components/PageHeader";
import { orders, products, zones } from "../mock";
export default function P() { return <><PageHeader title="Dashboard" description="Your zones, products and orders at a glance." /><DashboardView zones={zones} products={products} orders={orders} /></>; }
