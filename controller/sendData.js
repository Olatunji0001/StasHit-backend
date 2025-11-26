import saveDetails from "../mongodb/dataSchema.js";
import register from "../mongodb/newUserSchema.js";
export const sendData = async (req, res) => {
  try {
    const jwtInfo = req.user;
    const gmail = jwtInfo.gmail;
    const id = jwtInfo.id;
    const check = await register.findOne({ gmail: gmail});
    if (check) {
      const search = await saveDetails.find({account_owner: { gmail, id : id } });

      if (!search || search.length === 0) {
       return res.status(204).json()
      } else {
        res.status(200).json({
          data: search,
        });
      }
    } else {
      return res.status(400).json({
        message: "invalid gmail",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "server error, try again later",
    });
  }
};
