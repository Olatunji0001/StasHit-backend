import saveDetails from "../mongodb/dataSchema.js";
import register from "../mongodb/newUserSchema.js";

export const editData = async (req, res) => {
  try {
    const token = req.user;
    const gmail = token.gmail;
    const { contactname, contact, relationship, notes, email } = req.body;
    const { id } = req.params;

    if (!(contactname && contact && relationship && id)) {
      return res.status(400).json({
        message: "Input all required fields",
      });
    }
    if ((contactname && contact && relationship && id) || notes || email) {
      const verify = await register.findOne({ gmail: gmail});
      if (verify) {
        const find = await saveDetails.findOne({ _id: id });
        if (!find) {
          return res.status(404).json({ message: "Data not found" });
        }
        if (find) {
          const edit = await saveDetails.updateOne(
            { _id: id },
            {
              $set: {
                contactname,
                contact,
                relationship,
                notes,
                email,
              },
            }
          );

          return res.status(200).json({
            message: "Updated successfully",
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Internal server error, try again later",
    });
  }
};
