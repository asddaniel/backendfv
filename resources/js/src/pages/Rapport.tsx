import { Tab, Tabs } from "@nextui-org/react"
import RapportFacture from "./rapports/RapportFacture"


export default function Rapport () {
    return (
        <div className="w-full bg-inherit font-inherit py-5">
            <h1 className="font-bold text-3xl">Rapport</h1>
            <div className="pt-5">
                <Tabs>
                    <Tab key={"facturation"} title="Facturation">
                        <div className="w-full h-full p-2">
                          <RapportFacture />

                        </div>
                    </Tab>
                    <Tab key={"caisse"} title="Caisse">Caisse</Tab>
                    <Tab key={"livraison"} title="Livraison">livraison</Tab>
                </Tabs>
            </div>
        </div>
    )
}