const saveauth = (data) => {
  if (!data || typeof data !== "object") return;
  localStorage.setItem("auth", JSON.stringify(data));
};

const getauth = () => {
 
  try {
    const stored = localStorage.getItem("auth");
  if (!stored || stored === "undefined" || stored === "null") {
    return null;
  }
    const parsed = JSON.parse(stored);
    if(!parsed.token|| !parsed.user){
      return null;
    }
    if(parsed.user.id && !parsed.user._id){
      parsed.user._id = parsed.user.id; // normalize id field
    }
    return parsed;
  
  } catch (e) {
    console.error("Invalid auth JSON", e);
    localStorage.removeItem("auth"); // clean up bad value
    return null;
  }
};

const removeauth = () => {
  localStorage.removeItem("auth");
};





export {saveauth, getauth, removeauth}

