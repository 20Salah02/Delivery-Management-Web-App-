import { PageHeader } from "@/components/PageHeader";
import { ZonesManager } from "@/components/zones/ZonesManager";
import { zones } from "../mock";
export default function P() { return <><PageHeader title="Zones" description="Drop a pin, pick a radius — that's your delivery area." /><ZonesManager zones={zones} /></>; }
