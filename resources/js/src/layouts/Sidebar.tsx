
import { Card } from "@nextui-org/react"
import { HomeIcon, BoltIcon, ReceiptIcon, ShoppingCartIcon, DollarSignIcon, HandCoinsIcon,
     LogOutIcon, BookIcon, UsersIcon, BaggageClaimIcon, MenuIcon, XCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/utils/Store"
// import { Popover } from "@nextui-org/react"


import { motion } from "framer-motion";
import { useLayoutWidth, LayouType } from "@/utils/Store";
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
    const [activetab, setactivetab] = useState(0)
    const [openMenu, setOpenMenu] = useState(false)
    const {setLayoutWidth, sidebar} = useLayoutWidth() as LayouType
    const {auth, setAuth} :any = useAuth()
    const redirect = useNavigate()
    const route = useLocation()
const logout = ()=>{
    const targetUser = localStorage.getItem('user')
    if(targetUser){
        
        localStorage.removeItem('user')
       
    }
    setAuth({isLogged:false, user:{}})
    redirect("/login")
}
    const updateLayout = (state:boolean)=>{
        console.log(state)
        if(state){
            setLayoutWidth({sidebar:"min", page:"full"})
            setOpenMenu(!openMenu)
            return
        }
        setLayoutWidth({sidebar:"full", page:"middle"})
        setOpenMenu(!openMenu)
    }

    useEffect(()=>{
         console.log(route.pathname)
    }, [route.pathname])
    return (<>
            <div className={" h-screen py-6 fixed transition-all duration-300 w-16  "+(sidebar=="full"?"lg:w-64":"lg:w-16")}>
        <Card className=" h-full p-3 bg-slate-800 shadow-lg overflow-y-auto">
        
        <motion.div layout className="flex justify-end px-3">
        {openMenu? <MenuIcon onClick={()=>updateLayout(true)} className="hover:scale-110 cursor-pointer font-bold transition-all duration-300 text-white "/>:<XCircleIcon onClick={()=>updateLayout(false)} className="hover:scale-110 cursor-pointer font-bold transition-all duration-300 text-white "/>}
        </motion.div>
        
    
      
        <Link to={"/"} className={"flex flex-col justify-evenly pt-6 text-decoration-none "}>
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==0?"bg-gray-950":"")} onClick={()=>setactivetab(0)}>
                    <HomeIcon  />
                    {sidebar=="full" &&<button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Accueil </button>}
                </div>
               
            </Link>
            {(auth.user.role==3 || auth.user.role==0 || auth.user.role==1) &&<Link to={"/facturation"} className="flex flex-col justify-evenly pt-2">
                <div className={"hover:bg-gray-900  transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==1?"bg-gray-950":"")} onClick={()=>setactivetab(1)}>
                    <ReceiptIcon  />
                    {sidebar=="full" &&<button className=" lg:block hidden bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Facturation </button>}
                </div>
               
            </Link>}
           { (auth.user.role==2 || auth.user.role==0 || auth.user.role==1) && <Link to={"/livraison"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==2?"bg-gray-950":"")} onClick={()=>setactivetab(2)}>
                    <ShoppingCartIcon  />
                    {sidebar=="full" &&<button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Livraison </button>}
                </div>
               
            </Link>}
            {(auth.user.role==5 || auth.user.role==0 || auth.user.role==1 || auth.user.role == 7) && <Link to={"/caisse"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==3?"bg-gray-950":"")} onClick={()=>setactivetab(3)}>
                    <DollarSignIcon  />
                    {sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> caisse </button>}
                </div>
               
            </Link>}
            {(auth.user.role==6 || auth.user.role==0  ) && <Link to={"/stock"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==4?"bg-gray-950":"")} onClick={()=>setactivetab(4)}>
                    <BaggageClaimIcon  />
                    {sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Stock </button>}
                </div>
               
            </Link>}

            <Link to={"/rapport"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded shadow p-2 flex justify-start gap-2 items-center "+(activetab==5?"bg-gray-950":"")} onClick={()=>setactivetab(5)}>
                    <BookIcon  />
                   {sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Rapport </button>}
                </div>
               
            </Link>
            <Link to={"/depense"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 transition-all duration-300 py-1 text-white rounded shadow p-2 flex justify-start gap-2 items-center "+(activetab==7?"bg-gray-950":"")} onClick={()=>setactivetab(7)}>
                    <HandCoinsIcon  />
                   {sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Depenses </button>}
                </div>
               
            </Link>

            {(auth.user.role==0 ) && <Link to={"/users"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 hover:shadow-lg transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==6?"bg-gray-950":"")} onClick={()=>setactivetab(6)}>
                    <UsersIcon  />
                   { sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Users </button>}
                </div>
               
            </Link>}
            <Link to={"/params"} className="flex flex-col justify-evenly pt-6">
                <div className={"hover:bg-gray-900 hover:shadow-lg transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center "+(activetab==8?"bg-gray-950":"")} onClick={()=>setactivetab(8)}>
                    <BoltIcon  />
                   { sidebar=="full" && <button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Paramètres</button>}
                </div>
               
            </Link>
            
            {<div className="flex flex-col justify-evenly pt-6 cursor-pointer" onClick={()=>logout()}>
                <div className="hover:bg-gray-800 hover:shadow-lg transition-all duration-300 py-1 text-white rounded  p-2 flex justify-start gap-2 items-center">
                    <LogOutIcon  />
                   { sidebar=="full" &&<button className="hidden lg:block bg-transparent text-inherit text-start text-2xl font-light rounded-xl outline-none border-none   "> Log out </button>}
                </div>
               
            </div>}
        </Card>
    </div>
    </>)
}