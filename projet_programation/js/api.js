const API = "http://localhost:3000/api"

async function apiLogin(email,password){
    const r = await fetch(API+"/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    })
    if(!r.ok) throw new Error("Login invalide")
    return await r.json()
}

async function apiRegister(email,password,role){
    const r = await fetch(API+"/auth/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,role})
    })
    if(!r.ok) throw new Error("Erreur inscription")
    return await r.json()
}

async function apiGetServices(){
    const r = await fetch(API+"/services")
    if(!r.ok) throw new Error("Erreur services")
    return await r.json()
}

async function apiCreateOrder(token,serviceId){
    const r = await fetch(API+"/orders",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        },
        body:JSON.stringify({serviceId})
    })
    if(!r.ok) throw new Error("Erreur commande")
    return await r.json()
}

async function apiGetMyOrders(token){
    const r = await fetch(API+"/orders/me",{
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    if(!r.ok) throw new Error("Erreur commandes")
    return await r.json()
}

async function apiAdminGetUsers(token){
    const r = await fetch(API+"/admin/users",{
        headers:{ "Authorization":"Bearer "+token }
    })
    if(!r.ok) throw new Error("Erreur admin users")
    return await r.json()
}

async function apiAdminGetServices(token){
    const r = await fetch(API+"/admin/services",{
        headers:{ "Authorization":"Bearer "+token }
    })
    if(!r.ok) throw new Error("Erreur admin services")
    return await r.json()
}

async function apiAdminGetOrders(token){
    const r = await fetch(API+"/admin/orders",{
        headers:{ "Authorization":"Bearer "+token }
    })
    if(!r.ok) throw new Error("Erreur admin orders")
    return await r.json()
}
