document.addEventListener("DOMContentLoaded", ()=>{

    const pages = document.querySelectorAll(".page")
    const globalMessage = document.getElementById("global-message")

    const navGuest = document.getElementById("nav-guest")
    const navUser = document.getElementById("nav-user")
    const userInfo = document.getElementById("user-info")
    const adminBtn = document.getElementById("admin-btn")

    function showMessage(msg,type="success"){
        globalMessage.textContent = msg
        globalMessage.className = type
        globalMessage.classList.remove("hidden")
        setTimeout(()=>globalMessage.classList.add("hidden"),2500)
    }

    function showPage(name){
        pages.forEach(p=>p.classList.add("hidden"))
        document.getElementById("page-"+name).classList.remove("hidden")
    }

    function updateNavbar(){
        const s = getUserSession()
        if(s){
            navGuest.style.display = "none"
            navUser.style.display = "flex"
            userInfo.textContent = s.email+" ("+s.role+")"
            adminBtn.style.display = s.role === "admin" ? "inline-block" : "none"
            document.getElementById("page-login").classList.add("hidden")
            document.getElementById("page-register").classList.add("hidden")
        }else{
            navGuest.style.display = "flex"
            navUser.style.display = "none"
            showPage("login")
        }
    }

    document.querySelectorAll("button[data-route]").forEach(btn=>{
        btn.onclick = ()=>{
            const route = btn.getAttribute("data-route")
            if(!isLogged() && route!=="login" && route!=="register"){
                showMessage("Connecte toi","error")
                showPage("login")
                return
            }
            if(route==="admin" && getRole()!=="admin"){
                showMessage("Accès refusé","error")
                showPage("services")
                return
            }
            showPage(route)
            if(route==="services") loadServices()
            if(route==="order") loadOrder()
            if(route==="admin") loadAdmin()
        }
    })

    document.getElementById("logout-btn").onclick = ()=>{
        clearUserSession()
        updateNavbar()
        showPage("login")
    }

    document.getElementById("form-login").onsubmit = async(e)=>{
        e.preventDefault()
        const f = new FormData(e.target)
        try{
            const r = await apiLogin(f.get("email"), f.get("password"))
            saveUserSession(r)
            updateNavbar()
            showMessage("Connexion réussie")
            showPage("services")
            loadServices()
        }catch(e){
            showMessage("Erreur login","error")
        }
    }

    document.getElementById("form-register").onsubmit = async(e)=>{
        e.preventDefault()
        const f = new FormData(e.target)
        try{
            await apiRegister(f.get("email"), f.get("password"), f.get("role"))
            showMessage("Compte créé")
            showPage("login")
        }catch(e){
            showMessage("Erreur inscription","error")
        }
    }

    async function loadServices(){
        const box = document.getElementById("services-list")
        box.textContent = "Chargement..."
        try{
            const data = await apiGetServices()
            box.innerHTML = ""
            if(!data || data.length === 0){
                box.textContent = "Aucun service"
                return
            }
            data.forEach(s=>{
                let d = document.createElement("div")
                d.className = "service-card"
                d.innerHTML = `<b>${s.name}</b><br>${s.description || ""}`
                box.appendChild(d)
            })
        }catch(e){
            box.textContent = "Erreur chargement services"
        }
    }

    async function loadOrder(){
        const select = document.getElementById("orderService")
        const res = document.getElementById("orderResult")
        const list = document.getElementById("my-orders-list")
        res.textContent = ""
        list.textContent = ""
        try{
            const services = await apiGetServices()
            select.innerHTML = ""
            services.forEach(s=>{
                let o = document.createElement("option")
                o.value = s.id
                o.textContent = s.name
                select.appendChild(o)
            })
        }catch(e){
            res.textContent = "Erreur chargement services"
            res.style.color = "red"
            return
        }
        const s = getUserSession()
        document.getElementById("btnOrder").onclick = async()=>{
            try{
                await apiCreateOrder(s.token, select.value)
                res.textContent = "Commande envoyée"
                res.style.color = "green"
                loadMyOrders()
            }catch(e){
                res.textContent = "Erreur commande"
                res.style.color = "red"
            }
        }
        loadMyOrders()
    }

    async function loadMyOrders(){
        const list = document.getElementById("my-orders-list")
        const s = getUserSession()
        if(!s){
            list.textContent = ""
            return
        }
        try{
            const data = await apiGetMyOrders(s.token)
            if(!data || data.length === 0){
                list.textContent = "Aucune commande"
                return
            }
            let html = "<table><tr><th>ID</th><th>Service</th><th>Status</th></tr>"
            data.forEach(o=>{
                html += "<tr><td>"+o.id+"</td><td>"+o.serviceId+"</td><td>"+(o.status || "")+"</td></tr>"
            })
            html += "</table>"
            list.innerHTML = html
        }catch(e){
            list.textContent = "Erreur chargement commandes"
        }
    }

    async function loadAdmin(){
        const s = getUserSession()
        const boxUsers = document.getElementById("admin-users")
        const boxServices = document.getElementById("admin-services")
        const boxOrders = document.getElementById("admin-orders")
        boxUsers.textContent = "Chargement..."
        boxServices.textContent = "Chargement..."
        boxOrders.textContent = "Chargement..."
        try{
            const users = await apiAdminGetUsers(s.token)
            const services = await apiAdminGetServices(s.token)
            const orders = await apiAdminGetOrders(s.token)

            let u = "<table><tr><th>Email</th><th>Rôle</th></tr>"
            users.forEach(x=>{
                u += "<tr><td>"+x.email+"</td><td>"+x.role+"</td></tr>"
            })
            u += "</table>"
            boxUsers.innerHTML = u

            let sv = "<table><tr><th>ID</th><th>Nom</th><th>Description</th></tr>"
            services.forEach(x=>{
                sv += "<tr><td>"+x.id+"</td><td>"+x.name+"</td><td>"+(x.description || "")+"</td></tr>"
            })
            sv += "</table>"
            boxServices.innerHTML = sv

            let o = "<table><tr><th>ID</th><th>Service</th><th>Utilisateur</th><th>Status</th></tr>"
            orders.forEach(x=>{
                o += "<tr><td>"+x.id+"</td><td>"+x.serviceId+"</td><td>"+x.user+"</td><td>"+(x.status || "")+"</td></tr>"
            })
            o += "</table>"
            boxOrders.innerHTML = o

        }catch(e){
            boxUsers.textContent = "Erreur admin"
            boxServices.textContent = "Erreur admin"
            boxOrders.textContent = "Erreur admin"
        }
    }

    updateNavbar()
    const s = getUserSession()
    if(s){
        showPage("services")
        loadServices()
    }else{
        showPage("login")
    }
})
