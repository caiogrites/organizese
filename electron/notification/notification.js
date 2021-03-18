const { Notification } = require("electron");

// create a new notification
module.exports = function createNotification() {
  const notification = {
    title: "Bem vindo(a) ao Organizese",
    body: "Seu aplicativo foi inicializado com sucesso.",
  };
  new Notification(notification).show();
};
