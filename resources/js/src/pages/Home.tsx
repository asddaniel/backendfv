import { Card } from "@nextui-org/react"
import { ReceiptIcon, DollarSignIcon, BaggageClaimIcon, UsersIcon, ShoppingCartIcon, BookIcon } from "lucide-react"
import { Link } from "react-router-dom"
export default function Home(){
    return (<div className="w-full bg-inherit font-inherit py-5">
        <h1 className="font-bold text-3xl">Home</h1>
       
    
    <div className="border p-3 rounded-lg">
        <div className="grid lg:grid-cols-4 md:grid-col-3 sm:grid-col-2 grid-col-1 gap-2">

        <Link to={"/facturation"} >
        <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <ReceiptIcon/>
               <div className="font-medium text-xl">Facturation</div>
               </div>
               <div className="pt-3">
                
               </div>
            </Card>
        </Link>

        <Link to={"/caisse"}>
        <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <DollarSignIcon/>
               <div className="font-medium text-xl">Caisse</div>
               </div>
               <div className="pt-3 flex justify-between">
               </div>
            </Card>
        </Link>
            
        <Link to={"/livraison"}>
        <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <ShoppingCartIcon/>
               <div className="font-medium text-xl">Livraison</div>
               </div>
               <div className="pt-3">
              
               </div>
            </Card>
        </Link>
          
        <Link to={"/stock"}>
        <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <BaggageClaimIcon/>
               <div className="font-medium text-xl">Stock</div>
               </div>
               <div className="pt-3">
               </div>
            </Card>
        </Link>
        
        <Link to={"/rapport"}>
            <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <BookIcon/>
               <div className="font-medium text-xl">Rapport</div>
               </div>
               <div className="pt-3">
                Rapport
               </div>
            </Card>
        </Link>

        <Link to={"/users"}>

             
        <Card className="p-2 font-light hover:shadow-2xl cursor-pointer transition-all duration-500">
               <div className="flex gap-2 justify-start items-center">
               <UsersIcon/>
               <div className="font-medium text-xl">Users</div>
               </div>
               <div className="pt-3">
                Gestion des utilisateurs
               </div>
            </Card>
        
        </Link>
          
        </div>
    </div>
   
        
    </div>)
}