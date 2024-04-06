import { Modal, ModalBody, ModalHeader, ModalContent, Button } from "@nextui-org/react"
import { Input, Textarea } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { Depense as DataDepense, DepenseType } from "@/utils/Database"
import { FilePenIcon, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { Table, TableBody, TableHeader, TableColumn, TableRow, TableCell } from "@nextui-org/react"
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import Datepicker from "react-tailwindcss-datepicker"

export default function Depense () {
    const [open, setOpen] = useState(false)
    const [listdepenses, setlistdepenses] = useState<DepenseType[]>([])
    const [filterdate, setFilterDate] = useState({startDate:new Date(Date.now()-86400000), 
        endDate:new Date()})
    const [dataToAdd, setDataToAdd] = useState({
        montant:0,
        description:"",
        libelle:"",
        id:0, 
        created_At:new Date(),
        updated_at:new Date(), 
        is_deletd:false,
        special_id:"",
        deleted_at:new Date(),
    })
    useEffect(() => {
     DataDepense.all()
     .then((depenses)=>{
        depenses = depenses.filter(dep=>dep.is_deleted==false)
        setlistdepenses(depenses)
     })   
    }, [])
    const deleteDepense = (special_id:string)=>{
        Swal.fire({
            title: "Supprimer?",
            text: "Vous ne pourrez plus le retrouver!",
            icon: "warning",
            showCancelButton: true,
        })
        .then(async(confirm)=>{
            if(confirm.isConfirmed){
                
               await DataDepense.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()})
               setlistdepenses(listdepenses.filter(dep=>dep.special_id!=special_id))
            }
        })
    }
    const addDepense = async ()=>{
        if(dataToAdd.montant>0 && dataToAdd.libelle.length>0){
            const all = await DataDepense.all();
           const newDepense =  await DataDepense.create({
                id:all.length,
                libelle:dataToAdd.libelle,
                montant:dataToAdd.montant,
                description:dataToAdd.description,
                special_id:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                created_at:new Date(), 
                is_deleted:false,
                updated_at:new Date(),

            })
            setlistdepenses([...listdepenses, newDepense])
            Swal.fire({
                title: "Ajouté!",
                text: "la depense a été ajouté avec succès.",
                icon: "success"
            })
            .then(()=>{
                setDataToAdd({
                    ...dataToAdd,
                    montant:0,
                    description:"",
                    libelle: "",
                })
                setOpen(false);
            })
        }
    }
    const updateDepense = async (special_id:string)=>{
        await DataDepense.filter({special_id:special_id}).update({...dataToAdd, updated_at:new Date()})
        setlistdepenses(listdepenses.map(dep=>dep.special_id==special_id?{...dep, ...dataToAdd}:dep))
        setDataToAdd({
            ...dataToAdd,
            montant:0,
            libelle:"",
            description: "",
        })
        Swal.fire({
            title: "Mis à jour!",
            text: "la depense a été mis à jour avec succès.",
            icon: "success"
        })
    }
    return (
        <div className="p-3  w-full h-full">
            <div className="py-5 font-bold text-3xl"> Dépenses</div>
            <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
                <ModalContent>
                    <ModalHeader> <div className="font-bold">Ajouter une dépense</div></ModalHeader>
                    <ModalBody>
                        <div className="rounded border p-3">
                            <div className="py-3">
                                <Input label="Libelle" value={dataToAdd.libelle} onInput={(e)=>setDataToAdd({...dataToAdd, libelle:(e.target as HTMLInputElement).value})}   />
                            </div>
                            <div className="py-3">
                                <Input type="number" value={dataToAdd.montant.toString()} onInput={(e)=>setDataToAdd({...dataToAdd, montant:Number((e.target as HTMLInputElement).value)})} label="Montant"    />
                            </div>
                            <div className="py-3">
                                <Textarea label="Description" value={dataToAdd.description} onInput={(e)=>setDataToAdd({...dataToAdd, description:(e.target as HTMLInputElement).value})}    />
                            </div>
                            <div className="py-3">
                                <Button color="primary" onClick={addDepense} className="font-bold">Enregistrer</Button>
                            </div>
                           
                        </div>

                    </ModalBody>
                </ModalContent>
            </Modal>



            <div className="mt-5 py-2">
                <Button color="primary" onClick={() => setOpen(true)} className="font-bold">Ajouter </Button>
            </div>
            <div className="py-3">
                <Datepicker value={filterdate} onChange={(e)=>setFilterDate({startDate:new Date(e.startDate), endDate:new Date(e.endDate)})}   />
            </div>
            <div className="py-4">
                <div className="text-3xl font-bold">Total: {listdepenses.filter(dep=>dep.created_at>=filterdate.startDate && dep.created_at<=filterdate.endDate).reduce((acc, dep)=>acc+Number(dep.montant), 0)} FC</div>
            </div>
            <div className="mt-5 py-2">
                <Table aria-label="liste des dépenses">
                    <TableHeader>
                        <TableColumn>Libelle</TableColumn>
                        <TableColumn>Montant</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                       {listdepenses.filter(dep=>dep.created_at>=filterdate.startDate && dep.created_at<=filterdate.endDate).map((depense)=>{
                           return (
                            <TableRow key={depense.special_id}>
                                <TableCell>{depense.libelle}</TableCell>
                                <TableCell>{depense.montant}</TableCell>
                                <TableCell>{depense.description}</TableCell>
                                <TableCell>{depense.created_at.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 p-1">
                                        <Popover onOpenChange={(e)=>{
                                            if(e){
                                                setDataToAdd(depense as any)
                                            }
                                        }}>
                                            <PopoverTrigger>
                                                <FilePenIcon className="hover:scale-110 cursor-pointer font-bold transition-all duration-300 text-blue-500 "/>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div className="p-2">

                                                <div className="rounded border p-3">
                            <div className="py-3">
                                <Input label="Libelle" value={dataToAdd.libelle} onInput={(e)=>setDataToAdd({...dataToAdd, libelle:(e.target as HTMLInputElement).value})}   />
                            </div>
                            <div className="py-3">
                                <Input type="number" value={dataToAdd.montant.toString()} onInput={(e)=>setDataToAdd({...dataToAdd, montant:Number((e.target as HTMLInputElement).value)})} label="Montant"    />
                            </div>
                            <div className="py-3">
                                <Textarea label="Description" value={dataToAdd.description} onInput={(e)=>setDataToAdd({...dataToAdd, description:(e.target as HTMLInputElement).value})}    />
                            </div>
                            <div className="py-3">
                                <Button color="primary" onClick={(e)=>updateDepense(dataToAdd.special_id)} className="font-bold">Enregistrer</Button>
                            </div>
                           
                        </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <Trash2 onClick={() => deleteDepense(depense.special_id)} className="hover:scale-110 cursor-pointer font-bold transition-all duration-300 text-red-500 "/>
                                    </div>
                                    </TableCell>
                            </TableRow>
                           )
                       })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}