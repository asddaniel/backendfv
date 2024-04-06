import { useEffect, useState } from "react"
import { Select, SelectItem , Card, Input} from "@nextui-org/react"
import { useConfig } from "@/utils/Store"


const listfrequences = [
    "journalier", 
    "immediat", 
    "hebdomadaire", 
    "par heure"
]
export default function Params (){
    const [localconfig, setlocalconfig] = useState({
        server:"", 
        frequence:"immediat", 
        last_update:new Date(),
    })
    const {config, setconfig}:any = useConfig()

    const handleSave = ()=>{
        setconfig(localconfig)
    }

    useEffect(()=>{
        setlocalconfig(config)   
    }, [])
    

    return <div className="p-3 w-full">
        <h1 className="font-bold">Paramètres</h1>
        <div className="py-3">
            <Card className="p-2">
                <div className="p-2 border rounded ">
                    <div className="py-2 px-3 text-center text-2xl">Configuration actuel</div>
                    <div className="p-2">
                        <Select label="Frequence de Synchronisation serveur" selectedKeys={[localconfig.frequence]} onChange={(e)=>setlocalconfig({
                            ...localconfig,
                            frequence:e.target.value
                        })}>
                            {listfrequences.map((f)=> <SelectItem key={f} value={f} >{f}</SelectItem>)}
                      

                        </Select>
                    </div>
                    <div className="py-2">
                            <Input label="url du serveur" value={localconfig.server} onInput={(e)=>setlocalconfig({...localconfig, server:(e.target as HTMLInputElement).value})} />
                    </div>
                    <div className="py-2">
                        <button className="rounded p-2 bg-gray-800 text-white" onClick={handleSave}>Sauvegarder</button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
}