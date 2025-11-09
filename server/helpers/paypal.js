const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AUHNznuNexXkp2cvXCMr4cu8Z3tP5Rr8CUFrLDhEzdj5RqW_gDUDRXd7LUYRyXPpP-EJcRh0RcHSl5GE",
  client_secret: "EADnmEQolOLnOX_P3Sezibav00mQKZlAvXBkjoXLV0eUhLrBOZi75JSCpqjCKMNTyl-aq9xkGryGxo89",
});

module.exports = paypal;
