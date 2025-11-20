import saveDetails from "../mongodb/dataSchema.js";
import register from "../mongodb/newUserSchema.js";

export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.user;
    if (!id) {
      return res.status(400).json({
        message: "Data id is needed",
      });
    }
    if (id) {
      const email = token.gmail;
      const verify= await register.findOne({ gmail: email, verified: true });
      if (verify) {
        const deleteData = await saveDetails.deleteOne({ _id: id });
        return res.status(200).json({
          message: "deleted successfully",
        });
      }
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Internal server error, try again later",
    });
  }
};
