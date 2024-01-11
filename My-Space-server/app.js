const fs = require("fs");
var bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const app = express();
const clientUrl = __dirname.replace("-server", "");
let curPlayableInfo = {};
var cardInfos = [];
const storage = multer.diskStorage({
	destination(req, file, cb) {
		if (file.mimetype.startsWith("image")) {
			cb(null, "./assets/images/");
		} else {
			// 生产环境去掉/public
			if (curPlayableInfo != {}) {
				console.log(file);
				cb(
					null,
					clientUrl + "/public" + "/playables/" + curPlayableInfo.folder
				);
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
app.use(bodyParser.json());
const port = 3000;

function resolveData() {
	const dataJson = fs.readFileSync("./data.json", "utf-8");
	console.log("dataJson>>>>>>", dataJson);
	const data = JSON.parse(dataJson);
	var cardInfos = [],
		cardImages = [];
	Object.keys(data).forEach((key) => {
		cardInfos.push({ key: data[key] });
		cardImages.push({ key: data[key].image });
	});
	return [cardInfos, cardImages];
}

function generateToken() {
	let token = "";
	for (let i = 0; i <= 32; i++) {
		const n = Math.floor(Math.random() * 16.0).toString(16);
		token += n;
	}
	let time = Date.now();
	let tokensJson = fs.readFileSync("./tokens.json", "utf-8");
	let tokens = JSON.parse(tokensJson);
	tokens[token] = time.toString();
	fs.writeFileSync("./tokens.json", JSON.stringify(tokens));
	const tokenPeriodTimer = setTimeout(() => {
		deleteToken(token);
		clearTimeout(tokenPeriodTimer);
	}, 1000 * 60 * 30); // 30分钟后删除token
	return token;
}

function checkToken(token) {
	const tokensJson = fs.readFileSync("./tokens.json");
	const tokens = JSON.parse(JSON.stringify(tokensJson));
	const nowTime = Date.now();
	if (nowTime - tokens[token] > 1000 * 60 * 30) {
		deleteToken(token);
		return false;
	}
	if (tokens[token]) return true;
	return false;
}

function initTokens() {
	let tokens = {};
	fs.writeFileSync("./tokens.json", JSON.stringify(tokens));
}

function deleteToken(token) {
	let tokensJson = fs.readFileSync("./tokens.json");
	let tokens = JSON.parse(JSON.stringify(tokensJson));
	delete tokens[token];
	fs.writeFileSync("./tokens.json", JSON.stringify(tokens));
}

// function img2Base64(imgUrl) {
//   console.log(imgUrl);
//   var bitmap = fs.readFileSync(imgUrl);
//   var base64Str = Buffer.from(bitmap, 'binary').toString('base64'); // base64编码
//   return base64Str;
// }

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/api/renderCard", (req, res) => {
	cardInfos = resolveData()[0];
	res.send(cardInfos);
});

app.get("/api/cardImage", (req, res) => {
	const imagePath = cardInfos[parseInt(req.query.id) - 1].key.image;
	const imageBuffer = fs.readFileSync(imagePath);
	res.setHeader("Content-Type", "image/png");
	res.send(imageBuffer);
});

app.post("/api/uploadInfoSubmit", (req, res) => {
	console.log("uploadInfo: ", req.body);
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
	const token = generateToken();
	if (!param.password) {
		res.send({ code: 1, msg: "参数为空", token: token });
		return;
	}
	if (param.password === "666888999") {
		res.send({ code: 0, msg: "密码正确" });
	} else {
		res.send({ code: 2, msg: "密码错误" });
	}
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
