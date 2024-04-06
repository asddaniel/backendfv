import { models } from 'beast-orm';
import Dexie from 'dexie';

// 





export class User extends models.Model{
  Id = models.AutoField({primaryKey:true})
  username = models.CharField({maxLength: 100})
  email = models.CharField({blank: true, maxLength: 100})
  password = models.CharField({maxLength: 100})
  role = models.IntegerField();
  telephone = models.CharField({maxLength: 100})
  is_deleted = models.BooleanField({default: false})
  created_at = models.DateTimeField({blank:true})
  updated_at = models.DateTimeField({blank:true})
  deleted_at = models.DateTimeField({blank:true})
  special_id = models.CharField({maxLength: 100})
}
export type Usertype = {
    id?:number;
    username?:string;
    email:string;
    password:string;
    telephone?:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}

export class Role extends models.Model{ 
    id = models.IntegerField({primaryKey: true})
    name = models.CharField({maxLength:255})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})

}

export type RoleType = {
    id?:number;
    name:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deletd?:boolean;
    special_id:string;
}
export class Categorie extends models.Model{
    id = models.IntegerField({primaryKey: true, default:0, unique: true})
    name = models.CharField({maxLength:255})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
    
    
}

export type CategorieType = {
    id?:number;
    name:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}
export class Produit extends models.Model{
    id = models.IntegerField({primaryKey: true})
    name = models.CharField({maxLength:255})
    quantite = models.BigIntegerField({default:0})
    prix = models.BigIntegerField()
    is_deleted = models.BooleanField({default: false})
    Categorie = models.ForeignKey({model: Categorie})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
}

export type ProduitType = {
    id?:number;
    name:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    quantite?:number;
    prix:number;
    Categorie:any;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}

export class Client extends models.Model {
    id = models.IntegerField({primaryKey: true})
    name = models.CharField({maxLength:255})
    tel  = models.CharField({maxLength:255, blank:true})
    email = models.CharField({maxLength:255, blank:true});
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
}

export type ClientType = {
    id?:number;
    name:string;
    tel?:string;
    email?:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}

export class Reduction extends models.Model{
    id = models.IntegerField({primaryKey: true})
    is_deleted = models.BooleanField({default: false})
    montant = models.BigIntegerField()
    Facture = models.ForeignKey({model:Facture})
    pourcentage = models.IntegerField()
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
}

export type ReductionType = {
    id?:number;
    montant?:string|number;
    pourcentage?:number;
    facture:Facture;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}

export class Facture extends models.Model{
    id = models.IntegerField({primaryKey: true})
    Client = models.ForeignKey({model: Client})
    numfacture = models.CharField({maxLength:255})
    is_paid = models.BooleanField({default:false})
    User = models.ForeignKey({model: User, blank:true, default:{}})
    is_deleted = models.BooleanField({default: false})
    Reduction = models.ForeignKey({model: Reduction, blank:true})
    created_at = models.DateTimeField({blank:true, default: new Date()})
    updated_at = models.DateTimeField({blank:true}) 
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})

}

export class Fournisseur extends models.Model {
     id = models.IntegerField({primaryKey: true})
     name = models.CharField({maxLength:255})
     telephone = models.CharField({maxLength:255, blank:true})
     email = models.CharField({maxLength:255, blank:true})
     is_deleted = models.BooleanField({default: false})
     created_at = models.DateTimeField({blank:true})
     updated_at = models.DateTimeField({blank:true})
     deleted_at = models.DateTimeField({blank:true})
     special_id = models.CharField({maxLength: 100})

}

export class Depense extends models.Model {
    id = models.IntegerField({primaryKey: true})
    libelle = models.CharField({maxLength:255})
    montant = models.BigIntegerField()
    description = models.TextField()
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
}

export type DepenseType = {
    id?:number;
    montant?:number;
    libelle?:string;
    description?:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}
export type FournisseurType = {
    id?:number;
    name:string;
    telephone?:string;
    email?:string;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
}

export class Approvisionnement extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Fournisseur = models.ForeignKey({model: Fournisseur})
    Produit = models.ForeignKey({model:Produit})
    quantite = models.IntegerField()
    prix = models.BigIntegerField()
    description = models.TextField()
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank: true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
}

export class LigneFacture extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Produit = models.ForeignKey({model:Produit})
    Facture = models.ForeignKey({model:Facture})
    quantite = models.IntegerField()
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})

 }

 export class Livraison extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Facture = models.ForeignKey({model:Facture})
    User = models.ForeignKey({model:User})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
 }

 export class LivraisonLine extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Livraison = models.ForeignKey({model:Livraison})
    Produit = models.ForeignKey({model:Produit})
    quantite = models.IntegerField()
    CodeBarre = models.ForeignKey({model:CodeBarre})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
 }

 export type livraisonLineType = {
    id?:number;
    Livraison?:Livraison;
    Produit?:Produit;
    quantite?:number;
    CodeBarre?:CodeBarreType;
    created_at?:Date | string;
    updated_at?:Date | string;
    deleted_at?:Date | string;
    is_deleted?:boolean;
    special_id:string;
 }


 export class CodeBarre extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Produit = models.ForeignKey({model:Produit})
    codebarre = models.CharField({maxLength:255})
    Approvisionnement = models.ForeignKey({model:Approvisionnement})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank: true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
 }

 export class RoleUser extends models.Model {
    id = models.IntegerField({primaryKey: true})
    Role = models.ForeignKey({model:Role})
    User = models.ForeignKey({model:User})
    is_deleted = models.BooleanField({default: false})
    created_at = models.DateTimeField({blank: true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})
 }


 export class Paiement extends models.Model{
    id = models.IntegerField({primaryKey:true});
    Facture = models.ForeignKey({model:Facture})
    usd = models.BigIntegerField({blank:true})
    cdf = models.BigIntegerField({blank:true})
    taux = models.BigIntegerField({blank:true})
    is_deleted = models.BooleanField({default:false})
    created_at = models.DateTimeField({blank:true})
    updated_at = models.DateTimeField({blank:true})
    deleted_at = models.DateTimeField({blank:true})
    special_id = models.CharField({maxLength: 100})

 }
 export type PaiementType = {
    id?:number;
    Facture:FactureType;
    usd:number;
    cdf:number;
    taux:number;
    is_deleted?:boolean;
    created_at?:Date;
    updated_at?:Date;
    special_id:string;
 }
 export type RoleUserType = {
    id?: number;
    Role: RoleType;
    User: Usertype;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };
 export type FactureType = {
    id?: number;
    Client: ClientType;
    numfacture?: string;
    is_paid?: boolean;
    User?: Usertype;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };
  

 export type ApprovisionnementType = {
    id?: number;
    Fournisseur: FournisseurType;
    Produit: ProduitType;
    quantite: number;
    description?: string;
    prix: number;
    created_at?: Date;
    updated_at?: Date|string;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };
  
  export type LigneFactureType = {
    id?: number;
    Produit: ProduitType;
    Facture: FactureType;
    quantite: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };
  
  export type LivraisonType = {
    id?: number;
    Facture: FactureType;
    User: Usertype;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };
  
  export type CodeBarreType = {
    id?: number;
    Produit: ProduitType;
    codebarre: string;
    Approvisionnement: ApprovisionnementType;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_deleted?: boolean;
    special_id: string;
  };

  

  console.log("registration")
 models.register({
    databaseName:"mastertech", 
    version:1, 
    type: "indexedDB", 
    models: [User, Role, Categorie, Produit, Client, Facture, Fournisseur, Approvisionnement, LigneFacture, Livraison,
            CodeBarre, RoleUser, Reduction, Paiement, LivraisonLine, Depense]
 })
 //models.migrate();

 interface DataUpdate {
    [key: string]: any[];
}

export function filterByCommonProperty(arr1:DataUpdate[], arr2:DataUpdate[], propertyName:string):any[] {
    const merged = [...arr1, ...arr2];
    let identiqueIndex = merged.map(m=>m[propertyName]);
    const toIndex = identiqueIndex
    let all = identiqueIndex.filter(m=>{
        return toIndex.filter(i=>i == m).length>=2 
    });
   //console.log(all, toIndex);
   ///all=3;

    return merged.filter(m=>all.includes(m[propertyName]))
}
const tableList = [
    "User", "Role", "Categorie", "Produit", "Client", "Facture", "Fournisseur", "Approvisionnement", "LigneFacture", "Livraison",
            "CodeBarre", "RoleUser", "Reduction", "Paiement", "LivraisonLine", "Depense"
]
const alltable = [
    User, Role, Categorie, Produit, Client, Facture, Fournisseur, Approvisionnement, LigneFacture, Livraison,
            CodeBarre, RoleUser, Reduction, Paiement, LivraisonLine, Depense
]
export const retrieveLocalData = async()=>{

    const last_modified = new Date(localStorage.getItem("sync_date")??"2022-01-01T00:00:00")
    console.log(last_modified)
    let data:any = {}
    const list = await Promise.all(alltable.map(async(m)=>{
        const result = (await m.all()).filter(d=>(d.created_at as Date).getTime() >last_modified.getTime()  || (d.updated_at as Date) >last_modified);
        let response:any = {}
        response[m.getModelName()] = result;
        data[m.getModelName()] = result;
        return response;
    }))
   
    
    console.log(data)
  return data;
}

const allTables = {"User":User, "Role":Role, "Categorie":Categorie, "Produit":Produit, "Client":Client, "Facture":Facture, "Fournisseur":Fournisseur, "Approvisionnement":Approvisionnement, "LigneFacture":LigneFacture, "Livraison":Livraison,
    "CodeBarre":CodeBarre, "RoleUser":RoleUser, "Reduction":Reduction, "Paiement":Paiement, "LivraisonLine":LivraisonLine, "Depense":Depense}
export const  runUpdates = async(dataList:DataUpdate)=>{
    const toUpdate:any[] = []
    const toInsert:any[] = []
    //console.log(dataList)
        for (let key in dataList) {
            if ((dataList.hasOwnProperty(key)) && (Object.keys(allTables).map(d=>d.toLowerCase()).includes(key.toLowerCase()))) {
                console.log(`Clé: ${key}`);
    
                 
                allTables[key].all()
            .then((listData:any[])=>{
                const identiques = filterByCommonProperty(dataList[key], listData, "special_id")
                for(let i=0;i<identiques.length/2;i++){
    
                    if(new Date(identiques[i]?.updatedAt) > identiques[(identiques.length/2)+i]?.updatedAt){
                        console.log(identiques[i], identiques[(identiques.length/2)+i]);
                        toUpdate.push(identiques[i]);
                        allTables[key].filter({special_id:identiques[i].special_id}).update({...identiques[i], updatedAt:new Date(identiques[i].updatedAt)});
                    }
                }
                console.log(identiques)
                const spids = identiques.map(i=>i.special_id);
                const nonidentiques = dataList[key].filter((data:any)=>!spids.includes(data.special_id));
                console.log(nonidentiques, dataList[key])
                toInsert.concat(nonidentiques)
                // allTables[key].bulkAdd(nonidentiques.map(nn=>{
                //     return {...nn, udpdatedAt:new Date(nn.updatedAt)}
                // }))
                nonidentiques.forEach(async (element) => {
                    console.log("inserting element", element)
                    const old = await allTables[key].all();
                   const toadd = await allTables[key].create({...element, id:old.length});
                   console.log(toadd)
                });
            })
            }
        }
        console.log(toUpdate, toInsert);
        return true
    
        // dataList.data.forEach((data)=>{
        //     db.table(data).toArray()
        //     .then((listData:any[])=>{
        //         const identiques = filterByCommonProperty(data.data, listData, "special_id")
        //         for(let i=0;i<identiques.length/2;i++){
        //             if(new Date(identiques[i].createdAt) > identiques[i*2].createdAt){
        //                console.log(identiques[i]);
    
        //                 //db.table(data.table).where({special_id:identiques[i].special_id}).modify({is_deleted:true})
        //             }
        //         }
        //     })
        // });
    
        
    }