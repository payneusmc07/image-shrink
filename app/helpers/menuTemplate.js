const constants = require("./constants")
const { app } = require("electron")

module.exports.menuTemplate = [
	...(constants.isMac
		? [
			{
				label: app.name,
				submenu: [
					{
						label: "About"
					},
				],
			},
		]
		: []),
	{
		role: "fileMenu",
	},
	...(!constants.isMac
		? [
			{
				label: "Help",
				submenu: [
					{
						label: "About"
					},
				],
			},
		]
		: []),
	...(constants.isDev
		? [
			{
				label: "Developer",
				submenu: [
					{role: "reload"},
					{role: "forcereload"},
					{type: "separator"},
					{role: "toggledevtools"},
				],
			},
		]
		: []),
]
