import User from "../Models/user.js";
import { successHandler, errorHandler } from "../Utlis/ResponseHandler.js";

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findOne({ _id: userId }).select(
      "-__v -createdAt -updatedAt -personal_info.password -personal_info.otp -personal_info.otpExpiresAt -personal_info.isAdmin"
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
      "-__v -createdAt -updatedAt -personal_info.password -personal_info.otp -personal_info.otpExpiresAt -personal_info.isAdmin"
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

const update_user = async (req, res) => {
  const userId = req.user.userId;
  const { personal_info, academic_progress, guardian_info } = req.body;
  try {
    if (!personal_info || !academic_progress || !guardian_info) {
      return errorHandler(
        res,
        400,
        "Personal info and academic progress are required"
      );
    }

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
      halafnama,
      gender,
      CNIC,
    } = personal_info;

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
      !country ||
      !enrolled_year ||
      !marj_e_taqleed ||
      halafnama === undefined ||
      !gender ||
      !CNIC
    ) {
      return errorHandler(res, 400, "All personal info fields are required");
    }

    if (age > 19 || age < 9) {
      return errorHandler(res, 400, "Age is not according to our school");
    }

    const { academic_class, institute_name, inProgress, result } =
      academic_progress;
    if (!academic_class || !institute_name || inProgress === undefined) {
      return errorHandler(
        res,
        400,
        "All academic progress fields are required"
      );
    }

    if (
      !guardian_info.name ||
      !guardian_info.relationship ||
      !guardian_info.email ||
      !guardian_info.whatsapp_no ||
      !guardian_info.address ||
      !guardian_info.CNIC
    ) {
      return errorHandler(res, 400, "All guardian info fields are required");
    }

    // Build $set fields with dot-notation so we don't overwrite the entire nested objects
    const setFields = {
      "personal_info.first_name": first_name,
      "personal_info.last_name": last_name,
      "personal_info.father_name": father_name,
      "personal_info.dob": dob,
      "personal_info.age": age,
      "personal_info.img_URL": img_URL,
      "personal_info.whatsapp_no": whatsapp_no,
      "personal_info.alternative_no": alternative_no,
      "personal_info.address": address,
      "personal_info.city": city,
      "personal_info.country": country,
      "personal_info.enrolled_year": enrolled_year,
      "personal_info.marj_e_taqleed": marj_e_taqleed,
      "personal_info.halafnama": halafnama,
      "personal_info.gender": gender,
      "personal_info.CNIC": CNIC,
      "academic_progress.academic_class": academic_class,
      "academic_progress.institute_name": institute_name,
      "academic_progress.inProgress": inProgress,
      "academic_progress.result": result,
      "guardian_info.name": guardian_info.name,
      "guardian_info.relationship": guardian_info.relationship,
      "guardian_info.CNIC": guardian_info.email,
      "guardian_info.whatsapp_no": guardian_info.whatsapp_no,
      "guardian_info.address": guardian_info.address,
      "guardian_info.CNIC": guardian_info.CNIC,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: setFields },
      { new: true }
    );
    if (!updatedUser) {
      return errorHandler(res, 404, "User not found");
    }

    return successHandler(
      res,
      200,
      "User personal information updated successfully",
      { personal_info: updatedUser.personal_info, guardian_info: updatedUser.guardian_info, academic_progress: updatedUser.academic_progress },
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

const update_class_history = async (req, res) => {
  const { id } = req.params;
  const {
    class_name,
    year,
    status,
    session,
    result,
    repeat_count,
    isCompleted,
  } = req.body;

  try {
    if (
      !class_name ||
      !year ||
      !status ||
      !session ||
      isCompleted === undefined
    ) {
      return errorHandler(res, 400, "Missing required fields");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          class_history: {
            class_name,
            year,
            status,
            session,
            result,
            repeat_count,
            isCompleted,
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
      "User class history updated successfully",
      updatedUser.class_history,
      1
    );
  } catch (error) {
    return errorHandler(
      res,
      500,
      "Error updating user class history",
      error.message
    );
  }
};

export default {
  getUser,
  getAllUser,
  update_user,
  update_class_history,
};
