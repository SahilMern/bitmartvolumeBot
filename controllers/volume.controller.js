const volumeBotModel = require("../models/volumeBot.model");

const setvolumeBotInformation = async (req, res) => {
  try {
    // console.log(req.body);
    const { time, limit } = req.body;
    const requiredFields = ["time", "limit"];
    for (const field of requiredFields) {
      if (!(field in req.body) || !req.body[field]) {
        return res.status(400).json({
          status: false,
          message: `Field '${field}' must have a value`,
        });
      }
    }
    const volumeBotKeys = await volumeBotModel({
      time,
      limit,
    });
    const volumeBotDetails = await volumeBotKeys.save();
    return res.status(200).json({
      message: "volume bot parameter set",
      volumeBotDetails
    });
  } catch (error) {
    console.log(error, "error");
  }
};

module.exports = {
  setvolumeBotInformation,
};


//maine parameter jo the unhe databse mai insert kara diya or aab mai ye chahat hu jab vah on button par clicke kar tab vo data database mai se aaye or time and limit get kar le or apna working start karde 

//time or limit matlab ye hai ki jaise mai buy or sell perofrm karna chahat hu to jitna time diya hai example. 3min(any set time )hai to  2 min tak buying selling chale and limit hai 6(any set number) to har time ko limit karke har time mai vo buying selling hoti rahega 

//kisi ne api call ki database vo record lega and usme se limit and limit lega buying selling kab tak hogi vo time par decide hoga and limit jaise hogi utane baar he buy or sell hoga ek baar buy or ek baar sell