import { create } from 'zustand'

type LayouSetType = {
    sidebar:"full" | "min";
    page: "middle" | "full";
}
export type LayouType = {
    sidebar:"full" | "min";
    page: "middle" | "full";
    setLayoutWidth: (value:LayouSetType) => void;
}

export const useLayoutWidth = create((set) => ({
  sidebar:"full",
  page:"middle",

  setLayoutWidth: (value:LayouSetType) => set({ sidebar: value.sidebar, page: value.page}),
 
}))
export const useAuth = create((set)=>({
    auth:{
      isLogged:JSON.parse(localStorage.getItem("user") || "false")?true:false,
      user:JSON.parse(localStorage.getItem("user") || "{}"),
      connected_at:new Date(localStorage.getItem("connected_at")??new Date().toLocaleDateString().split("/").reverse().join("-")),
    },
    setAuth:(value:{isLogged:boolean, user:any})=>set({auth:{isLogged:value.isLogged, user:value.user, connected_at:new Date()}}),
}))

export const useConfig = create((set)=>({
    config:{
      server:localStorage.getItem("config-server")??"http://localhost:8000", 
        frequence:localStorage.getItem("config-frequence")??"immediat", 
        last_update:new Date(localStorage.getItem("sync_date")??new Date().toLocaleDateString().split("/").reverse().join("-")),
        
    }, 
    setConfig:(value:{server:string, frequence:string, last_update:Date})=>{
      localStorage.setItem("sync_date", value.last_update.toLocaleDateString().split("/").reverse().join("-"));
      localStorage.setItem("config-frequence", value.frequence)
      localStorage.setItem("config-server", value.server)
      set({config:{server:value.server, frequence:value.frequence, last_update:value.last_update}})}
}))