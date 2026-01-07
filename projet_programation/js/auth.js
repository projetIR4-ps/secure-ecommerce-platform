const KEY = "secureUser";

function saveUserSession(data){
    localStorage.setItem(KEY, JSON.stringify(data));
}

function getUserSession(){
    let d = localStorage.getItem(KEY);
    if(!d) return null;
    return JSON.parse(d);
}

function clearUserSession(){
    localStorage.removeItem(KEY);
}

function isLogged(){
    return getUserSession() !== null;
}

function getRole(){
    let u = getUserSession();
    return u ? u.role : null;
}