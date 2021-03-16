const { Menu } = require("electron")
const menuTemplate = require("./menuTemplate.js")

module.exports = class MenuBuilder {
	constructor(){}
	
	static buildContextMenu(windowName) {
		const contextMenu = Menu.buildFromTemplate([
			{role: "copy"},
			{role: "paste"},
			{role: "delete"},
			{type: "separator"},
			{role: "reload"},
			{role: "toggleDevTools"},
			{type: "separator"},
			{role: "quit"},
		])
		windowName.webContents.on("context-menu", () => contextMenu.popup())
	}
	
	static buildAppMenu() {
		const appMenu = Menu.buildFromTemplate(menuTemplate.menuTemplate)
		Menu.setApplicationMenu(appMenu)
	}
}

