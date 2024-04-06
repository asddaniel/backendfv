import { Tab, Tabs, Card, TableRow, Popover,
    PopoverTrigger, PopoverContent, Tooltip, Select, SelectItem } from "@nextui-org/react"
import { Table, TableBody, TableHeader, TableColumn, TableCell, Button, ModalHeader } from "@nextui-org/react"
import { FilePenLine, Trash2, BarcodeIcon } from "lucide-react"
import Swal from "sweetalert2"
import { Modal, ModalContent } from "@nextui-org/react"
import { useEffect, useState, useRef } from "react"
import { useReactToPrint } from "react-to-print";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { getPageStyle } from "@/utils/Facade"
import { RadioGroup, Radio } from "@nextui-org/react"
import { Produit, ProduitType, Fournisseur, FournisseurType,  Approvisionnement, ApprovisionnementType, Categorie,
     CategorieType,  CodeBarreType } from "@/utils/Database"
     import { useAuth } from "@/utils/Store"
// import { models } from "@/utils/beast"
// import { db } from "@/utils/Database"
import { User, Role,  Client, Facture, LigneFacture, Livraison,
    CodeBarre, RoleUser } from '@/utils/Database'
    import Datepicker from "react-tailwindcss-datepicker"; 
    import { generateAlphaNumericString } from "@/utils/Facade"
    import { Spinner } from "@nextui-org/react"
    import BwipJs from "bwip-js"
    import { useNavigate } from "react-router-dom"

interface localdataType {
    categories: CategorieType[],
    products:ProduitType[],
    approvisionnements:ApprovisionnementType[],
    fournisseurs:FournisseurType[],
    codebarres:CodeBarreType[]
}
interface localdataTypeSingle {
    categorie: CategorieType,
    products:ProduitType,
    approvisionnements:ApprovisionnementType,
    fournisseur:FournisseurType | null,
}
const toSvg = (code:string)=>{
    return BwipJs.toSVG({
        bcid:        'code128',       // Barcode type
        text:        code,    // Text to encode
        height:      12,              // Bar height, in millimeters
        includetext: false,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
        textcolor:   'ff0000',        // Red text
    });
}
export type FilterCodeBarreType = {
    time: {
        startDate: Date
        endDate: Date
    }, 
    Produit: ProduitType|null,
    Fournisseur: FournisseurType|null,
    Approvisionnement:ApprovisionnementType|null,
}

export default function Stock (){
    const [modalProduct, setModalProduct] = useState(false);
    const [modalFournisseur, setModalFournisseur] = useState(false);
    const [modalApprovisionnement, setModalApprovisionnement] = useState(false);
    const route = useNavigate();
    const [modalCategorie, setModalCategorie] = useState(false);
    const {auth} :any= useAuth()
    const printer = useRef(null)
    const [filterDate, setFilterDate] = useState({startDate:new Date(Date.now()-86400000), endDate:new Date()})
    const [toSearch, setTosearch] = useState({categories:"", products:{produit:"", categorie:""}, fournisseurs:"", approvisionnements:""})
    const [localdata, setlocaldata] = useState<localdataType>({categories:[], products:[],
         approvisionnements:[], fournisseurs:[], codebarres:[]})
    const [dataToAdd, setDatatoAdd] = useState<localdataTypeSingle>({
        products:{name:"", quantite:0,  prix:0, Categorie:null, special_id:"", created_at:new Date(), updated_at:new Date(), is_deleted:false}, 
        fournisseur:null,
        categorie:{name:"", created_at:new Date(), special_id:"", updated_at:new Date(), is_deleted:false},
        approvisionnements:{special_id:"", Produit:({} as ProduitType), quantite:0, prix:0, Fournisseur:{} as FournisseurType, created_at:new Date(), updated_at:new Date(), is_deleted:false}

    })
    const { flushHeldKeys } = useKeyboardShortcut(
        ["Control", "P"],
        shortcutKeys => {console.log("Shift + H has been pressed.");
      imprimer()},
        { 
          overrideSystem: false,
          ignoreInputFields: false, 
          repeatOnHold: false 
        }
      );
      const imprimer = async ()=>{
        document.querySelector(".barcode-code")?.classList.remove("hidden")
        const all = document.querySelectorAll(".no-print");
        all.forEach((e)=>e.classList.add("hidden"))
        await handlePrint();
        document.querySelector(".barcode-code")?.classList.add("hidden")
        all.forEach((e)=>e.classList.remove("hidden"))
      }
  
      const handlePrint = useReactToPrint({
        content: () => printer.current,
        documentTitle: 'codebarre',
        copyStyles:true, 
        pageStyle: () => getPageStyle(),
      });
    
    const [filtercodebarres, setfiltercodebarres] = useState({
        time:{startDate:new Date(Date.now()-86400000), endDate:new Date()}, 
        Produit:null,
        Fournisseur:null,
        Approvisionnement:null 
    } satisfies FilterCodeBarreType)
    useEffect(()=>{
        localdata.codebarres.filter((code)=>{
            if(code.Approvisionnement.special_id == (filtercodebarres.Approvisionnement as any)?.special_id){
                console.log((code.created_at as Date) >filtercodebarres.time.startDate)
                console.log((code.created_at as Date) <filtercodebarres.time.endDate)
            } 
        })
    }, [filtercodebarres])
    const [dataToEdit, setDatatoEdit] = useState<localdataTypeSingle>({
        products:{} as ProduitType, 
        fournisseur:{} as FournisseurType, 
        categorie:{} as CategorieType,
        approvisionnements:{} as ApprovisionnementType

    })
    const [isloading, setisloading] = useState(false);
    useEffect(()=>{
        if(![0, 6].includes(Number(auth.user.role))){
            console.log(auth.user.role)
            route("/login")
        }
        
        //  console.log(models)
        Promise.all([Categorie.all(), Produit.all(), Fournisseur.all(), Approvisionnement.all(), CodeBarre.all(),])
        .then(([categories, products, fournisseurs, approvisionnements, codebarres])=>{
            categories = categories.filter((cat)=>cat.is_deleted == false);
            products = products.filter((prod)=>prod.is_deleted == false);
            fournisseurs = fournisseurs.filter((four)=>four.is_deleted == false);
            approvisionnements = approvisionnements.filter((appro)=>appro.is_deleted == false);
            codebarres = codebarres.filter(c=>c.is_deleted == false);
            console.log(categories, products, fournisseurs, approvisionnements, codebarres)
           
            setlocaldata({
                categories:categories,
                products:products,
                fournisseurs:fournisseurs,
                approvisionnements:approvisionnements, 
                codebarres:codebarres
            })
        })
            
    }, [])

    const createCategorie = async()=>{
        console.log(dataToAdd.categorie.name.length)
        try{
        if(dataToAdd.categorie.name.length > 0){
          
            //create random string to special_id
            const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
           const cate = await Categorie.create({name:dataToAdd.categorie.name, 
            special_id:special_id,
            created_at:new Date(), 
            id:localdata.categories.length, 
            updated_at:new Date(), 
            is_deleted:false})
        //    console.log("added")
           setlocaldata({
               ...localdata,
               categories:[...localdata.categories, cate]
           })
           setModalCategorie(false)
           setDatatoAdd({
               ...dataToAdd,
               categorie:{name:"", created_at:new Date(), special_id:"", updated_at:new Date(), is_deleted:false},
           })
           Swal.fire({
               title: "Ajouté!",
               text: "la categorie a été ajouté avec succès.",
               icon: "success"
           })
        }
    }catch(err){
        Swal.fire({
            title: "Erreur!",
            text: "Une erreur est survenue lors de l'ajout de la categorie, vous n'avez pas rempli correctement le formulaire.",
            icon: "error"
        })
    }
    }

    const updateCategorie = async(special_id:string)=>{
        try{
        const dataupdated: CategorieType = {...dataToEdit.categorie, name:dataToEdit.categorie.name, updated_at:new Date().toLocaleDateString() as string}
        const toUpdate = await Categorie.filter({special_id:special_id}).update(dataupdated)
       setlocaldata({
           ...localdata, 
           categories:[...localdata.categories.filter((cat)=>cat.special_id != special_id), dataupdated as CategorieType]
       })
        Swal.fire({
            title: "Modifié!",
            text: "la categorie a été modifié avec succès.",
            icon: "success"
        })
    }
    catch(err){
        Swal.fire({
            title: "Erreur!",
            text: "Une erreur est survenue lors de la modification de la categorie, vous n'avez pas rempli correctement le formulaire.",
            icon: "error"
        })
    }
        
    }
    const createProduit = async()=>{
        
        if(dataToAdd.products.name.length > 0){
            const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
           let lenghtproduit:ProduitType[] = await Produit.all()
           //lenghtproduit = lenghtproduit.length
           let dtoadd = {name:dataToAdd.products.name, 
            
            Categorie:dataToAdd.products.Categorie,
            special_id:special_id,
            created_at:new Date(), 
            id:lenghtproduit.length+1,  
            quantite:dataToAdd.products.quantite,
            prix:dataToAdd.products.prix,
            is_deleted:false
        }
        dtoadd = JSON.parse(JSON.stringify(dtoadd))
        dtoadd.created_at = new Date()
        console.log(dtoadd)
            const prod = await Produit.create(dtoadd)
            console.log(prod)
            setlocaldata({
                ...localdata,
                products:[...localdata.products, prod]
            })
            setDatatoAdd({
                ...dataToAdd,
                products:{name:"", quantite:0,  prix:0, Categorie:null, special_id:"", created_at:new Date(), updated_at:new Date(), is_deleted:false},
            })
            setModalProduct(false)
            Swal.fire({
                title: "Ajouté!",
                text: "le produit a été ajouté avec succès.",
                icon: "success"})
        }

    }

    const updateProduit = (special_id:string)=>{
        const toUpdate = {...dataToEdit.products, updated_at:new Date()}
        Produit.filter({special_id:special_id}).update(toUpdate)
        setlocaldata({
            ...localdata, 
            products:[...localdata.products.filter((prod)=>prod.special_id != special_id), toUpdate as ProduitType]
        })
        Swal.fire({
            title: "Modifié!",
            text: "le produit a été modifié avec succès.",
            icon: "success"
        })
    }
    const deleteProduit = (special_id:string)=>{

        Swal.fire({
            title: "Etes vous sur ?",
            text: "cet action est irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F172A",
            cancelButtonColor: "#d33",
            confirmButtonText: "oui, supprimer!",
            cancelButtonText:"annuler"
          }).then((result) => {
             
            if (result.isConfirmed) {
                Produit.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()});
            setlocaldata({
                ...localdata,
                products:localdata.products.filter((prod)=>prod.special_id != special_id)
            })
              Swal.fire({
                title: "Supprimé!",
                text: "le produit a été supprimé avec succès.",
                icon: "success"
              });
            }
          });
    }

    const createFournisseur = async ()=>{
        if(!dataToAdd.fournisseur) return;
        if(dataToAdd?.fournisseur?.name?.length > 0){
            let lenghtfour:number|FournisseurType[] = await Fournisseur.all()
            lenghtfour = lenghtfour.length
            console.log(dataToAdd.fournisseur)
            const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            const four = await Fournisseur.create({...dataToAdd.fournisseur, 
                special_id:special_id,
                created_at:new Date(), 
                id:localdata.fournisseurs.length, 
                updated_at:(new Date()), 
            is_deleted:false})
            setlocaldata({
                ...localdata,
                fournisseurs:[...localdata.fournisseurs, four]
            })
            setDatatoAdd({
                ...dataToAdd,
                fournisseur:{name:"", created_at:new Date(), special_id:"", updated_at:new Date(), is_deleted:false},
            })
            setModalFournisseur(false)
            Swal.fire({
                title: "Ajouté!",
                text: "le fournisseur a été ajouté avec succès.",
                icon: "success"})
        }
    }

    const updatefournisseur = (special_id:string)=>{
        const toUpdate = {...dataToEdit.fournisseur, updated_at:new Date()}
        Fournisseur.filter({special_id:special_id}).update(toUpdate)
        setlocaldata({
            ...localdata, 
            fournisseurs:[...localdata.fournisseurs.filter((four)=>four.special_id != special_id), toUpdate as FournisseurType]
        })
        Swal.fire({
            title: "Modifié!",
            text: "le fournisseur a été modifié avec succès.",
            icon: "success"
        })
    }

    const deleteFournisseur = (special_id:string)=>{
        Swal.fire({
            title: "Etes vous sur ?",
            text: "cet action est irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F172A",
            cancelButtonColor: "#d33",
            confirmButtonText: "oui, supprimer!",
            cancelButtonText:"annuler"
          }).then((result) => {
            if (result.isConfirmed) {
                Fournisseur.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date().toLocaleDateString()});
                setlocaldata({
                    ...localdata,
                    fournisseurs:localdata.fournisseurs.filter((four)=>four.special_id != special_id)
                })
              Swal.fire({
                title: "Supprimé!",
                text: "le fournisseur a été supprimé avec succès.",
                icon: "success"
              });
            }
          });
    }

    const createApprovisionnement = async ()=>{
        if(!dataToAdd.approvisionnements) return;
        if(dataToAdd?.approvisionnements?.Produit){
            let lengthapprovisionnement:number|ApprovisionnementType[] = await Approvisionnement.all()
            lengthapprovisionnement = lengthapprovisionnement.length
            const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
           let toadd = {...dataToAdd.approvisionnements,
                special_id:special_id,
                created_at:new Date(), 
                id:lengthapprovisionnement, 
                description:dataToAdd.approvisionnements.description??"",
                updated_at:new Date(), 
            is_deleted:false}
            toadd = JSON.parse(JSON.stringify(toadd))
            toadd.created_at = new Date()
            toadd.updated_at = new Date()

            const app = await Approvisionnement.create(toadd)
            console.log(dataToAdd.approvisionnements)
            Produit.filter({special_id:dataToAdd.approvisionnements.Produit.special_id}).update({quantite:Number(dataToAdd.approvisionnements.Produit.quantite) + Number(dataToAdd.approvisionnements.quantite)})
           
            setlocaldata({
                ...localdata,
                approvisionnements:[...localdata.approvisionnements, app],
                products:localdata.products.map((prod)=>{
                    if(prod.special_id == dataToAdd.approvisionnements.Produit.special_id){
                        return {...prod, quantite:Number(prod.quantite) + Number(dataToAdd.approvisionnements.quantite)}
                    }
                    return prod
                })
            })
            setDatatoAdd({
                ...dataToAdd,
                approvisionnements:{Produit:({} as ProduitType), quantite:0, prix:0, Fournisseur:{} as FournisseurType, created_at:new Date(), special_id:"", updated_at:new Date(), is_deleted:false},
            })
            setModalApprovisionnement(false)
            Swal.fire({
                title: "Ajouté!",
                text: "l'approvisionnement a été ajouté avec succès.",
                icon: "success"})
                .then(()=>{
                    setFilterDate({
                        startDate:new Date(Date.now()-86400000),
                        endDate:new Date()
                    })
                })
                
        }

    }

    const updateApprovisionnement = (special_id:string)=>{
        const toUpdate = {...dataToEdit.approvisionnements, updated_at:new Date()}
        Approvisionnement.filter({special_id:special_id}).update(toUpdate)
        setlocaldata({
            ...localdata, 
            approvisionnements:[...localdata.approvisionnements.filter((appro)=>appro.special_id != special_id), toUpdate as ApprovisionnementType]
        })
        Swal.fire({
            title: "Modifié!",
            text: "l'approvisionnement a été modifié avec succès.",
            icon: "success"
        })
    }

    const deleteApprovisionnement = (special_id:string)=>{
        Swal.fire({
            title: "Etes vous sur ?",
            text: "cet action est irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F172A",
            cancelButtonColor: "#d33",
            confirmButtonText: "oui, supprimer!",
            cancelButtonText:"annuler"
          }).then((result) => {
            if (result.isConfirmed) {
                Approvisionnement.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()});
                setlocaldata({
                    ...localdata,
                    approvisionnements:localdata.approvisionnements.filter((appro)=>appro.special_id != special_id)
                })
              Swal.fire({
                title: "Supprimé!",
                text: "cet approvisionnement a été supprimé avec succès.",
                icon: "success"
              });
            }
          });
    }
    const deleteCategorie = async(special_id:string)=>{
        Swal.fire({
            title: "Etes vous sur ?",
            text: "cet action est irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F172A",
            cancelButtonColor: "#d33",
            confirmButtonText: "oui, supprimer!",
            cancelButtonText:"annuler"
          }).then(async(result) => {
            if (result.isConfirmed) {
               const toDelete = await Categorie.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()});
              // toDelete.update({deleted_at:new Date().toLocaleDateString(), is_deleted:true});
               setlocaldata({
                   ...localdata,
                   categories:localdata.categories.filter((cat)=>cat.special_id != special_id)
               })
              Swal.fire({
                title: "Supprimé!",
                text: "ce categorie a été supprimé avec succès.",
                icon: "success"
              });
            }
          });
    }
    const generateCodeBarre = async (approvisionnement:ApprovisionnementType)=>{
            const numbercode = localdata.codebarres.filter(code=>code.Approvisionnement.special_id==approvisionnement.special_id)
            if(numbercode.length<approvisionnement.quantite){
                setisloading(true);
                const numbertoadd = approvisionnement.quantite - numbercode.length;
                const generated:CodeBarreType[] = []
                for(let i=0;i<numbertoadd;i++){
                    //generate random alphanumeric string of length 10
                    const all = await CodeBarre.all();
                    const randomcode = generateAlphaNumericString(10);
                    const special_id = generateAlphaNumericString(20);
                    let toadd = {
                        special_id: special_id,
                        Approvisionnement:approvisionnement,
                        id:all.length, 
                        codebarre:randomcode,
                        created_at:new Date(),
                        Produit:approvisionnement.Produit,
                        is_deleted:false,
                }
                toadd = JSON.parse(JSON.stringify(toadd));
                toadd.created_at = new Date()
                toadd.Approvisionnement.created_at = approvisionnement.created_at;
                    const code = await CodeBarre.create(toadd)
                    generated.push(code);
                   
                }

                setlocaldata({
                    ...localdata,
                    codebarres:[...localdata.codebarres, ...generated]
                })
                
                Swal.fire({
                    title:"Réussi", 
                    text:"Code barre generée avec succès",
                    icon:"success",
                })
                setisloading(false);
                return
            }
            Swal.fire({
                title:"Oops...", 
                text:"impossible de générer le code pour des produits déjà codifié",
                icon:"error"
            })
        }

    return (
        <div className="w-full bg-inherit font-inherit font-sans ">
            {isloading && <div className="absolute z-20 backdrop-blur-sm rounded w-full h-full flex justify-center text-center items-center">
                    <Spinner size="lg" />
            </div>}
            <Modal isOpen={modalProduct} onClose={() => setModalProduct(false)} size="5xl" >
            
                <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Ajouter un produit</ModalHeader>
                    {/* <h1>Ajouter un produit</h1> */}
                    <div className="border border-gray-300 rounded mx-0 p-3 font-sans ">
                            <div className="w-full py-3">
                                <label htmlFor="" className="block font-bold w-full font-inherit">Name</label>
                                <input type="text" value={dataToAdd.products.name} onInput={(e)=>{setDatatoAdd({...dataToAdd, products:{...dataToAdd.products, name:(e.target as HTMLInputElement).value}})}} className="border w-full border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>

                            <div className="w-full py-3">
                                <label htmlFor="" className="block font-bold w-full font-inherit">Catégorie</label>
                               <Select label="Categorie" className="w-full" placeholder="choisir une catégorie" onChange={(e)=>{
                                   console.log(e.target)
                                   setDatatoAdd({...dataToAdd, products:{...dataToAdd.products, Categorie:localdata.categories.find((cat)=>cat.special_id == (e.target ).value)}})
                               }}>
                                    {localdata.categories.map((cat, index)=>(
                                        <SelectItem key={cat.special_id} value={cat.special_id}>{cat.name}</SelectItem>
                                    ))}
                               </Select>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold  font-inherit">Prix</label>
                                <input type="number" value={dataToAdd.products.prix} onInput={(e)=>{setDatatoAdd({...dataToAdd, products:{...dataToAdd.products, prix:Number((e.target as HTMLInputElement).value)}})}} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:234 000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Quantité</label>
                                <input type="number" value={dataToAdd.products.quantite} onInput={(e)=>{setDatatoAdd({...dataToAdd, products:{...dataToAdd.products, quantite:Number((e.target as HTMLInputElement).value)}})}} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            
                            <div className="pt-3">
                                <Button color="primary" onClick={createProduit} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                </ModalContent>
            </Modal>
            <Modal isOpen={modalFournisseur} onClose={() => setModalFournisseur(false)} size="5xl" >
            
                <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Ajouter un fournisseur</ModalHeader>
                    {/* <h1>Ajouter un produit</h1> */}
                    <div className="border border-gray-300 rounded mx-0 p-3 font-sans ">
                            <div className="w-full ">
                                <label htmlFor="" className="block font-bold w-full font-inherit">Name</label>
                                <input type="text" value={dataToAdd.fournisseur?.name} onInput={(e)=>{setDatatoAdd({...dataToAdd, fournisseur:{...dataToAdd.fournisseur, name:(e.target as HTMLInputElement).value} as FournisseurType})}} className="border w-full border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold  font-inherit">Tél</label>
                                <input type="text" value={dataToAdd.fournisseur?.telephone} onInput={(e)=>{setDatatoAdd({...dataToAdd, fournisseur:{...dataToAdd.fournisseur, telephone:(e.target as HTMLInputElement).value} as FournisseurType})}} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:234 000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Email</label>
                                <input type="email" value={dataToAdd.fournisseur?.email} onInput={(e)=>{setDatatoAdd({...dataToAdd, fournisseur:{...dataToAdd.fournisseur, email:(e.target as HTMLInputElement).value} as FournisseurType})}} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            
                            <div className="pt-3">
                                <Button color="primary" onClick={createFournisseur} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                </ModalContent>
            </Modal>
            <Modal isOpen={modalApprovisionnement} onClose={() => setModalApprovisionnement(false)} size="5xl" >
            
                <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Ajouter un approvisionnement</ModalHeader>
                    {/* <h1>Ajouter un produit</h1> */}
                    <div className="border border-gray-300 rounded mx-0 p-3 font-sans ">
                            <div className="w-full py-2">
                                <label htmlFor="" className="block font-bold w-full font-inherit">Produit</label>
                               <Select onChange={(e)=>{setDatatoAdd({...dataToAdd, approvisionnements:{...dataToAdd.approvisionnements, Produit:localdata.products.find(product=>product.special_id==(e.target as HTMLSelectElement).value)} as ApprovisionnementType})}} placeholder="selectionner un produit" label="Produit">
                                  {localdata.products.map((produit, index)=>(
                                    <SelectItem key={produit.special_id} value={produit.special_id}>{produit.name}</SelectItem>
                                  ))}
                               </Select>
                            </div>
                            <div className="py-3">
                                <label htmlFor="" className="block font-bold  font-inherit">Fournisseur</label>
                                <Select onChange={(e)=>{setDatatoAdd({...dataToAdd, approvisionnements:{...dataToAdd.approvisionnements, Fournisseur:localdata.fournisseurs.find(fournisseur=>fournisseur.special_id==(e.target as HTMLSelectElement).value)} as ApprovisionnementType})}} placeholder="selectionner un fournisseur" label="Fournisseur">
                                  {localdata.fournisseurs.map((fournisseur)=>(
                                    <SelectItem key={fournisseur.special_id} value={fournisseur.special_id}>{fournisseur.name}</SelectItem>
                                  ))}
                               </Select>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Quantité</label>
                                <input type="number" value={dataToAdd.approvisionnements?.quantite} onChange={(e)=>{setDatatoAdd({...dataToAdd, approvisionnements:{...dataToAdd.approvisionnements, quantite:Number((e.target as HTMLInputElement).value)} as ApprovisionnementType})}} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Description</label>
                                <textarea value={dataToAdd.approvisionnements?.description} onChange={(e)=>{setDatatoAdd({...dataToAdd, approvisionnements:{...dataToAdd.approvisionnements, description:(e.target as HTMLTextAreaElement).value} as ApprovisionnementType})}} className="border w-full border-gray-300 border-2w-full inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                            <div className="pt-3">
                                <Button color="primary" onClick={createApprovisionnement} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                </ModalContent>
            </Modal>
            <Modal isOpen={modalCategorie} onClose={() => setModalCategorie(false)} size="5xl" >
            
            <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Ajouter une categorie</ModalHeader>
                {/* <h1>Ajouter un produit</h1> */}
                <div className="border border-gray-300 rounded mx-0 p-3 font-sans ">
                       
                        
                        <div>
                            <label htmlFor="" className="block font-bold font-inherit">name</label>
                            <input type="text" value={dataToAdd.categorie.name} onInput={(e:any)=>setDatatoAdd({...dataToAdd, categorie:{...dataToAdd.categorie, name:e.target.value}})} className="border border-gray-300 border-2 w-full inset rounded p-2" placeholder="ex:67000"/>
                        </div>
                        
                        <div className="pt-3">
                            <Button color="primary" className="outline-none border-none cursor-pointer" onClick={createCategorie}>Enregistrer</Button>
                        </div>
                  
                    </div>
            </ModalContent>
        </Modal>
<div className="py-4 px-2">
<h1 className="text-2xl font-bold">Gestion des Stock</h1>
</div>
            
            
            <div className="pt-3 pb-2 px-3">
                <Tabs color="primary" className="bg-white px-3 p-2 rounded">
                    <Tab key={"Produits"} title="Produits" className="border-none">
                        
                        <div className="py-6 flex gap-2 w-full  px-3 justify-start items-center">
                            <Card className="p-3 flex justify-center items-center">
                                <Button onClick={() => setModalProduct(true)} className="border-none outline-none text-white bg-slate-800 cursor-pointer">Ajouter </Button>
                            </Card>
                            <Card className="p-2 w-full  flex flex-row  gap-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input type="text" value={toSearch.products.produit} onInput={(e:any)=>setTosearch({...toSearch, products:{...toSearch.products,produit:e.target.value}})} placeholder="rechercher " className="p-2 rounded border inline-block w-full" />
                                <span className="px-2 inline-block"><Button>Rechercher</Button></span>
                            </Card>
                        </div>
                        <div className="py-3 px-6">
                            <Card className="p-2 flex w-full justify-center items-center">
                            <RadioGroup
      label="Choisir une catégorie"
      orientation="horizontal"
      onValueChange={(value) => setTosearch({...toSearch, products:{...toSearch.products, categorie:value}})}
    >
      <Radio value="" checked={toSearch.products.categorie===""}>Tous</Radio>
      {localdata.categories.map((cat)=>(
        <Radio key={cat.special_id}  value={cat.name}>{cat.name}</Radio>
      ))}
    </RadioGroup>
                            </Card>
                        </div>

                        <div className="px-8">
                            <div className="pt-3 pb-3">
                                
                            </div>
                        <Table aria-label="liste des produits disponibles">
                    <TableHeader>
                        <TableColumn>id</TableColumn>
                        <TableColumn>Nom</TableColumn>
                        <TableColumn>Prix</TableColumn>
                        <TableColumn>Quantité</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
      <TableBody emptyContent={"aucun produit disponible."}>{(localdata?.products || []).filter((produit)=>produit?.name?.toLowerCase()?.includes(toSearch.products.produit.toLowerCase()) && (produit?.Categorie?.name??"").includes(toSearch.products.categorie)).map((produit, index)=>(
        <TableRow key={index}>
             <TableCell>{index+1}</TableCell>
            <TableCell>{produit.name}</TableCell>
            <TableCell>{produit.prix}</TableCell>
            <TableCell>{produit.quantite}</TableCell>
            <TableCell>
                <div className="flex gap-4">
                   <Popover placement="top-end" showArrow={true} backdrop="blur" onOpenChange={(e)=>{
                    if(e){
                        setDatatoEdit({...dataToEdit, products:produit})
                    }
                   }}>
                    <PopoverTrigger>
                    <FilePenLine className="cursor-pointer"></FilePenLine>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="border border-gray-300 rounded p-3 font-sans">
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Name</label>
                                <input type="text" value={dataToEdit.products.name} onInput={(e:any)=>setDatatoEdit({...dataToEdit, products:{...dataToEdit.products, name:e.target.value}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Prix</label>
                                <input type="number" value={dataToEdit.products.prix} onInput={(e:any)=>setDatatoEdit({...dataToEdit, products:{...dataToEdit.products, prix:e.target.value}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:234 000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Quantité</label>
                                <input type="number" value={dataToEdit.products.quantite} onInput={(e:any)=>setDatatoEdit({...dataToEdit, products:{...dataToEdit.products, quantite:e.target.value}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            
                            <div className="pt-3">
                                <Button color="primary" onClick={()=>updateProduit(dataToEdit.products.special_id?.toString())} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                    </PopoverContent>
                   </Popover>
                   <Trash2 onClick={() =>deleteProduit(produit.special_id?.toString())} className="cursor-pointer"/>
                </div>
            </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>

                        </div>

                    </Tab>
                    <Tab key={"Categorie"} title="Categorie" className="border-none">
                        
                        <div className="py-6 flex gap-2 w-full  px-3 justify-start items-center">
                            <Card className="p-3 flex justify-center items-center">
                                <Button onClick={() => setModalCategorie(true)} className="border-none outline-none text-white bg-slate-800 cursor-pointer">Ajouter</Button>
                            </Card>
                            <Card className="p-2 w-full  flex flex-row  gap-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input type="text" value={toSearch.categories} onInput={(e) => setTosearch({...toSearch, categories: (e.target as HTMLInputElement).value})} placeholder="rechercher " className="p-2 rounded border inline-block w-full" />
                                <span className="px-2 inline-block"><Button>Rechercher</Button></span>
                            </Card>
                        </div>

                        <div className="px-8">
                            <div className="pt-3 pb-3">
                                
                            </div>
                        <Table aria-label="liste des categories des produits disponibles">
                    <TableHeader>
                        <TableColumn>id</TableColumn>
                        <TableColumn>name</TableColumn>
                       
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
      <TableBody emptyContent={"aucune categorie disponible."}>{(localdata.categories.filter(cat=>cat.name.toLowerCase().includes(toSearch.categories.toLowerCase()))).map((cat, index)=>(
        <TableRow key={index}>

            <TableCell>{index+1}</TableCell>
            <TableCell>{cat.name}</TableCell>
            
            <TableCell>
                <div className="flex gap-4">
                   <Popover placement="top-end" backdrop="opaque" showArrow={true} onOpenChange={(openstate)=>{
                      if(openstate){
                        setDatatoEdit({...dataToEdit, categorie:cat})
                      }
                   }}   >
                    <PopoverTrigger>
                    <FilePenLine className="cursor-pointer"></FilePenLine>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="border border-gray-300 rounded p-3 font-sans">
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Name</label>
                                <input type="text" value={dataToEdit?.categorie.name} onInput={(e)=>setDatatoEdit({...dataToEdit, categorie:{...dataToEdit.categorie, name:(e.target as HTMLInputElement).value}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                           
                            
                            <div className="pt-3">
                                <Button color="primary" onClick={()=>updateCategorie(cat.special_id?.toString())} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                    </PopoverContent>
                   </Popover>
                   <Trash2 onClick={()=>deleteCategorie(cat.special_id?.toString())} className="cursor-pointer"/>
                </div>
            </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>

                        </div>

                    </Tab>
                    <Tab className="border-none" key={"fournisseurs"} title="Fournisseurs">
                    <div className="py-6 flex gap-2 w-full  px-3 justify-start items-center">
                            <Card className="p-3 flex items-center justify-center">
                                <Button onClick={() => setModalFournisseur(true)} className="border-none p-2 outline-none text-white bg-slate-800 cursor-pointer flex items-center justify-center"> <span className="p-2">Ajouter  </span></Button>
                            </Card>
                            <Card className="p-2 w-full  flex flex-row  gap-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input type="text" value={toSearch.fournisseurs} onInput={(e) => setTosearch({...toSearch, fournisseurs: (e.target as HTMLInputElement).value})} placeholder="rechercher " className="p-2 rounded border inline-block w-full" />
                                <span className="px-2 inline-block"><Button className="p-3">Rechercher</Button></span>
                            </Card>
                        </div>

                        <div className="px-8">
                            <div className="pt-3 pb-3">
                                
                            </div>
                        <Table aria-label="liste des fournisseurs">
                    <TableHeader>
                        <TableColumn>Nom</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Télephone</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
      <TableBody emptyContent={"aucun fournisseur disponible."}>{(localdata.fournisseurs.filter(fournisseur=>fournisseur.name.toLowerCase().includes(toSearch.fournisseurs.toLowerCase()))).map((fournisseur, index)=>(
        <TableRow key={index}>

            <TableCell>{fournisseur.name}</TableCell>
            <TableCell>{fournisseur.email}</TableCell>
            <TableCell>{fournisseur.telephone}</TableCell>
            <TableCell>
                <div className="flex gap-4">
                   <Popover placement="top-end" showArrow={true} backdrop="blur" onOpenChange={(e)=>{
                      if(e){
                        setDatatoEdit({...dataToEdit, fournisseur:fournisseur})
                      }
                   }}>
                    <PopoverTrigger>
                    <FilePenLine className="cursor-pointer"></FilePenLine>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="border border-gray-300 rounded p-3 font-sans">
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Name</label>
                                <input type="text" value={dataToEdit?.fournisseur?.name} onInput={(e)=>setDatatoEdit({...dataToEdit, fournisseur:{...dataToEdit.fournisseur, name:(e.target as HTMLInputElement).value} as FournisseurType})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Email</label>
                                <input type="email" value={dataToEdit?.fournisseur?.email} onInput={(e)=>setDatatoEdit({...dataToEdit, fournisseur:{...dataToEdit.fournisseur, email:(e.target as HTMLInputElement).value} as FournisseurType})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:234 000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Télephone</label>
                                <input type="text" value={dataToEdit?.fournisseur?.telephone} onInput={(e)=>setDatatoEdit({...dataToEdit, fournisseur:{...dataToEdit.fournisseur, telephone:(e.target as HTMLInputElement).value} as FournisseurType})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            
                            <div className="pt-3">
                                <Button onClick={()=>updatefournisseur((dataToEdit.fournisseur as FournisseurType).special_id.toString())} color="primary" className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                    </PopoverContent>
                   </Popover>
                   <Trash2 onClick={()=>deleteFournisseur(fournisseur.special_id?.toString())} className="cursor-pointer"/>
                </div>
            </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>

                        </div>

                    </Tab>
                    <Tab key={"approvisionnement"} className="border-none" title="Approvisionnement">
                    <div className="py-6 flex gap-2 w-full  px-3 justify-start items-center">
                            <Card className="p-3 flex justify-center items-center">
                                <Button onClick={() => setModalApprovisionnement(true)} className="border-none p-2 outline-none text-white bg-slate-800 cursor-pointer"> <span className="p-2">Ajouter </span></Button>
                            </Card>
                            <Card className="p-2 w-full  flex flex-row  gap-2">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input type="text" value={toSearch.approvisionnements} onInput={(e) => setTosearch({ ...toSearch, approvisionnements: (e.target as HTMLInputElement).value })} placeholder="rechercher par fournisseur" className="p-2 rounded border inline-block w-full" />
                                <span className="px-2 inline-block"><Button className="p-3">Rechercher</Button></span>
                            </Card>
                        </div>

                        <div className="px-8">
                            <div className="pt-3 pb-3">
                        <div className="px-3 p-2 bg-white shadow-lg rounded-2xl">
                            <div className="py-3 font-bold text-2xl">Filtrer par Date</div>
                        <Datepicker 
                    value={filterDate as any} 
                onChange={(value:any)=>setFilterDate(value)} 
                popoverDirection="down"
                />
                        </div>
                           
                                
                                
                            </div>
                        <Table aria-label="Liste des approvisionnements des produits">
                    <TableHeader>
                        <TableColumn>Fournisseur</TableColumn>
                        <TableColumn>Produit</TableColumn>
                        <TableColumn>Quantite</TableColumn>
                        <TableColumn>Prix d'achat</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
      <TableBody emptyContent={"aucun fournisseur disponible."}>{(localdata.approvisionnements.filter((app)=>app.Fournisseur?.name?.toLowerCase().includes(toSearch.approvisionnements) && (new Date(app?.created_at?.toString().split("/").reverse().join("/") as string).getTime() >= new Date(filterDate.startDate).getTime() && new Date(app?.created_at?.toString().split("/").reverse().join("/") as string).getTime() <= new Date(filterDate.endDate).getTime()))).map((app, index)=>(
        <TableRow key={index}>

            <TableCell>{app.Fournisseur.name}</TableCell>
            <TableCell>{app.Produit.name}</TableCell>
            <TableCell>{app.quantite}</TableCell>
            <TableCell>{app.prix}</TableCell>
            <TableCell>{app?.created_at?.toString()}</TableCell>
            <TableCell>
                <div className="flex gap-4">
                   <Popover placement="top-end" showArrow={true} backdrop="blur" onOpenChange={(e)=>{
                    if(e){
                        setDatatoEdit({...dataToEdit, approvisionnements:app});
                    }
                   }}>
                    <PopoverTrigger>
                    <FilePenLine className="cursor-pointer"></FilePenLine>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="border border-gray-300 rounded p-3 font-sans">
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Produit</label>
                               <Select selectedKeys={[dataToEdit?.approvisionnements?.Produit?.special_id??""]} label="Produit" placeholder="selectionner un produit" onChange={(e)=>setDatatoEdit({...dataToEdit, approvisionnements:{...dataToEdit.approvisionnements, Produit:localdata.products.find((prod)=>prod.special_id == e.target.value) as ProduitType, special_id:e.target.value}})}>
                                    {localdata.products.map((produit, index)=>(
                                        <SelectItem key={produit.special_id} value={produit.special_id}>{produit.name}</SelectItem>
                                    ))}
                               </Select>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Fournisseur</label>
                                <Select  selectedKeys={[dataToEdit?.approvisionnements?.Fournisseur?.special_id]} label="Fournisseur" onChange={(e)=>{
                                    setDatatoEdit({...dataToEdit, approvisionnements:{...dataToEdit.approvisionnements, Fournisseur:localdata.fournisseurs.find((four)=>four.special_id == e.target.value) as FournisseurType, special_id:e.target.value}})
                                }} placeholder="selectionner un fournsseur">
                                        {localdata.fournisseurs.map((four, index)=>(
                                            <SelectItem  key={four.special_id} value={four.special_id}>{four.name}</SelectItem>
                                        ))}
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Quantité</label>
                                <input type="number" value={dataToEdit.approvisionnements.quantite} onInput={(e)=>setDatatoEdit({...dataToEdit, approvisionnements:{...dataToEdit.approvisionnements, quantite:Number((e.target as HTMLInputElement).value)}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:67000"/>
                            </div>
                            <div>
                                <label htmlFor="" className="block font-bold font-inherit">Description</label>
                                <textarea value={dataToEdit.approvisionnements.description} onInput={(e)=>setDatatoEdit({...dataToEdit, approvisionnements:{...dataToEdit.approvisionnements, description:(e.target as HTMLInputElement).value}})} className="border border-gray-300 border-2 inset rounded p-2" placeholder="ex:John Doe"/>
                            </div>
                            <div className="pt-3">
                                <Button color="primary" onClick={()=>updateApprovisionnement(dataToEdit.approvisionnements.special_id)} className="outline-none border-none cursor-pointer">Enregistrer</Button>
                            </div>
                      
                        </div>
                    </PopoverContent>
                   </Popover>
                   <Trash2 onClick={()=>deleteApprovisionnement(app.special_id)} className="cursor-pointer"/>
                  
                   
                    {localdata.codebarres.filter(code=>code.Approvisionnement.special_id==app.special_id).length < app.quantite ? (
                            <Tooltip showArrow={true} content="Generer code bar " color="success">
                                <BarcodeIcon className="cursor-pointer" onClick={()=>generateCodeBarre(app)} />
                   </Tooltip>
                    ):<Tooltip showArrow={true} content="codebarre existant" color="warning">
                    <BarcodeIcon className="cursor-not-allowed" />
       </Tooltip>}
                        
                   
                </div>
            </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>

                        </div>
                    </Tab>
                    <Tab key={"codeBarre"} className="border-none" title="CodeBarres">
                        <div className="py-5">
                            <div className="w-full p-2">
                            <Select label="Produit" className="py-2" onChange={(e)=>{setfiltercodebarres({...filtercodebarres, Produit:(localdata.products.find(p=>p.special_id == e.target.value) as any), })}}>
                                            {localdata.products.map((product)=>(
                                                <SelectItem key={product.special_id} value={product.special_id}>{product.name}</SelectItem>
                                            ))}
                                </Select>
                                <Select label="Fournisseur" className="py-2" onChange={(e)=>{
                                    setfiltercodebarres({...filtercodebarres, Fournisseur:(localdata.fournisseurs.find(f=>f.special_id == e.target.value) as any), })
                                }}>
                                        {localdata.fournisseurs.map((fournisseur)=>(
                                            <SelectItem key={fournisseur.special_id} value={fournisseur.special_id}>{fournisseur.name}</SelectItem>
                                        ))}
                                </Select>
                                <Select label="Approvisionnement" className="py-2" onChange={(e)=>{
                                    setfiltercodebarres({...filtercodebarres, Approvisionnement:(localdata.approvisionnements.find(f=>f.special_id == e.target.value) as any), })
                                }}>
                                        {localdata.approvisionnements.filter((app)=>app.Fournisseur.special_id == (filtercodebarres.Fournisseur as any)?.special_id  && app.Produit.special_id == (filtercodebarres.Produit as any)?.special_id).map((app)=>(
                                            <SelectItem key={app.special_id} value={app.special_id}>{app?.created_at?.toString()}</SelectItem>
                                        ))}
                                </Select>
                               
                                <div className="py-2">
                                    <Datepicker popoverDirection="down"  value={filtercodebarres.time} onChange={(e)=>{
                                        setfiltercodebarres({...filtercodebarres, time:{startDate:new Date(e?.startDate as any), endDate:new Date((e?.endDate as any))}})
                                    }} />
                                </div>

                            </div>
                        </div>
                        <div className="py-3 grid grid-cols-3 gap-3">
                            
                            <Card className="p-2">
                                <div className="font-bold text-xl"> Total {localdata.codebarres.filter((code)=>{
                                    // console.log((code.Approvisionnement.special_id==(filtercodebarres.Approvisionnement as any)?.special_id))
                                    // console.log((code.Approvisionnement.created_at as any)>=filtercodebarres.time.startDate, code.Approvisionnement.created_at)
                                    return ((code.Approvisionnement.special_id==(filtercodebarres.Approvisionnement as any)?.special_id) && ((code.Approvisionnement.created_at as any)>=filtercodebarres.time.startDate) && ((code.Approvisionnement.created_at as any)<=filtercodebarres.time.endDate))}).length} codes</div>
                            </Card>
                            <Card className="p-2 col-span-2 flex justify-center items-center">
                                <button onClick={()=>imprimer()} className="rounded shadow w-64 font-bold text-white bg-gray-900 p-2">imprimer le code</button>
                            </Card>
                        </div>
                        <div className="py-3 barcode-code hidden" ref={printer}>
                            <div className="grid grid-cols-3 gap-2 p-2">
                            {localdata.codebarres.filter(code=>code.Approvisionnement.special_id==(filtercodebarres.Approvisionnement as any)?.special_id && (code.Approvisionnement.created_at as any)>=filtercodebarres.time.startDate && (code.Approvisionnement.created_at as any)<=filtercodebarres.time.endDate).map((code, index)=>(
                                <Card className="p-3 h-32 flex ">
                                 <div dangerouslySetInnerHTML={{__html:toSvg(code.codebarre)}}></div>
                                </Card>
                            ))}                                
                            </div>
                           
                        </div>
                        <div className="py-4">
                            <Table aria-label="liste des code barres des produits">
                                <TableHeader>
                                 
                                        <TableColumn>Produit</TableColumn>
                                        <TableColumn>CodeBarre</TableColumn>
                                        <TableColumn>Fournisseur</TableColumn>
                                        <TableColumn>Date de fournitures</TableColumn>
                                   
                                </TableHeader>
                                <TableBody>
                                    {localdata.codebarres.filter(code=>code.Approvisionnement.special_id==(filtercodebarres.Approvisionnement as any)?.special_id && (code.Approvisionnement.created_at as any)>=filtercodebarres.time.startDate && (code.Approvisionnement.created_at as any)<=filtercodebarres.time.endDate).map((code, index)=>(
                                        <TableRow key={index}>
                                            <TableCell>{code.Produit.name}</TableCell>
                                            <TableCell>
                                            <div dangerouslySetInnerHTML={{__html:toSvg(code.codebarre)}}></div>
                                            </TableCell>
                                            <TableCell>{code.Approvisionnement.Fournisseur.name}</TableCell>
                                            <TableCell>{code.Approvisionnement?.created_at?.toLocaleDateString("fr-FR")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Tab>
                    
                </Tabs>
            </div>
        </div>
    )
}