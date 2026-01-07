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
            navGuest.style.display="none"
            navUser.style.display="flex"
            userInfo.textContent = s.email+" ("+s.role+")"
            adminBtn.style.display = s.role==="admin" ? "inline-block" : "none"
        }else{
            navGuest.style.display="flex"
            navUser.style.display="none"
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
            if(route==="admin") loadAdmin()
            if(route==="order") loadOrderServices()
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
        box.textContent="Chargement..."
        try{
            const data = await apiGetServices()
            box.innerHTML=""
            data.forEach(s=>{
                let d=document.createElement("div")
                d.className="service-card"
                d.innerHTML=`<b>${s.name}</b><br>${s.description}`
                box.appendChild(d)
            })
        }catch(e){
            box.textContent="Erreur"
        }
    }

    async function loadOrderServices(){
        const select = document.getElementById("orderService")
        const res = document.getElementById("orderResult")
        res.textContent=""
        const data = await apiGetServices()
        select.innerHTML=""
        data.forEach(s=>{
            let o=document.createElement("option")
            o.value=s.id
            o.textContent=s.name
            select.appendChild(o)
        })
        document.getElementById("btnOrder").onclick = async()=>{
            const s = getUserSession()
            try{
                await apiCreateOrder(s.token,select.value)
                res.textContent="Commande envoyée"
                res.style.color="green"
            }catch(e){
                res.textContent="Erreur commande"
                res.style.color="red"
            }
        }
    }

    async function loadAdmin(){
        const s = getUserSession()

        const u = await apiAdminGetUsers(s.token)
        const sv = await apiAdminGetServices(s.token)
        const o = await apiAdminGetOrders(s.token)

        document.getElementById("admin-users").innerHTML = JSON.stringify(u)
        document.getElementById("admin-services").innerHTML = JSON.stringify(sv)
        document.getElementById("admin-orders").innerHTML = JSON.stringify(o)
    }

    updateNavbar()
    showPage("login")
})
