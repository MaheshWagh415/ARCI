
export const PAST = {
    SENT_REMINDER: "Sent Reminder",
    PENDING: "Ask feedback",
    SUBMITED: "Feedback Submitted"
}
export const CLIENT_BASE_URL = "/#/";

export let BASE_URL = null;

let environmentSpecificConstants=()=>{
    if((process.env.REACT_APP_ARCI_ENVIRONMENT == 'PROD')){
        BASE_URL  = "http://yprmssrvdt:8083"
    }else if((process.env.REACT_APP_ARCI_ENVIRONMENT == 'TEST')){  
        BASE_URL  = "http://yprmssrvdt:8082"
    }else if((process.env.REACT_APP_ARCI_ENVIRONMENT == 'DEV')){  
        BASE_URL  = "http://yprmssrvdt:8081"
    }else{
        BASE_URL  = "http://localhost:8080"
    }
}

environmentSpecificConstants();
