const path = require("path")
const os = require("os")
const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron")
const imagemin = require("imagemin")
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require("imagemin-pngquant")
const slash = require("slash")
const log = require("electron-log")
const constants = require("./app/helpers/constants")
const menuBuilder = require("./app/helpers/menuBuilder")

// Set env
process.env.NODE_ENV = "production"

let mainWindow

const createMainWindow = async() => {
	mainWindow = new BrowserWindow({
		title: "ImageShrink",
		width: constants.isDev ? 800 : 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: !!constants.isDev,
		backgroundColor: "white",
		webPreferences: {
			nodeIntegration: true,
		},
	})
	await mainWindow.loadFile("./app/index.html")
	menuBuilder.buildContextMenu(mainWindow)
}

app.on("ready", async() => {
	await createMainWindow()
	menuBuilder.buildAppMenu()
	mainWindow.on("closed", () => (mainWindow = null))
})


ipcMain.on("image:minimize", async (e, options) => {
	options.dest = path.join(os.homedir(), "imageshrink")
	await shrinkImage(options)
})

const shrinkImage = async ({imgPath, quality, dest}) => {
	try {
		const pngQuality = quality / 100
		
		const files = await imagemin([slash(imgPath)], {
			destination: dest,
			plugins: [
				imageminMozjpeg({quality}),
				imageminPngquant({
					quality: [pngQuality, pngQuality],
				}),
			],
		})
		
		log.info(files)
		await shell.openPath(dest)
		mainWindow.webContents.send("image:done")
	} catch (err) {
		log.error(err)
	}
}
app.on("window-all-closed", () => app.quit())

app.allowRendererProcessReuse = true
