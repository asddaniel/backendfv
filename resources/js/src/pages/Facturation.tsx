import { Client, ClientType, Facture, FactureType, LigneFacture, LigneFactureType, Produit, ProduitType } from "@/utils/Database";
import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tooltip } from "@nextui-org/react";
import { EyeIcon, FilePenIcon, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { getPageStyle } from "@/utils/Facade";
import { useReactToPrint } from "react-to-print";
import logo from "@/assets/logomtech.png"
import Datepicker from "react-tailwindcss-datepicker"; 
import { useAuth } from "@/utils/Store";
interface dataType {
    clients: ClientType[];
    factures: FactureType[];
    produits: ProduitType[];
}
interface DataFacture {
    Facture:FactureType|{},
    Lignes:LigneFactureType[], 
    suggestion:string,
    toAdd?:{
      quantite:number,
      Produit?:ProduitType
    }
}
const defaultClientData = {
    name:"",
    tel:"", 
    created_at:new Date(),
    updated_at:new Date(), 
    special_id:"",
    email:"",
    is_deleted:false,
    id:0,
}

export default function Facturation (){
    const [showfacture, setShowfacture] = useState(false)
    const [modals, setmodals] = useState({createClient:false, show_facture:false, show_lignes:false})
    const [searchClientFocus, setSearchClientFocus] = useState(false)
    const [searchFacture, setsearchFacture] = useState("");
    const [data, setdata] = useState<dataType>({clients:[], factures:[], produits:[]})
    const [filterDate, setFilterDate] = useState({startDate:new Date(Date.now()-86400000), endDate:new Date()})
    const printer = useRef(null)
    
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
    const [dataFacture, setdataFacture] = useState<DataFacture>({
      Facture:{},
      Lignes:[], 
      suggestion:"", 
      toAdd:{quantite:0, Produit:{} as any}
    })
    const [datatoAdd, setdatatoAdd] = useState({clients:{
        name:"",
        tel:"", 
        created_at:new Date(),
        updated_at:new Date(), 
        special_id:"",
        email:"",
        is_deleted:false,
        id:0,
    } as ClientType, factures:{
        numfacture:"", 
        tempClient:"",
        Client:{},
        created_at:new Date(),
        updated_at:new Date(), 
        special_id:"",
        id:0,
    } as any, ligneFacture:{}})

    const route = useNavigate()
    const {auth}:any = useAuth();
    useEffect(()=>{
      if(![0, 1, 3].includes(Number(auth.user.role))){
        route("/login")
    }
      Promise.all([Facture.all(), Client.all(), Produit.all()])
      .then(([factures, clients, products])=>{
        console.log(clients)
        clients = clients.filter((c)=>c.is_deleted==false);
        factures = factures.filter(f=>f.is_deleted==false).reverse();
        console.log(factures)
       const produits = products.filter(p=>p.is_deleted==false).reverse();
       
        setdata({clients, factures, produits})
      })
    }, [])

    useEffect(() =>{
      setFilterDate({startDate:new Date(Date.now()-86400000), endDate:new Date()})

    }, [datatoAdd])

    const createClient = async()=>{
      if(datatoAdd.clients.name.length>0){
        //create random string for special_id
        const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
         const all = await Client.all();
         const lenght = all.length
        const newclient = await Client.create({
          ...datatoAdd.clients,
          special_id:special_id,
          id:lenght
        })
        setdata({
          ...data,
          clients:[...data.clients, newclient]
        })
        setdatatoAdd({
          ...datatoAdd,
          clients:{
            name:"",
            tel:"", 
            created_at:new Date(),
            updated_at:new Date(), 
            special_id:"",
            email:"",
            is_deleted:false,
            id:0,
          }
        })
        Swal.fire({
          title:"Ajouté!",
          text:"Le client a été ajouté avec succès.",
          icon:"success",
        })
        return
      }
      Swal.fire({
        title:"Oops..",
        text:"Veuillez remplir tous les champs",
        icon:"error",
      })
    }
    const createSilentClient = async(name:string)=>{
      console.log(name)
      const all = await Client.all();
      console.log(all)
      const newClient  = {
        name:name, 
        created_at:new Date(),
        updated_at:new Date(),
        special_id:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        email:"",
        is_deleted:false,
        tel:"",
        id:all.length
      }
      const created = await Client.create(newClient)
      console.log(created)
      setdatatoAdd({
        ...datatoAdd,
        factures:{
          ...datatoAdd.factures,
          Client:created, 
          tempClient:name
        }
      })
      setdata({
        ...data, 
        clients:[...data.clients, created]
      })

    }
    const updateClient = async()=>{
      const newClient = await Client.filter({special_id:datatoAdd.clients.special_id}).update({...datatoAdd.clients, updated_at:new Date()})
      console.log(newClient)
      setdata({
        ...data, 
        clients: [...data.clients.filter(c=>c.special_id!=datatoAdd.clients.special_id), datatoAdd.clients]
      })
      
      setdatatoAdd({
        ...datatoAdd,
        clients:{
          name:"",
          tel:"", 
          created_at:new Date(),
          updated_at:new Date(), 
          special_id:"",
          email:"",
          is_deleted:false,
          id:0,
        }
      })
      Swal.fire({
        title:"Modifié!",
        text:"Le client a été modifié avec succès.",
        icon:"success",
      })
    }
    const deleteClient = (special_id:string)=>{
      Swal.fire({
        title: "Etes-vous sur de vouloir supprimer ce client ?",
        text: "Vous ne pourrez pas le reprendre!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer!",
      }).then((confirm)=>{
        if(confirm.isConfirmed){
          Client.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()})
          setdata({
            ...data, 
            clients: data.clients.filter(c=>c.special_id!=special_id)
          })
          Swal.fire(
            "Supprimé!",
            "Le client a été supprimé avec succès.",
            "success"
          )
        }
      })

    }

    const openFacture = async (facture:FactureType)=>{
      let lignes = await LigneFacture.all();
      lignes = lignes.filter(l=>l.is_deleted==false)
      lignes  = lignes.filter((li:LigneFactureType)=>li.Facture.numfacture==facture.numfacture);

      console.log(lignes, facture.numfacture)
      setdataFacture({
        Lignes: lignes??[],
        Facture:facture, 
        suggestion:""
      })
        setmodals({...modals, show_facture:true})
    }
    const createFacture = async()=>{
      const datauser = localStorage.getItem("user");
      if(!datauser){
        Swal.fire({
          title:"Oops..",
          text:"Veuillez vous connecter, vous devez etre connecté pour créer une facture",
          icon:"error",
        })
        .then(()=>route("login"))
        return
      }
      const user = JSON.parse(datauser)
      if(!datatoAdd.factures.Client.name){
        Swal.fire({
          title:"Oops..",
          text:"Veuillez selectionner un client",
          icon:"error",
        })
        return
      }
      const all = await Facture.all();
      const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let facture = await Facture.create({
          special_id:special_id, 
          created_at:new Date(),
          updated_at:new Date(),
          Client:datatoAdd.factures.Client, 
          id:all.length,
          User:user,
          Reduction:{},
          is_deleted:false,
          is_paid:false,
          numfacture:new Date().toLocaleDateString().toString()+Math.random().toString(36).substring(2, 15),
        })
       await Facture.filter({special_id:special_id}).update({Client:datatoAdd.factures.Client})
       facture = {...facture, Client:datatoAdd.factures.Client}
       setdata({
          ...data, 
          factures:[...data.factures, facture]
        })
        setdatatoAdd({
          ...datatoAdd,
          factures:{
            numfacture:"", 
            tempClient:"",
            created_at:new Date(),
            updated_at:new Date(), 
            special_id:"",
            id:0,
          }
        })
        setShowfacture(false)
        Swal.fire({
          title:"Ajouté!",
          text:"La facture a été ajoutée avec succès.",
          icon:"success",
        })
    }
    const updateProductQuantiteByLigne = async(product:ProduitType, quantite:number, ligne:LigneFactureType)=>{
      const oldline = await LigneFacture.get({special_id:ligne.special_id});
      const oldproduct = await Produit.get({special_id:product.special_id})
      await Produit.filter({special_id:product.special_id}).update({quantite:oldproduct.quantite+Number(oldline.quantite)-Number(quantite)});
      setdata({
        ...data,
        produits:data.produits.map(p=>{
          if(p.special_id==product.special_id){return {...p, quantite:oldproduct.quantite+Number(oldline.quantite)-Number(quantite)}}else{return p}})
       
      })
    }

    const updateLigne = async(dataLigne:LigneFactureType)=>{
     
      await LigneFacture.filter({special_id:dataLigne.special_id}).update(dataLigne);
      
      

    }
    const deleteFacture = (special_id:string)=>{
      Swal.fire({
        title: "Supprimer?",
        text: "Vous ne pourrez plus le retrouver!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer!",
    }).then((confirm)=>{
      if(confirm.isConfirmed){
        Facture.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date().toLocaleDateString()})
        setdata({
          ...data, 
          factures: data.factures.filter(f=>f.special_id!=special_id)
        })
        Swal.fire(
          "Supprimé!",
          "La facture a été supprimé avec succès.",
          "success"
        )
      }
    })

    }
    const updateFacture = async(special_id:string, fact:FactureType)=>{
      console.log(fact, datatoAdd)
          await Facture.filter({special_id:special_id}).update(fact);
          setdata({
            ...data, 
            factures: [...data.factures.filter(f=>f.special_id!=special_id), fact]
          })
          console.log(fact, datatoAdd)
          Swal.fire({
            title:"Réussi", 
            text:"Facture modifiée avec succès", 
            icon:"success", 
          })
    }
    const AddtoFacture = async()=>{
      if(dataFacture.toAdd?.Produit?.name && dataFacture.toAdd?.quantite>0){

        const all = await LigneFacture.all();
        const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if(dataFacture.toAdd?.Produit?.quantite<dataFacture.toAdd?.quantite){
          Swal.fire({
            title:"Oops..",
            text:"Quantité insuffisante dans le stock",
            icon:"error",
          })
          return
        }
        const lignes =   await LigneFacture.create({
          Produit:dataFacture.toAdd?.Produit,
          quantite:dataFacture.toAdd?.quantite,
          Facture:dataFacture.Facture,
          is_deleted:false,
          special_id:special_id,
          id:all.length,
          created_at:new Date(),
          updated_at:new Date(),
        });
        await Produit.filter({special_id:dataFacture.toAdd?.Produit?.special_id}).update({quantite:Number(dataFacture.toAdd?.Produit?.quantite)-Number(dataFacture.toAdd?.quantite)})
        setdata({
          ...data,
          produits:data.produits.map(p=>{
            if(p.special_id==dataFacture.toAdd.Produit.special_id){
              return {...p, quantite:Number(dataFacture.toAdd.Produit.quantite)-Number(dataFacture.toAdd.quantite)}
            }else{
              return p
            }
          })
        })
        setdataFacture({
          ...dataFacture, 
          Lignes:[...dataFacture.Lignes, lignes],
          toAdd:{
            quantite:0,
           
          }
        })
        
      
       
        }
    }

    const deleteLigne = async (ligne:LigneFactureType)=>{
          LigneFacture.filter({special_id:ligne.special_id}).update({is_deleted:true, deleted_at:new Date()})
          setdata({
            ...data,
            produits:data.produits.map(p=>{
              if(p.special_id==ligne.Produit.special_id){
                return {...p, quantite:Number(p.quantite)+Number(ligne.quantite)}
              }else{
                return p
              }
            })
          })
          await Produit.filter({special_id:ligne.Produit.special_id}).update({quantite:Number(ligne.Produit.quantite)+Number(ligne.quantite)})

    }
    const imprimer = async ()=>{
      document.querySelector(".header-printer")?.classList.remove("hidden")
      const all = document.querySelectorAll(".no-print");
      all.forEach((e)=>e.classList.add("hidden"))
      await handlePrint();
      document.querySelector(".header-printer")?.classList.add("hidden")
      all.forEach((e)=>e.classList.remove("hidden"))
    }

    const handlePrint = useReactToPrint({
      content: () => printer.current,
      documentTitle: 'facture '+(dataFacture?.Facture as FactureType).numfacture,
      copyStyles:true, 
      pageStyle: () => getPageStyle(),
    });
    return (<div className="w-full bg-inherit font-inherit">

      <Modal isOpen={modals.show_facture} onOpenChange={()=>setmodals({...modals, show_facture:false})} size="full" backdrop="blur">
          <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Facture N° {(dataFacture.Facture as FactureType)?.numfacture?.toLocaleUpperCase()}</ModalHeader>
            <ModalBody>
              <div className="py-3 px-2">
                <div className="py-3 px-2">
                  <div className="py-3">
                    {dataFacture?.toAdd?.Produit && <Card className="p-2">Quantité disponible: {dataFacture.toAdd.Produit?.quantite} </Card>}
                  </div>
                  <Card className="p-2 grid grid-cols-5 gap-2">
                    <div className="col-span-3">
                      <Input label="produit" value={dataFacture.suggestion} onChange={(e)=>setdataFacture({...dataFacture, suggestion:e.target.value})}  />
                    </div>
                    <div className="">
                      <Input type="number" label="quantité" value={dataFacture?.toAdd?.quantite??"" as any} onChange={(e)=>setdataFacture({...dataFacture, toAdd:{...dataFacture.toAdd, quantite:(Number(e.target.value)>=0?Number(e.target.value):0)}})}  />
                    </div>
                    <div className="flex items-center justify-center">

                      {dataFacture?.toAdd?.Produit?.quantite>dataFacture?.toAdd?.quantite ? <button className={"rounded-xl font-bold text-white bg-gray-800 p-2 py-3 "+(dataFacture?.toAdd?.quantite>0?"":"cursor-not-allowed")} onClick={AddtoFacture}> Ajouter</button>
                        : <Tooltip showArrow={true} color="danger" content="Quantité insuffisante"><button className={"rounded-xl font-bold text-white bg-red-800 p-2 py-3 cursor-not-allowed"} > Ajouter</button></Tooltip>}
                    </div>

                  </Card>
                  <div className="py-2">
                    {dataFacture.suggestion.length>0 && <div>
                      {data.produits.filter(p=>p.name.toLowerCase().includes(dataFacture.suggestion.toLowerCase())).map((produit)=>(
                        <div className="p-2 my-2 cursor-pointer bg-white shadow-lg rounded" onClick={(e)=>{
                          // console.log(e)
                          setdataFacture({...dataFacture, suggestion:produit.name, toAdd:{...dataFacture.toAdd, quantite:1, Produit:produit}})}}  key={produit.special_id}>{produit.name}</div>
                      ))}
                    </div> }
                  </div>
                </div>
                <div className="p-2">
                  <button className="rounded p-2 bg-gray-800 text-white" onClick={imprimer}>Imprimer</button>
                </div>
                <div className="p-2 w-full h-full" ref={printer}>
                  <div className="header-printer py-3 hidden">
                    <div className="py-2 flex justify-between">
                          <img src={logo} alt="logo" className="w-32" />

                    </div>
                    <div className="text-start py-2 font-bold text-2xl">Facture N° {(dataFacture.Facture as FactureType)?.numfacture?.toLocaleUpperCase()}</div>
                    <div className="text-start py-2">Date {(dataFacture.Facture as FactureType)?.created_at?.toLocaleDateString()}</div>
                  </div>
                  <Table aria-label={`Facture N°: ${(dataFacture.Facture as FactureType)?.numfacture?.toLocaleUpperCase()}`}>
                      <TableHeader>
                      
                          <TableColumn>Produit</TableColumn>
                          <TableColumn>Prix</TableColumn>
                          <TableColumn>Quantité</TableColumn>
                          <TableColumn>Total</TableColumn>
                          <TableColumn className="no-print">Actions</TableColumn>
                       
                      </TableHeader>
                      <TableBody>
                        {dataFacture.Lignes.map((l, i)=>{
                          return <TableRow key={i}>
                            <TableCell>{l.Produit.name}</TableCell>
                            <TableCell>{l.Produit.prix}</TableCell>
                            <TableCell>{l.quantite}</TableCell>
                            <TableCell>{l.Produit.prix*l.quantite}</TableCell>
                            <TableCell className="flex items-center gap-2 no-print">
                              <Trash2 
                              className="cursor-pointer"
                              onClick={()=>{
                                deleteLigne(l);
                                setdataFacture({...dataFacture, Lignes:dataFacture.Lignes.filter((li:LigneFactureType)=>li.special_id!=l.special_id)})
                              }}/>

                              <Popover onOpenChange={(e)=>{
                                  if(!e){
                                    updateLigne(l)
                                  }
                              }}>
                                <PopoverTrigger>
                                  <FilePenIcon className="cursor-pointer"/>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div>
                                      <Input label="Quantité" type="number"  value={l.quantite as any} onInput={ (e:any)=>{
                                        console.log(e)
                                        // const old = await Produit.get({special_id:l.Produit.special_id})
                                        setdataFacture({...dataFacture, Lignes:dataFacture.Lignes.map((li:LigneFactureType)=>li.special_id==l.special_id?{...li, quantite:Number(e.target.value)}:li)})
                                        updateProductQuantiteByLigne(l.Produit, Number(e.target.value), l)
                                        }} />
                                    </div>
                                </PopoverContent>
                              </Popover>
                              
                            </TableCell>
                          </TableRow>
                        })}    
                      </TableBody>
                  </Table>

                  <div className="py-3">
                     <Card className="w-full p-2">

                      <div className="flex justify-between">
                        <div>Total</div>
                        <div>{dataFacture.Lignes.reduce((a,b)=>a+(b.Produit.prix*b.quantite),0)}</div>
                      </div>
                      
                      </Card>     
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
      </Modal>

        <Modal isOpen={showfacture} onOpenChange={setShowfacture} size="full" backdrop="blur">
        <ModalContent>
           {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Creer une facture</ModalHeader>
              <ModalBody>
                <p> 
                   <Input label="Client" onFocusChange={(e)=>{
                    console.log(e);
                     setSearchClientFocus(true)
                  }} 
                    onInput={(e:any)=>{
                      setdatatoAdd({
                        ...datatoAdd,
                        factures:{
                          ...datatoAdd.factures,
                          tempClient:e.target.value
                        }
                      })
                    }}
                    value={datatoAdd.factures.tempClient}
                    />
                   

                </p>
                       {/* <div>{JSON.stringify(datatoAdd.factures)}</div>
                       <div>   --- {JSON.stringify(datatoAdd.factures?.Client?.name  )}</div> */}
                      
                <p>
                   {searchClientFocus && <div className="py-2 bg-slate-100 px-2 rounded">
                    {((datatoAdd.factures.tempClient!=datatoAdd.factures?.Client?.name) && datatoAdd.factures.tempClient.length>0)?<div className="py-2 pb-4 mb-8">
                    <Button className="" onClick={()=>createSilentClient(datatoAdd.factures.tempClient)} color="warning">créer le client <span className="text-white font-bold">{datatoAdd.factures.tempClient}</span></Button>
                    </div>:""}
                  
                     {(datatoAdd.factures.tempClient!=datatoAdd.factures?.Client?.name) && data.clients.filter((client)=>client.name.toLocaleLowerCase().includes(datatoAdd.factures.tempClient.toLowerCase())).map((client)=>(
                      <Button  className="w-full text-gray-600 mt-2" key={client.special_id} onClick={()=>setdatatoAdd({...datatoAdd, factures:{...datatoAdd.factures, Client:client, tempClient:client.name}})}>{client.name}</Button>
                     ))}
                   </div>}
                </p>
                <div className="py-5">
                  <button className="rounded p-2 bg-gray-800 text-white" onClick={createFacture}>Ajouter</button>
                </div>
                
              </ModalBody>
              <ModalFooter>
               
                <Button color="primary" onPress={onClose}>
                  Fermer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={modals.createClient} onOpenChange={(e)=>setmodals({...modals, createClient:e})} size="lg" backdrop="blur">
        <ModalContent>
           {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un client</ModalHeader>
              <ModalBody>
                <p> 
                   <Input label="Nom" value={datatoAdd.clients.name} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, name:e.target.value}})}  />
                </p>
                <p>
                <Input label="tel" value={datatoAdd.clients.tel} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, tel:e.target.value}})}   />
                </p>
                <p>
                <Input label="email"  type="email" value={datatoAdd.clients.email} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, email:e.target.value}})}  />
                </p>
                <div className="py-5">
                  <button className="rounded p-2 bg-gray-800 text-white" onClick={createClient}>Ajouter</button>
                </div>
                
              </ModalBody>
              <ModalFooter>
               
                <Button color="primary" onPress={onClose}>
                  annuler
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        <div className="py-4 px-2 mb-3">
        <h1 className="text-3xl font-bold">Facturation</h1>
        </div>
        <Card className="px-2 p-3 mb-3">
          <div className="flex justify-start items-center gap-2">
              <button onClick={()=>setShowfacture(true)} className="rounded-xl bg-gray-800 p-2 text-white">Creer une facture</button>
              <button onClick={()=>setmodals({...modals, createClient:true})} className="rounded-xl bg-gray-800 p-2 text-white">Creer un client</button>
          </div>
          
        </Card>
        <Tabs>
            <Tab title="Factures" key={"facture"}>
            <div className="p-3">
              <div className="py-3">
                <Input label="Rechercher par numéro de facture" value={searchFacture} onInput={(e:any)=>setsearchFacture(e.target.value)} />
              </div>
              <div className="py-3">
              <Datepicker 
                    value={filterDate as any} 
                onChange={(value:any)=>{
                  setFilterDate({startDate:new Date(value.startDate), endDate:new Date(value.endDate)})
                  // console.log(value)
                  data.factures.map(f=>{
                    console.log(filterDate.startDate<(f?.created_at as any), filterDate.endDate>(f?.created_at as any))
                    console.log(((f?.created_at as any )>=filterDate.startDate) && (f?.created_at as any) <=filterDate.endDate)
                  })
                }} 
                popoverDirection="down"
                />
              </div>
              
            <Card className="p-3 py-2">
                <Table aria-label="Liste des factures">
                    <TableHeader>
                        <TableColumn>id</TableColumn>
                        <TableColumn>NumFacture</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Client</TableColumn>
                        <TableColumn>Total</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                       {(data.factures.reverse()).filter((f)=>((new Date((f.created_at as any).toString().split("/").reverse().join("-")).getTime()>=filterDate.startDate.getTime()) && (new Date((f.created_at as any).toString().split("/").reverse().join("-")).getTime()<=filterDate.endDate.getTime()))).filter(f=>f.numfacture?.includes(searchFacture)).map((facture, index)=>(
                        <TableRow key={facture.special_id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{facture.numfacture}</TableCell>
                        <TableCell>{facture?.created_at?.toLocaleDateString()}</TableCell>
                        <TableCell>{facture.Client.name}</TableCell>
                        <TableCell>--</TableCell>
                        <TableCell>
                            <div className="flex gap-2 items-center justify-center">
                            <EyeIcon className="w-5 h-5 cursor-pointer" onClick={()=>openFacture(facture)} />
                            
                            <Trash2 className="w-5 h-5 cursor-pointer" onClick={()=>deleteFacture(facture.special_id)} />
                           <Popover onOpenChange={(e)=>{
                            console.log(e, facture)
                            if(e){
                              setdatatoAdd({...datatoAdd, factures:{...datatoAdd.factures, tempClient:facture.Client.name}})
                            }else{
                              setTimeout(()=>{
                                setdatatoAdd({...datatoAdd, factures:{...datatoAdd.factures, factures:{
                                  numfacture:"", 
                                  tempClient:"",
                                  Client:{},
                                  created_at:new Date(),
                                  updated_at:new Date(), 
                                  special_id:"",
                                  id:0,
                                }}})
                              }, 500)
                            }
                           }}>
                             <PopoverTrigger>
                             <FilePenIcon className="w-5 h-5 cursor-pointer" />
                             </PopoverTrigger>
                             <PopoverContent className="w-64">
                             <p className="mx-0 px-0"> 
                            
                   <Input label="Client" onFocusChange={(e)=>{
                    console.log(e);
                     setSearchClientFocus(true)
                  }} 
                    onInput={(e:any)=>{
                      setdatatoAdd({
                        ...datatoAdd,
                        factures:{
                          ...datatoAdd.factures,
                          tempClient:e.target.value
                        }
                      })
                    }}
                    value={datatoAdd.factures.tempClient}
                    />
                   

                </p>
                       {/* <div>{JSON.stringify(datatoAdd.factures)}</div>
                       <div>   --- {JSON.stringify(datatoAdd.factures?.Client?.name  )}</div> */}
                      
                <p>
                   {searchClientFocus && <div className="py-2 bg-slate-100 px-2 rounded">
                    {((datatoAdd.factures.tempClient!=datatoAdd.factures?.Client?.name) && datatoAdd.factures.tempClient.length>0)?<div className="py-2 pb-4 mb-8">
                    <Button className="" onClick={()=>createSilentClient(datatoAdd.factures.tempClient)} color="warning">créer le client <span className="text-white font-bold">{datatoAdd.factures.tempClient}</span></Button>
                    </div>:""}
                  
                     {(datatoAdd.factures.tempClient!=datatoAdd.factures?.Client?.name) && data.clients.filter((client)=>client.name.toLocaleLowerCase().includes(datatoAdd.factures.tempClient.toLowerCase())).map((client)=>(
                      <Button  className="w-full text-gray-600 mt-2" key={client.special_id} onClick={()=>setdatatoAdd({...datatoAdd, factures:{...datatoAdd.factures, Client:client, tempClient:client.name}})}>{client.name}</Button>
                     ))}
                   </div>}
                </p>
                <div className="py-5">
                  <button className="rounded p-2 bg-gray-800 text-white" onClick={()=>updateFacture(facture.special_id, {...facture, Client:datatoAdd.factures.Client})}>modifier</button>
                </div>
                             </PopoverContent>
                           </Popover>
                           
                            </div>
                           
                        </TableCell>
                    </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
            </Tab>
            <Tab key={"Clients"} title="Clients">
            <div className="p-3">
            <Card className="p-3 py-2">
                <Table aria-label="Liste des clients">
                    <TableHeader>
                        <TableColumn>id</TableColumn>
                        <TableColumn>Nom</TableColumn>
                        <TableColumn>Tél</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Actions</TableColumn>
                        
                    </TableHeader>
                    <TableBody>
                       {data.clients.map((client:ClientType, index)=>(
                         <TableRow key={index}>
                         <TableCell>{index+1}</TableCell>
                         <TableCell>{client.name}</TableCell>
                         <TableCell>{client.tel}</TableCell>
                         <TableCell>{client.email}</TableCell>
                         <TableCell>
                             <div className="flex gap-2 items-center justify-center">
                             <EyeIcon className="w-5 h-5 cursor-pointer" />
                             <Trash2 className="w-5 h-5 cursor-pointer" onClick={()=>deleteClient(client.special_id)} />
                             <Popover placement="bottom" showArrow={true} onOpenChange={(e)=>{
                                if(e){
                                    setdatatoAdd({...datatoAdd,clients:client})
                                }else{
                                  setdatatoAdd({...datatoAdd,clients:defaultClientData})
                                }
                              }}>
                                <PopoverTrigger>
                                <FilePenIcon className="w-5 h-5 cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent>
                                     <div className="rounded border p-2">
                                     <p className="py-2"> 
                   <Input label="Nom" value={datatoAdd.clients.name} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, name:e.target.value}})}  />
                </p>
                <p className="py-2">
                <Input label="tel" value={datatoAdd.clients.tel} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, tel:e.target.value}})}   />
                </p>
                <p className="py-2">
                <Input label="email"  type="email" value={datatoAdd.clients.email} onInput={(e:any)=>setdatatoAdd({...datatoAdd, clients:{...datatoAdd.clients, email:e.target.value}})}  />
                </p>
                <div className="py-5">
                  <button className="rounded p-2 bg-gray-800 text-white" onClick={updateClient}>modifier</button>
                </div> 
                                     </div>
                                </PopoverContent>
                             </Popover>
                             </div>
                         </TableCell>
                         
                     </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
            </Tab>
        </Tabs>
       
    </div>)
}