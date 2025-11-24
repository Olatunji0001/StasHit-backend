import saveDetails from "../mongodb/dataSchema.js";
import register from "../mongodb/newUserSchema.js";

export const information = async (req, res) => {
  try {
    const jwtInfo = req.user;
    const { contactname, contact, relationship, notes, email } = req.body;
    if (!(contactname && contact && relationship)) {
      return res.status(400).json({
        message: "Input all required fields",
      });
    }
    if (notes.length > 50) {
        return res.status(204).json()
    }
    if ((contactname && contact && relationship) || notes || email) {
      const jwtGmail = jwtInfo.gmail;
      const check = await register.findOne({ gmail: jwtGmail, verified: true });
      if (check) {
        const data = new saveDetails({
          account_owner: {
            gmail: jwtInfo.gmail,
            id: jwtInfo.id,
          },
          contactname,
          contact,
          relationship,
          notes,
          email,
        });
        await data.save();

        return res.status(201).json({
          message: "Saved successfully",
        });
      } else {
        return res.status(401).json({
            message : "Pls signup"
        })
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "try again later",
    });
  }
};
