import { KEYS } from "./storage";

/** Runs before first paint so there's no theme flash. Dark is the default. */
export const themeScript = `try{if(localStorage.getItem("${KEYS.theme}")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;
