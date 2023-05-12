const paypal = require("paypal-rest-sdk");

const paypalConfig = () => paypal.configure({
	mode: "sandbox",
	client_id: "AY9uhC43qxjVtkQaj6FGpLqEMo9l2ZiLzII-t65esfuPT69Imo6W4ScJWtsytPar9BpWuYKrSTxvQBwg",
	client_secret: "EEBROzMDrwyI1-ZtevlfBb5JGaaH5rHa2Fb0wnHmHygQEB_L-KFi0k02IlK3smFC09PqOFrbNSpNmTRR"
})

module.exports = paypalConfig;