const {Chat} = require("../models/Chat");

router.get("/", async (req, res) => {
	try {
		let chats = await Chat.find();
		res.send(chats);
	} catch (err) {
		res.send({msg: err});
	}
});