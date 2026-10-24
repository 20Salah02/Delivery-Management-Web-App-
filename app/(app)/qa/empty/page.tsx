import { DashboardView } from "@/components/dashboard/DashboardView";
import { OrdersView } from "@/components/orders/OrdersView";
import { ProductsView } from "@/components/products/ProductsView";
export default function P() { return <><DashboardView zones={[]} products={[]} orders={[]} /><div className="mt-10" /><ProductsView zones={[]} products={[]} /><div className="mt-10" /><OrdersView zones={[]} products={[]} orders={[]} /></>; }
