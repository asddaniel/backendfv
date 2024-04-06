import { User, Usertype } from "@/utils/Database"
import { Card, Input, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import bcrypt from "bcryptjs"
import { FilePenLine, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from "@nextui-org/react"
// const bcrypt = require("bcryptjs")

export default function Users (){
    const [modalUser, setModalUser] = useState(false)
    const [users, setusers] = useState<Usertype[]>([])
    const [datatoAdd, setdatatoAdd] = useState({
        username:"", 
        email:"", 
        password:"", 
        confirmpassword:"", 
        telephone:"", 
        is_deleted:"false", 
        role:7,
    } as any);
    useEffect(()=>{
            User.all().then((users:Usertype[])=>{
                users = users.filter(us=>us.is_deleted==false)
                setusers(users);
            })
    }, [])

    const createUser = async ()=>{
        console.log(datatoAdd,  (datatoAdd.confirmpassword==datatoAdd.password) && (datatoAdd.username.length>0) && (datatoAdd.email.length>0))
        if(!((datatoAdd.confirmpassword==datatoAdd.password) && (datatoAdd.username.length>0) && (datatoAdd.email.length>0))){
            Swal.fire({
                title: "Oops..",
                text:"Erreur, veuillez remplir correctement le formulaire", 
                icon:"error",
            })
            return false;
        }
        const all = await User.all();
        const emailexist = all.some((user=>user.email === datatoAdd.email))
        if(emailexist){
            Swal.fire({
                title:"Oops..", 
                text:"Erreur de mail, cet adresse mail est déjà utilisé",
                icon:"error",
            })
            return;
        }
        const special_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const salt = await bcrypt.genSalt(9)
        console.log(salt);
        const hash = await bcrypt.hash(datatoAdd.password, salt)
        console.log(hash, "hash");
        // return;
       const newuser =  await User.create({
            username:datatoAdd.username, 
            email:datatoAdd.email, 
            telephone:datatoAdd.telephone, 
            password:hash, 
            role:datatoAdd.role,
            created_at:new Date(), 
            updated_at:new Date(),
            is_deleted:false, 
            special_id:special_id, 
            id:all.length

        })
        Swal.fire({
            title:"Réussi", 
            text:"utilisateur crée avec succès", 
            icon:"success", 
        })
        setModalUser(false)
        setusers([...users, newuser])
        setdatatoAdd({
            username:"", 
        email:"", 
        password:"", 
        confirmpassword:"", 
        telephone:"", 
        is_deleted:"false" 
        })
    }


    const updateUser = async(special_id:string)=>{
        if(datatoAdd.password.trim().length > 0){
            const salt = await bcrypt.genSalt(9)
            const hash = await bcrypt.hash(datatoAdd.password, salt)
            User.filter({special_id:special_id}).update({
                ...datatoAdd,
                password:hash
            })
            console.log("pass modified successfully")
        }else{
            console.log(datatoAdd)
            User.filter({special_id:special_id}).update({
                ...datatoAdd
            })
        }
        Swal.fire({
            title:"Réussi", 
            text:"Utilisateur modifié", 
            icon:"success", 
        })
        setusers([
            ...users.filter((user:Usertype)=>user.special_id!=special_id),
            datatoAdd
        ])
        setdatatoAdd({
        username:"", 
        email:"", 
        password:"", 
        confirmpassword:"", 
        role:7,
        telephone:"", 
        is_deleted:"false" 
        })
    }

    const deleteUser = async(special_id:string)=>{
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
                console.log(special_id + " is confirmed")
                User.filter({special_id:special_id}).update({is_deleted:true, deleted_at:new Date(), updated_at:new Date()})
                setusers(users.filter((user:Usertype)=>user.special_id!=special_id))
                Swal.fire(
                    "Supprimé!",
                    "Le client a été supprimé avec succès.",
                    "success"
                )
            }
        })
        
    }

    return (
        <div className="w-full">
            <Modal isOpen={modalUser} onClose={()=>setModalUser(false)} size="3xl" backdrop="blur">
                
                <ModalContent>
                <ModalHeader className="text-2xl font-bold"> Créer un utilisateur </ModalHeader>
                <ModalBody>
                        <div className="py-2">
                            <Input label="nom" value={datatoAdd.username} onInput={(e:any)=>setdatatoAdd({...datatoAdd, username:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Input label="email" value={datatoAdd.email} onInput={(e:any)=>setdatatoAdd({...datatoAdd, email:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Input label="telephone" value={datatoAdd.telephone} onInput={(e:any)=>setdatatoAdd({...datatoAdd, telephone:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Select label="Role" value={datatoAdd.role} onInput={(e:any)=>setdatatoAdd({...datatoAdd, role:e.target.value})} className="w-full">
                                    <SelectItem key={0}  value={0}>Admin</SelectItem>
                                    <SelectItem key={1}  value={1}>Vendeur</SelectItem>
                                    <SelectItem key={2}  value={2}>livreur</SelectItem>
                                    <SelectItem key={3}  value={3}>Facturier</SelectItem>
                                    <SelectItem key={4}  value={4}>Fournisseur</SelectItem>
                                    <SelectItem key={5}  value={5}>Caissier</SelectItem>
                                    <SelectItem key={6}  value={6}>Gestionnaire</SelectItem>
                            </Select>
                        </div>
                        <div className="py-2">
                            <Input type="password" label="mot de passe" value={datatoAdd.password} onInput={(e:any)=>setdatatoAdd({...datatoAdd, password:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Input label="Confirmer mot de passe " type="password" value={datatoAdd.confirmpassword} onInput={(e:any)=>setdatatoAdd({...datatoAdd, confirmpassword:e.target.value})} />
                        </div>
                        <div className="py-3">
                            <button onClick={()=>createUser()} className="rounded-xl font-bold bg-gray-800 text-white p-2">Enregistrer</button>
                        </div>

                </ModalBody>
                </ModalContent>
            </Modal>
            <div className="py-3 px-3 ">
                <span className="text-2xl font-bold">Gestion des utilisateurs</span>
            </div>
            <div className="py-2 px-3 flex justify-start ">
                <Card className="p-2">
                    <button className="rounded-2xl p-2 text-white bg-gray-800 " onClick={()=>setModalUser(true)}>Crée un utilisateur</button>
                </Card>
            </div>
            <div className="py-3">
                <Table aria-label="liste des utilisateurs">
                    <TableHeader>
                    <TableColumn>id</TableColumn>
                        <TableColumn>Nom</TableColumn>
                        <TableColumn>email</TableColumn>
                        <TableColumn>Télephone</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {users.map((user:Usertype, index:number)=>(
                            <TableRow>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.telephone}</TableCell>
                                <TableCell className="flex gap-3">
                                   <Popover onOpenChange={(e)=>{
                                    if(e){
                                        setdatatoAdd({...user, password:""})

                                    }
                                   }}>
                                    <PopoverTrigger>
                                    <FilePenLine className="cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="py-3 p-2">
                                            <Card className="p-2">

                                            <div className="py-2">
                            <Input label="nom" value={datatoAdd.username} onInput={(e:any)=>setdatatoAdd({...datatoAdd, username:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Input label="email" value={datatoAdd.email} onInput={(e:any)=>setdatatoAdd({...datatoAdd, email:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Input label="telephone" value={datatoAdd.telephone} onInput={(e:any)=>setdatatoAdd({...datatoAdd, telephone:e.target.value})} />
                        </div>
                        <div className="py-2">
                            <Select label="Role"  selectedKeys={[datatoAdd.role]}  value={datatoAdd.role} onChange={(e:any)=>setdatatoAdd({...datatoAdd, role:e.target.value})} className="w-full">
                                    <SelectItem key={0}   value={0}>Admin</SelectItem>
                                    <SelectItem key={1}  value={1}>Vendeur</SelectItem>
                                    <SelectItem key={2}  value={2}>livreur</SelectItem>
                                    <SelectItem key={3}  value={3}>Facturier</SelectItem>
                                    <SelectItem key={4}  value={4}>Fournisseur</SelectItem>
                                    <SelectItem key={5}  value={5}>Caissier</SelectItem>
                                    <SelectItem key={6}  value={6}>Gestionnaire</SelectItem>
                                    <SelectItem key={7}  value={7}>invité</SelectItem>
                            </Select>
                        </div>
                        <div className="py-2">
                            <Input type="password" label="mot de passe" value={datatoAdd.password} onInput={(e:any)=>setdatatoAdd({...datatoAdd, password:e.target.value})} />
                        </div>
                       
                        <div className="py-3">
                            <button onClick={()=>updateUser(datatoAdd.special_id)} className="rounded-xl font-bold bg-gray-800 text-white p-2">Enregistrer</button>
                        </div>

                                            </Card>
                                        </div>
                                    </PopoverContent>
                                   </Popover>
                                    <Trash2 className="cursor-pointer" onClick={()=>deleteUser(user.special_id)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>

        </div>
    )
}