import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


import './index.css'

// import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// import { User, Role, Categorie, Produit, Client, Facture, Fournisseur, Approvisionnement, LigneFacture, Livraison,
//   CodeBarre, RoleUser } from './utils/Database'

// models.register({
//   databaseName:"matech", 
//   version:1, 
//   type: "indexedDB", 
//   models: [User, Role, Categorie, Produit, Client, Facture, Fournisseur, Approvisionnement, LigneFacture, Livraison,
//           CodeBarre, RoleUser]
// })
// Categorie.all().then((res=>{console.log(res)}))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// postMessage({ payload: 'removeLoading' }, '*')
