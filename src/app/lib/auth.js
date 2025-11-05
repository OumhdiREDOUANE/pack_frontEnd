import Cookies from "js-cookie";
export function setToken(token) {
    Cookies.set("token", token, { expires: 7 }); // نخزن التوكن في الكوكيز لمدة 7 أيام
  }
  
  export function getToken() {
    return Cookies.get("token")||null;
  }
  
  export function removeToken() {
    Cookies.remove("token");
  }