const { Menu, shell, ipcMain } = require("electron");

module.exports = function menu() {
  const isMac = process.platform === "darwin";

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
        {
          label: app.name,
          submenu: [
            { role: "about", label: "sobre" },
            { type: "separator" },
            { role: "services", label: "serviços" },
            { type: "separator" },
            { role: "hide", label: "esconder" },
            // { role: "hideothers" },
            // { role: "unhide" },
            // { type: "separator" },
            { role: "quit", label: "Sair" },
          ],
        },
      ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "Arquivo",
      submenu: [
        isMac
          ? { role: "close", label: "Sair" }
          : { role: "quit", label: "Sair" },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Desfazer" },
        { role: "redo", label: "Refazer" },
        { type: "separator" },
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
        ...(isMac
          ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
          : [
            { role: "delete", label: "Excluir" },
            { type: "separator" },
            { role: "selectAll", label: "Selecionar Tudo" },
          ]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "Ver",
      submenu: [
        { role: "reload", label: "Recarregar" },
        // { role: "forceReload",  },
        { role: "toggleDevTools", label: "Ferramenta de desenvolvimento" },
        { type: "separator" },
        // { role: "resetZoom" },
        // { role: "zoomIn" },
        // { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Tela inteira" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Janela",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        // { role: "zoom" },
        // ...(isMac ? [
        //       { type: "separator" },
        //       { role: "front" },
        //       { type: "separator" },
        //       { role: "window" },
        //     ]
        //   : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      label: "Ajuda",
      submenu: [
        {
          label: "Saiba mais",
          click: async () => await shell.openExternal("https://electronjs.org"),
        },
        {
          label: "Sobre",
          click: async (e) => {
            console.log("Bingo só funciona aqui no console do nodejs:\n", e);
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
