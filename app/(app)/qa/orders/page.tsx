import { PageHeader } from "@/components/PageHeader";
import { OrdersView } from "@/components/orders/OrdersView";
import { orders, products, zones } from "../mock";
export default function P() { return <><PageHeader title="Orders" description="Pick a product, tap the address — we check the zone for you." /><OrdersView zones={zones} products={products} orders={orders} /></>; }
