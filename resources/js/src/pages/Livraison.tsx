import { Table, TableBody, TableHeader, TableColumn, TableRow, TableCell } from "@nextui-org/react"
import { FilePenLine, Trash2, EyeIcon } from "lucide-react"
import Datepicker from "react-tailwindcss-datepicker"
import { Livraison as Livr, LivraisonLine, LivraisonType, livraisonLineType, Facture, FactureType, Produit, ProduitType, CodeBarreType, CodeBarre } from "@/utils/Database"
import { useEffect, useState } from "react"
import { Modal, ModalHeader, ModalBody, ModalContent, Input, Card } from "@nextui-org/react"
import { generateAlphaNumericString } from "@/utils/Facade"
import Swal from "sweetalert2"
import { useAuth } from "@/utils/Store"
import { useNavigate } from "react-router-dom"

interface LocalDatatype  {
    livraisons: LivraisonType[]
    factures: FactureType[]
    produits: ProduitType[]
    lignes: livraisonLineType[],
    codebarres: CodeBarreType[]
}
interface DatatoAddType  {
    livraison: LivraisonType
    line: livraisonLineType
}
interface SelectedLivraisonType {
    livraison: LivraisonType|null
    lines: livraisonLineType[], 
    suggestions?:{
        code?: string,
        quantite?:number;
    }
   
}

type toAddLineType = {
    produit:ProduitType|null;
    quantite:number;
    code:CodeBarreType|null;
}

export  function Livraison(){
    const [modalLivraison, setmodalLivraison] = useState(false)
    const [modallivraisonListe, setmodalLivraisonListe] = useState(false) //
    const [datasearch, setdatasearch] = useState({
        facture:"", 
        time:{
            startDate: new Date(Date.now()-86400000),
            endDate: new Date(),
        }
    })
    const [toaddLine, setoAddLine] = useState <toAddLineType>({
        produit:null, 
        quantite:1, 
        code:null
    })
    const [selectedLivraison, setselectedLivraison] = useState<SelectedLivraisonType>({
        livraison:null, 
        lines:[]
    })
    const [datatoAdd, setdatatoAdd] = useState<DatatoAddType>({
        livraison:{
            id:0,
            created_at:new Date(),
            
            is_deleted:false,
            special_id:"", 
            Facture:null,
        } as any, 
        line:{
            id:0,
            created_at:new Date(),
            updated_at:new Date(),
            deleted_at:new Date(),
            is_deleted:false,
            special_id:""
        }
       
    })
    const [search, setsearch] = useState({
        facture:""
    })
    const [localdata, setlocaldata] = useState<LocalDatatype>({
        livraisons:[], 
        factures:[],
        produits:[],
        lignes:[],
        codebarres:[],
    })
    const {auth} : any = useAuth()
    const route = useNavigate()
    useEffect(()=>{
       
            if(![0, 1, 2].includes(Number(auth.user.role))){
              route("/login")
          }
        Promise.all([Livr.all(), LivraisonLine.all(), Facture.all(), Produit.all(), CodeBarre.all()])
        .then(([livraisons, lines, factures, produits, codes])=>{
            console.log(livraisons, lines, factures)
            livraisons = livraisons.filter(l=>l.is_deleted==false);
            lines = lines.filter(l=>l.is_deleted==false);
            factures = factures.filter(l=>l.is_deleted==false);
            produits = produits.filter(l=>l.is_deleted==false);
            codes = codes.filter(c=>c.is_deleted==false);
                setlocaldata({
                    livraisons: livraisons,
                    factures: factures,
                    produits: produits,
                    lignes: lines,
                    codebarres: codes
                }); //
        })
    }, [])

    const AddLivraison = async ()=>{
        if(datatoAdd.livraison.Facture){
            const special_id  = generateAlphaNumericString(20);
            const all = await Livr.all();
            const user = JSON.parse(localStorage.getItem("user") as string);
            let livraison = await Livr.create({
                ...datatoAdd.livraison,
                special_id: special_id,
                id:all.length, 
                created_at:new Date(),
                User: user,
                is_deleted:false,
            });
            setlocaldata({
                ...localdata, 
                livraisons:[...localdata.livraisons, livraison]
            })
            Swal.fire({
                title:"Livraison ajouter avec succes",
                icon:"success",
                showConfirmButton:false,
                timer:2000
            })
            setdatatoAdd({
                ...datatoAdd, 
                livraison:{
                    ...datatoAdd.livraison, 
                    id:0,
                    created_at:new Date(),
                    is_deleted:false,
                    special_id:"",
                    Facture:null,
                } as any
            })
            setmodalLivraison(false);
            setdatasearch({...datasearch, time:{...datasearch.time, endDate:new Date()}})
            return
                
            }
            Swal.fire({
                title:"Oops...", 
                text:"Veuillez selectionner une facture",
                icon:"error"
            })
           
    }
    const DeleteLivraison = async(special_id:string)=>{
            Swal.fire({
                title: "Etes-vous sur de vouloir supprimer ce livraison ?",
        text: "Vous ne pourrez pas le reprendre!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer!",
            })
            .then((confirm)=>{
                if(confirm.isConfirmed){
                     Livr.filter({special_id:special_id}).update({
                        is_deleted:true, deleted_at:new Date(), updated_at:new Date()
                    })
                    setlocaldata({
                        ...localdata, 
                        livraisons:localdata.livraisons.filter(l=>l.special_id!=special_id),
                    })
                }
            })
    }

    const openLivraison = (livr:LivraisonType)=>{
        setselectedLivraison({
            livraison:livr, 
            lines:localdata.lignes.filter(l=>l.Livraison?.special_id==livr.special_id)
        })
        setmodalLivraisonListe(true)
    }

    const deleteLivraisonLine = async (line:livraisonLineType)=>{
        
                 LivraisonLine.filter({special_id:line.special_id}).update({
                    is_deleted:true, deleted_at:new Date(), updated_at:new Date()
                })
                setlocaldata({
                    ...localdata, 
                    lignes:localdata.lignes.filter(l=>l.special_id!=line.special_id),
                })
                setselectedLivraison({
                    ...selectedLivraison, 
                    lines:selectedLivraison.lines.filter(l=>l.special_id!=line.special_id)
                })
                const traceProduct = await Produit.get({special_id:line.Produit?.special_id});

               Produit.filter({special_id:line.Produit?.special_id}).update({quantite:traceProduct.quantite-Number(line.quantite)})
    }

    const addLineLivraison = async(toAddLivraison:{produit:ProduitType, quantite:number, code:CodeBarreType})=>{
        const special_id  = generateAlphaNumericString(20);
        const all = await LivraisonLine.all();
       
        let line = await LivraisonLine.create({
            Livraison:selectedLivraison?.livraison,
            quantite: toAddLivraison.quantite,
            CodeBarre: toAddLivraison.code, 
            Produit: toAddLivraison.produit,
            special_id: special_id,
            id:all.length, 
            created_at:new Date(),
            is_deleted:false,
        });
        setlocaldata({
            ...localdata, 
            lignes:[...localdata.lignes, line]
        })
        setselectedLivraison({
            ...selectedLivraison, 
            lines:[...selectedLivraison.lines, line]
        })
    }

    return (<div className="w-full bg-inherit font-inherit py-5">
        <Modal isOpen={modallivraisonListe} onClose={() => setmodalLivraisonListe(false)} size="full" backdrop="blur">
            <ModalContent >
                <ModalHeader className="flex flex-col gap-2 items-start">
                    <h1 className="text-2xl font-bold">Livraisons</h1>
                    <h1 className="text-2xl font-bold w-full py-2 my-2"><span className="font-normal uppercase">Facture</span>: {selectedLivraison?.livraison?.Facture?.numfacture}</h1>
                </ModalHeader>
                <ModalBody>
                    <div className="py-2 grid grid-cols-8 gap-2 items-center">
                        <Input label="Code Barre" className="col-span-6" value={(selectedLivraison?.suggestions as any)?.code} onInput={(e:any)=>setselectedLivraison({...selectedLivraison, suggestions:{...selectedLivraison.suggestions, code:e.target.value}})}  />
                        <div className="grid grid-cols-3 col-span-2 gap-2">
                        <Input label="Qte" value={(selectedLivraison?.suggestions as any)?.quantite} className="my-2 col-span-2" onInput={(e:any)=>setselectedLivraison({...selectedLivraison, suggestions:{...selectedLivraison.suggestions, quantite:Number(e.target.value)}})}  />
                       <div className="flex justify-center p-2">
                       <button onClick={()=>addLineLivraison({produit:toaddLine.produit as ProduitType, quantite:toaddLine.quantite, code:toaddLine.code as CodeBarreType})} className="bg-gray-800 text-white font-bold p-1 rounded px-3">Ajouter</button>
                       </div>
                        </div>
                    </div>
                    <div className="p-2 w-2/3">
                        {(selectedLivraison?.suggestions as any)?.code.length>0 &&(toaddLine.code?.codebarre!=(selectedLivraison?.suggestions as any)?.code) && localdata.codebarres.filter((c)=>c.codebarre.includes((selectedLivraison?.suggestions as any)?.code)).map((code)=>(
                            <div key={code.special_id} onClick={()=>{
                                setselectedLivraison({...selectedLivraison, suggestions:{quantite:1, code:code.codebarre}})
                                setoAddLine({...toaddLine, code:code, produit:code.Produit})}} className="py-1 grid grid-cols-6 gap-2 items-center bg-white shadow-md hover:shadow-lg transition-all cursor-pointer p-2 my-2 rounded">
                                <p className="col-span-2">{code.codebarre}</p>
                                <p className="col-span-4">{code.Produit?.name}</p>
                            </div>
                        ))}
                    </div>

                    <Table>
                        <TableHeader>
                          
                                <TableColumn>Nom</TableColumn>
                                <TableColumn>Qte</TableColumn>
                                <TableColumn>Code Barre</TableColumn>
                                <TableColumn>Action</TableColumn>
                        
                        </TableHeader>
                        <TableBody>
                            {selectedLivraison?.lines?.map((l)=>{
                                return <TableRow>
                                    <TableCell>{l.Produit?.name}</TableCell>
                                    <TableCell>{l.quantite}</TableCell>
                                    <TableCell>{l.CodeBarre?.codebarre}</TableCell>
                                    <TableCell><Trash2 className="text-red-500 cursor-pointer" onClick={()=>deleteLivraisonLine(l)} /></TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>

                </ModalBody>
            </ModalContent>
        </Modal>
        <Modal isOpen={modalLivraison} onClose={() => setmodalLivraison(false)} size="2xl" backdrop="blur">
            <ModalContent>
                <ModalHeader>Ajouter une Livraison</ModalHeader>
                <ModalBody>
                    <div className="py-3 p-2">
                        <Input
                            className="py-2"
                            label="numfacture"
                            value={search.facture}
                            onChange={(e) =>{ setsearch({ ...search, facture: e.target.value })
                            console.log(e.target.value, localdata?.factures)
                        }}
                        />
                        <div className="py-2">
                            {search.facture.length>0 && (datatoAdd.livraison?.Facture?.numfacture!=search.facture || datatoAdd.livraison.Facture==null) && localdata.factures.filter(f=>f.numfacture?.includes(search.facture)).map((facture)=>{
                                return <div key={facture.special_id} className="my-2 bg-white shadow-sm cursor-pointer " onClick={(e) =>{

                                    console.log(e)
                                    setsearch({...search, facture:(facture.numfacture as string)?.toString()})
                                    setdatatoAdd({
                                        ...datatoAdd,
                                        livraison:{
                                            ...datatoAdd.livraison, 
                                            Facture: facture
                                        }
                                    })
                                }}>{facture.numfacture}</div>
                            })}
                        </div>
                        <div className="py-2">
                            <button
                                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                                onClick={() => AddLivraison()}
                            >
                                Valider
                            </button>
                        </div>

                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        <h1 className="text-3xl font-bold">Livraison</h1>
        <div className="py-3">
            <div className="py-3">
                <button
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setmodalLivraison(true)}
                >
                    Ajouter une livraison
                </button>
            </div>
            <div className="py-2">
                <span className="text-2xl font-bold">Filtrer par date</span>
            </div>
            <div className="py-2 w-1/2">
                 <Datepicker value={datasearch.time} onChange={(e)=>setdatasearch({...datasearch, time:{startDate:new Date(e?.startDate as string ), endDate:new Date(e?.endDate as string)}})} />
            </div>
            <Table
                aria-label="liste des livraisons effectuée">
                <TableHeader>
                    <TableColumn> id </TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>numfacture</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {localdata.livraisons.filter(l=>(l.created_at as Date)?.getTime()>=datasearch.time.startDate?.getTime() && (l.created_at as Date)?.getTime()<=datasearch.time.endDate?.getTime()).map((lr, index)=>(
                            <TableRow key={lr.special_id}>
                                <TableCell>{index+1}</TableCell>
                            <TableCell>{lr.created_at?.toLocaleDateString()}</TableCell>
                            <TableCell>{lr.Facture.numfacture}</TableCell>
                           
                           
                            <TableCell>
                                <div className="flex gap-2">
                                    <FilePenLine className="cursor-pointer" />
                                    <EyeIcon className="cursor-pointer" onClick={()=>openLivraison(lr)}  />
                                    <Trash2 className="cursor-pointer" onClick={()=>DeleteLivraison(lr.special_id)} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    

                </TableBody>
            </Table>
        </div>
    </div>)
}