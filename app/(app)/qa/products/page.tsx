import { PageHeader } from "@/components/PageHeader";
import { ProductsView } from "@/components/products/ProductsView";
import { products, zones } from "../mock";
export default function P() { return <><PageHeader title="Products" description="Your menu — priced in MAD, available zone by zone." /><ProductsView zones={zones} products={products} /></>; }
