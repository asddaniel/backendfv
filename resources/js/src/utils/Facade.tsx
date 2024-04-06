import { User, retrieveLocalData } from "./Database";
import bcrypt from "bcryptjs"
import { useConfig } from "./Store";

export const initializeDefaultUser = async ()=>{
 const all = await User.all();
 if(all.length == 0){

  const salt = await bcrypt.genSalt(9)
  const hash = await bcrypt.hash("admin", salt)
  const user = await User.create({
    username:"admin", 
    id:all.length,
    email:"admin", 
    password:hash, 
    telephone:"0000",
    role:0,
    created_at:new Date(),
    is_deleted:false,
    special_id:generateAlphaNumericString(20),
  })
   
 }
 
}


export const getPageStyle = ()=>{
    // Récupérer toutes les feuilles de style liées au document
  const styleSheets:any = document.styleSheets;
  
  // Stocker les styles sous forme de chaîne de caractères
  let allStyles = '';
  
  // Parcourir toutes les feuilles de style
  for (const styleSheet of styleSheets) {
    try {
      // Récupérer les règles de style de chaque feuille de style
      const rules = styleSheet.cssRules || styleSheet.rules;
  
      // Parcourir toutes les règles de style
      for (const rule of rules) {
        allStyles += rule.cssText + '\n';
      }
    } catch (error:any) {
      // Gérer les éventuelles erreurs d'accès aux feuilles de style (peuvent être dues à des politiques de même origine, etc.)
      console.error('Erreur lors de l\'accès à une feuille de style :', error.message);
    }
  }
  
  // Afficher les styles dans la console ou faire ce que vous voulez avec la chaîne de caractères
  console.log(allStyles);
  return allStyles;
  }
  
  export function generateAlphaNumericString(length:number):string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }

  import { runUpdates } from "./Database";
  interface DataUpdate {
    [key: string]: any[];
}
  export const syncronize = ()=>{

    // const {config}:any = useConfig();
    const serveur = localStorage.getItem("config-server")??"http://localhost:8000"
    
    retrieveLocalData()
    .then(local=>{
      fetch(serveur+"/api/syncronize", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({data:local, last_modified:(new Date(localStorage.getItem("sync_date")??new Date().toLocaleDateString().split("/").reverse().join("-")))}), 
      }).then((response)=>response.json())
      .then((response:DataUpdate)=>{
        const final:DataUpdate = {}
        for (const rep of Object.keys(response)){
          //console.log(rep)
          let name = rep.slice(0, 1).toUpperCase()+rep.slice(1, rep.length-1)
          if(name.includes("_")){
            const before = name
            name = before.slice(0, before.indexOf("_"))+before.slice(before.indexOf("_")+1, before.indexOf("_")+2).toUpperCase()+before.slice(before.indexOf("_")+2, before.length)
          }
            final[name] = response[rep].map((obj)=>{
              return {...obj, is_deleted:(obj.is_deleted)?true:false, 
                created_at:((typeof(obj.created_at)=="string")? new Date(obj.created_at):obj.created_at), 
                updated_at:((typeof(obj.updated_at)=="string")? new Date(obj.updated_at):obj.updated_at), 
              }})
        }
        // console.log(response)
        console.log(final)
       runUpdates(final)
       localStorage.setItem("sync_date", JSON.stringify(new Date().toLocaleDateString().split("/").reverse().join("-")))
       
        // console.log(response)
      
      })

    })
    .catch(error=>console.log(error))
    
    
    
    // return <div></div>
  }

  export const makerequest = ({data, method, dataName})=>{
    const {config}:any = useConfig();
    if(config.frequence =="immediat"){
       fetch(config.server+"/"+dataName, {method:method, body:data})
       .then(res=>res.json())
       .then(res=>console.log(res))
      return
    }
    if(config.frequence == "journalier"){

    }
    if(config.frequence == "hebdomadaire"){

    }

    if(config.frequence == "par heure" ){

    }

  }