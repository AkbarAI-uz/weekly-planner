const { Tray, Menu } = require('electron');
const path = require('path');

function createTray(mainWindow) {
  const iconPath = path.join(__dirname, '../../renderer/public/icon.png');
  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Planner',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Quick Stats',
      click: async () => {
        // Implementation for quick stats
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy();
      }
    }
  ]);

  tray.setToolTip('Weekly Planner');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return tray;
}

module.exports = { createTray };