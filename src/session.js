import Cookies from "js-cookie";

export const setSessionCookie = (session) => {
    Cookies.remove("session");
    Cookies.set("session", session, { expires: 1 });  // store  session as json text.
  };
export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");  // in json form.

    if (!sessionCookie) {
      return {auth: false};
    } else {
      return JSON.parse(sessionCookie);
    }
};

export const removeSessionCookie = () => {
    Cookies.remove('session');
}