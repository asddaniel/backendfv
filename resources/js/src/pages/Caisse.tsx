import { Card } from "@nextui-org/react"
import { Table, TableHeader, TableBody, 
    TableColumn, TableRow, TableCell } from "@nextui-org/react"
    import { Modal, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { Facture, Paiement, PaiementType, FactureType, LigneFacture, LigneFactureType, Produit, ProduitType } from "@/utils/Database"
import { Input, Select, SelectItem } from "@nextui-org/react"
import Swal from "sweetalert2"
import { FilePenIcon, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import Datepicker from "react-tailwindcss-datepicker"
import { useAuth } from "@/utils/Store"
import { useNavigate } from "react-router-dom"
type localdataType = {
    factures: FactureType[],
    paiements: PaiementType[],
    lignefactures: LigneFactureType[],
    produits: ProduitType[],
}
type toAddType = {
    facture:FactureType|null, 
    cdf:number; 
    usd:number;
    taux:number;
}


export default function Caisse () {

    const [openModal, setOpenModal] = useState(false)
    const route = useNavigate()
    const [data, setdata] = useState<localdataType>({
        factures:[], 
        paiements:[],
        lignefactures:[],
        produits:[],
    })
    const {auth} :any = useAuth()
    const [filterDate, setFilterDate] = useState({startDate:new Date(Date.now()-86400000), endDate:new Date()})
    const [searchfactures, setsearchfactures] = useState("")
    const [dataToAdd, setDatatoAdd] = useState<toAddType>({
        facture:null, 
        cdf:0, 
        usd:0,
        taux:2800
    })
    useEffect(()=>{
        if(![0, 1, 5, 7].includes(Number(auth.user.role))){
            route("/")
        }
            Promise.all([Paiement.all(), Facture.all(), LigneFacture.all(), Produit.all()])
            .then(([listpaiements, listfactures, lignefacts, prods])=>{
                listpaiements = listpaiements.filter((lr:any)=>lr.is_deleted==false);
                listfactures = listfactures.filter((lr:any)=>lr.is_deleted==false);
                lignefacts = lignefacts.filter((lr:any)=>lr.is_deleted==false);
                prods = prods.filter((lr:any)=>lr.is_deleted==false);
              console.log(listfactures)
                setdata({
                    paiements:listpaiements, 
                    factures:listfactures, 
                    lignefactures:lignefacts, 
                    produits:prods,
                })
            });
    }, [])


    const addCaisse = async ()=>{
        if(dataToAdd.facture){
            const all = await Paiement.all()
            const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
         const added =  await Paiement.create({
                    id:all.length,
                    special_id:special_id, 
                    created_at:new Date(), 
                    cdf:Number(dataToAdd.cdf),
                    usd:Number(dataToAdd.usd),
                    is_deleted:false,
                    Facture:dataToAdd.facture,
                    taux:Number(dataToAdd.taux),
            })
            setdata({...data, paiements:[...data.paiements, added]})
            Swal.fire({
                title:"Réussi", 
                text:"Paiement ajouté avec succès",
                icon:"success",
            })
            initialiseDefaultdatatoAdd()
            setFilterDate({startDate:new Date(Date.now()-86400000), endDate:new Date()})
            return
        }
        Swal.fire({
            title:"Oops...", 
            text:"Veuillez remplir correctement le formulaire", 
            icon:"error",
        })
    }

    const initialiseDefaultdatatoAdd = ()=>{
        setDatatoAdd({
            ...dataToAdd,
            facture:null, 
            cdf:0, 
            usd:0,
        })
        setsearchfactures("")
    }
    const updatePaiement = async(special_id:string)=>{

        const updated = await Paiement.filter({special_id:special_id}).update({cdf:Number(dataToAdd.cdf), usd:Number(dataToAdd.usd), taux:Number(dataToAdd.taux)})
        setdata({...data, paiements:data.paiements.map((p:PaiementType)=>{
            if(p.special_id==special_id){return {...p, cdf:Number(dataToAdd.cdf), usd:Number(dataToAdd.usd), taux:Number(dataToAdd.taux)} }else{return p}})})
        Swal.fire({
            title:"Réussi", 
            text:"Paiement modifié avec succès",
            icon:"success",
        })

        initialiseDefaultdatatoAdd()

    }
    const deletePaiement = async(special_id:string)=>{
        Swal.fire({
            title:"Suppression", 
            text:"Voulez-vous vraiment supprimer ce paiement?", 
            icon:"warning",
            showCancelButton:true,
            cancelButtonText:"annuler",
            confirmButtonColor:"#0F172A",
            cancelButtonColor:"#FF0095",
        }).then(confirm=>{
            if(confirm.isConfirmed){
                Paiement.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date})
                setdata({...data, paiements:data.paiements.filter(p=>p.special_id!=special_id)})
                Swal.fire({
                    title:"Réussi", 
                    text:"Paiement supprimé avec succès",
                    icon:"success",
                })
            }
        })

    }

    const getFactureAmount = (facture:FactureType)=>{
        let amount = 0;
        if(facture){
            data.lignefactures.filter(l=>l.Facture.special_id == facture.special_id).forEach(l=>{
                // console.log(l.p)
                amount += data.produits.find(p=>p.special_id==l.Produit.special_id)?.prix*l.quantite??0
                
            })
        }
        return amount;
    }

    return <div className="py-5 px-2 w-full">
        <Modal isOpen={openModal} onClose={()=>setOpenModal(false)} size="2xl" backdrop="blur">
           <ModalContent>
           <ModalHeader className="font-bold text-2xl">Operation Caisse</ModalHeader>
            <ModalBody>
            {dataToAdd.facture && <div className="py-2 font-bold text-2xl text-gray-600">
                <div>
                    Montant :  {getFactureAmount(dataToAdd.facture)}
                </div>
                
                </div>}
                <div className="py-2">
                    
                    <div className="py-2">
                        <Input label="Facture" value={searchfactures} onInput={(e:any)=>setsearchfactures(e.target.value)}  />
                    </div>
                    <div className="p-2 ">
                        {(searchfactures.length>0 && !(dataToAdd.facture!=null)) && data.factures.filter(f=>f.numfacture?.includes(searchfactures)).map((facture)=>(
                            <div className="p-2 cursor-pointer my-2 bg-white shadow rounded-lg" onClick={(e)=>{
                                console.log(e)
                                setsearchfactures((facture.numfacture?.toString()) as string)
                                setDatatoAdd({...dataToAdd, facture:facture})}}  key={facture.special_id}>{facture.numfacture}</div>
                        ))}

                    </div>
                </div>
                <div className="py-3 px-2">
                    <Input label="USD" value={dataToAdd.usd.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, usd:e.target.value})}  type="number" className="my-2" />
                   <Input label="Taux" value={dataToAdd.taux.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, taux:e.target.value})}  type="number"  />
                    <Input label="CDF" type="number" value={dataToAdd.cdf.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, cdf:e.target.value})} className="my-2" />
                </div>
                <div className="py-2">
                    <button className="rounded-xl bg-gray-800 text-white p-2" onClick={addCaisse}>Enregistrer</button>
                </div>

            </ModalBody>
           </ModalContent>
        </Modal>
        <div className="py-5">
            <div className="text-2xl uppercase font-bold">Caisse</div>
        </div>

        <Card className="p-2 flex justify-start items-start px-4 w-64">
            <button className="rounded-lg p-2 bg-gray-800 text-white" onClick={()=>setOpenModal(true)}>Ajouter</button>
        </Card>

        <div className="p-2 px-3">
             <Datepicker value={filterDate} onChange={(e:any)=>{
                setFilterDate({
                    startDate: new Date((e.startDate as any)?.toString()) , 
                    endDate:new Date(e.endDate?.toString() as any)
                })
             }}   />
        </div>

        <div className="py-3 w-full">
            <Table aria-label="liste des operation caisses">
                <TableHeader>
                    <TableColumn>id</TableColumn>
                    <TableColumn>Facture</TableColumn>
                    <TableColumn>USD</TableColumn>
                    <TableColumn>Taux</TableColumn>
                    <TableColumn>CDF</TableColumn>
                    <TableColumn> Actions </TableColumn>
                </TableHeader>
                <TableBody>
                   {data.paiements.filter(p=>(new Date(p.created_at as any).getTime()>=filterDate.startDate.getTime()) && new Date(p.created_at as any).getTime()<=filterDate.endDate.getTime()).map((paiement:PaiementType, index)=>(
                     <TableRow>
                     <TableCell>{index+1}</TableCell>
                     <TableCell>{paiement.Facture?.numfacture}</TableCell>
                     <TableCell>{paiement.usd}</TableCell>
                     <TableCell>{paiement.taux}</TableCell>
                     <TableCell>{paiement.cdf}</TableCell>
                     <TableCell className="flex gap-2">
                        <Popover onOpenChange={(e)=>{
                            if(e){
                                setDatatoAdd({
                                    ...dataToAdd, 
                                    facture:paiement.Facture,
                                    cdf:paiement.cdf,
                                    usd:paiement.usd
                                })
                            }else{
                                initialiseDefaultdatatoAdd();
                            }
                        }}>
                            <PopoverTrigger>
                            <FilePenIcon className="cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent>
                            <div className="py-2">
                    
                    <div className="py-2">
                        <Input label="Facture" value={searchfactures} onInput={(e:any)=>setsearchfactures(e.target.value)}  />
                    </div>
                    <div className="p-2 ">
                        {(searchfactures.length>0 && !(dataToAdd.facture!=null)) && data.factures.filter(f=>f.numfacture?.includes(searchfactures)).map((facture)=>(
                            <div className="p-2 cursor-pointer my-2 bg-white shadow rounded-lg" onClick={(e)=>{
                                console.log(e)
                                setsearchfactures((facture.numfacture?.toString()) as string)
                                setDatatoAdd({...dataToAdd, facture:facture})}}  key={facture.special_id}>{facture.numfacture}</div>
                        ))}

                    </div>
                </div>
                <div className="py-3 px-2">
                    <Input label="USD" value={dataToAdd.usd.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, usd:e.target.value})}  type="number" className="my-2" />
                   <Input label="Taux" value={dataToAdd.taux.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, taux:e.target.value})}  type="number"  />
                    <Input label="CDF" type="number" value={dataToAdd.cdf.toString()} onInput={(e:any)=>setDatatoAdd({...dataToAdd, cdf:e.target.value})} className="my-2" />
                </div>
                <div className="py-2">
                    <button className="rounded-xl bg-gray-800 text-white p-2" onClick={()=>updatePaiement(paiement.special_id)}>modifier</button>
                </div>
                            </PopoverContent>
                        </Popover>
                        
                         <Trash2 className="cursor-pointer" onClick={()=>deletePaiement(paiement.special_id)} />
                     </TableCell>
                 
                 </TableRow>
                   ))}
                </TableBody>

            </Table>
        </div>

    </div>
}