import User from "../Models/user.js";
import { successHandler, errorHandler } from "../Utlis/ResponseHandler.js";

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findOne({ _id: userId }).select(
      "-__v -createdAt -updatedAt -personal_info.password -personal_info.otp -personal_info.otpExpiresAt"
    );
    if (!userData) {
      return errorHandler(res, 404, "User not found");
    }
    return successHandler(res, 200, "User retrieved successfully", userData, 1);
  } catch (error) {
    return errorHandler(res, 500, "Error retrieving user", error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select(
      "-__v -createdAt -updatedAt -personal_info.password -personal_info.otp -personal_info.otpExpiresAt"
    );
    if (users.length === 0) {
      return errorHandler(res, 404, "No users found");
    }
    return successHandler(
      res,
      200,
      "Users retrieved successfully",
      users,
      users.length
    );
  } catch (error) {
    return errorHandler(res, 500, "Error retrieving users", error.message);
  }
};

const update_personal = async (req, res) => {
  const userId = req.user.userId;
  try {
    const {
      first_name,
      last_name,
      father_name,
      dob,
      age,
      img_URL,
      whatsapp_no,
      alternative_no,
      address,
      city,
      country,
      enrolled_year,
      marj_e_taqleed,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !father_name ||
      !dob ||
      !age ||
      !img_URL ||
      !whatsapp_no ||
      !alternative_no ||
      !address ||
      !city ||
      !country
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (age > 19 || age < 9) {
      return errorHandler(res, 400, "Age is not according to our school");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          personal_info: {
            first_name,
            last_name,
            father_name,
            dob,
            age,
            img_URL,
            whatsapp_no,
            alternative_no,
            address,
            city,
            country,
            enrolled_year,
            marj_e_taqleed,
          },
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return errorHandler(res, 404, "User not found");
    }

    return successHandler(
      res,
      200,
      "User personal information updated successfully",
      updatedUser.personal_info,
      1
    );
  } catch (error) {
    return errorHandler(
      res,
      500,
      "Error updating user personal information",
      error.message
    );
  }
};

const update_academic_progress = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { academic_class, institute_name, inProgress, result } = req.body;

    if (!academic_class || !institute_name || inProgress === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          academic_progress: {
            academic_class,
            institute_name,
            inProgress,
            result,
          },
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return errorHandler(res, 404, "User not found");
    }

    return successHandler(
      res,
      200,
      "User academic progress updated successfully",
      updatedUser.academic_progress,
      1
    );
  } catch (error) {
    return errorHandler(
      res,
      500,
      "Error updating user academic progress",
      error.message
    );
  }
};

const update_class_history = async (req, res) => {};

export default {
  getUser,
  getAllUser,
  update_personal,
  update_academic_progress,
  update_class_history,
};
