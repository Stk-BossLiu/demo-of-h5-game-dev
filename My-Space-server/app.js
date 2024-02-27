const fs = require("fs");
var bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const path = require("path");

let curPlayableInfo = {};
var cardInfos = [];
var history = require("connect-history-api-fallback");
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use(history());
const storage = multer.diskStorage({
	destination(req, file, cb) {
		if (file.mimetype.startsWith("image")) {
			cb(null, "./assets/images/");
		} else {
			// 生产环境去掉/public
			if (curPlayableInfo != {}) {
				cb(null, __dirname + "public/playables/" + curPlayableInfo.folder);
			}
		}
	},
	filename(req, file, cb) {
		// 解决文件名中文乱码
		file.originalname = Buffer.from(file.originalname, "latin1").toString(
			"utf-8"
		);
		let fileName = file.originalname;
		cb(null, fileName);
	},
});

const upload = multer({ storage });

const port = 3000;

function resolveData() {
	const dataJson = fs.readFileSync("./data.json", "utf-8");
	const data = JSON.parse(dataJson);
	var cardInfos = [],
		cardImages = [];
	Object.keys(data).forEach((key) => {
		cardInfos.push({ key: data[key] });
		cardImages.push({ key: data[key].image });
	});
	return [cardInfos, cardImages];
}

app.get("/api/renderCard", (req, res) => {
	cardInfos = resolveData()[0];
	console.log(cardInfos);
	res.send(cardInfos);
});

app.get("/api/cardImage", (req, res) => {
	const imagePath = cardInfos[parseInt(req.query.id) - 1].key.image;
	const imageBuffer = fs.readFileSync(imagePath);
	res.setHeader("Content-Type", "image/png");
	res.send(imageBuffer);
});

app.post("/api/uploadInfoSubmit", (req, res) => {
	if (req.body == {}) {
		res.send({ code: 1, msg: "参数错误" });
		return;
	}
	curPlayableInfo = req.body;
	const dataJson = fs.readFileSync("./data.json", "utf-8");
	const data = JSON.parse(dataJson);
	const id = Object.keys(data).length + 1;
	data[`card${id}`] = req.body;
	data[`card${id}`]["id"] = id;
	fs.writeFileSync("./data.json", JSON.stringify(data));
	res.send({ code: 0, msg: "上传成功" });
});

app.post("/api/uploadFile", upload.single("file"), async (req, res, next) => {
	if (req.file) {
		res.send({ code: 0, msg: "上传成功", url: "" });
	} else {
		res.send({ code: 1, msg: "上传失败" });
	}
});

app.post("/api/Authenticate", (req, res) => {
	const param = req.body;
	if (!param.password) {
		res.send({ code: 1, msg: "参数为空" });
		return;
	}
	if (param.password === "666888999") {
		res.send({ code: 0, msg: "密码正确" });
	} else {
		res.send({ code: 2, msg: "密码错误" });
	}
});

app.get("/api/removeCardInServer", (req, res) => {
	const id = req.query.id,
		name = req.query.name;

	console.log(data[`card${id}`]);
	try {
		const dataJson = fs.readFileSync("./data.json", "utf-8");
		const data = JSON.parse(dataJson);
		delete data[`card${id}`];
		console.log(JSON.stringify(data));
		fs.writeFileSync("./data.json", JSON.stringify(data));
		fs.unlinkSync(`./assets/images/${name}`);
		fs.unlinkSync(`./public/playables/${name}`);
	} catch (e) {
		res.send({ code: 1, msg: e });
	}
	res.send({ code: 0, msg: "上传成功", url: "" });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
