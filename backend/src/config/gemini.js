import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import rideModel from "../models/rideModel.js";
import userModel from "../models/userModel.js";

function buildInstructions(userContext) {
  const identity = userContext?.email
    ? `User email on record: ${userContext.email}`
    : "User email is not available.";
  return `
your name is GoRides Ai .You are a helpful and technical Customer Support Agent for GoRides.
Your goal is to assist users with rides, payments, OTP, and account verification.
Use clear, concise, and friendly language.

CRITICAL RULE:
If a user claims they have an issue (like "payment failed", "ride not found", "OTP problem", or "account locked"),
you MUST use the "verify_issue_database" tool to check the real status before answering.
Do not guess. Trust the database result.

If the database says the issue is real, apologize and offer a solution.
If the database says the issue is not found, politely inform the user that our records don't show that error.
If details are missing (like rideId/bookingId), ask for them.

${identity}
`;
}

const tools = [
  {
    functionDeclarations: [
      {
        name: "verify_issue_database",
        description:
          "Checks the GoRides database to verify if a reported user issue or transaction is real.",
        parameters: {
          type: "OBJECT",
          properties: {
            userEmail: {
              type: "STRING",
              description: "The email address of the user reporting the issue.",
            },
            issueType: {
              type: "STRING",
              description:
                "Issue type (e.g., payment_issue, ride_not_found, otp_problem, account_verification, captain_delayed).",
            },
            rideId: {
              type: "STRING",
              description: "Ride id related to the issue, if available.",
            },
            bookingId: {
              type: "STRING",
              description: "Booking id related to the issue, if available.",
            },
          },
          required: ["userEmail", "issueType"],
        },
      },
    ],
  },
];

const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.3,
  maxOutputTokens: 8192,
};

function normalizeIssueType(value) {
  if (!value) return "general_issue";
  return value.toLowerCase().replace(/\s+/g, "_");
}

async function findUserByEmail(userEmail) {
  if (!userEmail) return null;
  return userModel.findOne({ emailid: userEmail }).lean();
}

async function findRideByBookingId(bookingId) {
  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return rideModel
    .findOne({ "bookings._id": bookingId })
    .populate("captainId")
    .lean();
}

async function findRideById(rideId) {
  if (!rideId || !mongoose.Types.ObjectId.isValid(rideId)) return null;
  return rideModel.findById(rideId).populate("captainId").lean();
}

function pickBooking(ride, bookingId, userId) {
  if (!ride || !ride.bookings) return null;
  if (bookingId) {
    return ride.bookings.find((b) => String(b._id) === String(bookingId));
  }
  if (userId) {
    const bookings = ride.bookings.filter(
      (b) => String(b.userId) === String(userId),
    );
    return bookings[bookings.length - 1] || null;
  }
  return null;
}

async function verifyIssueDatabase(args, fallbackEmail) {
  const issueType = normalizeIssueType(args.issueType);
  const userEmail = args.userEmail || fallbackEmail;

  const user = await findUserByEmail(userEmail);
  if (!user) {
    return {
      status: "success",
      db_result: {
        exists: false,
        issueType,
        code: "USER_NOT_FOUND",
        details: "No user record found for this email.",
      },
    };
  }

  const ride =
    (await findRideById(args.rideId)) ||
    (await findRideByBookingId(args.bookingId));
  const booking = pickBooking(ride, args.bookingId, user._id);

  if (issueType === "account_verification") {
    return {
      status: "success",
      db_result: {
        exists: !user.isEmailVerified,
        issueType,
        details: user.isEmailVerified
          ? "Account is already verified."
          : "Account verification is pending.",
      },
    };
  }

  if (issueType === "payment_issue" || issueType === "payment_failed") {
    if (!booking) {
      return {
        status: "success",
        db_result: {
          exists: false,
          issueType,
          details: "No booking found for this user to verify payment.",
        },
      };
    }
    const isProblem = booking.paymentStatus !== "paid";
    return {
      status: "success",
      db_result: {
        exists: isProblem,
        issueType,
        rideId: ride?._id,
        bookingId: booking?._id,
        details: isProblem
          ? "Payment is still pending for this booking."
          : "Payment is already marked as paid.",
      },
    };
  }

  if (issueType === "otp_problem") {
    if (!booking) {
      return {
        status: "success",
        db_result: {
          exists: false,
          issueType,
          details: "No booking found to verify OTP status.",
        },
      };
    }
    const isExpired =
      booking.otpExpires && new Date(booking.otpExpires) < new Date();
    const hasIssue = !booking.otp || isExpired;
    return {
      status: "success",
      db_result: {
        exists: hasIssue,
        issueType,
        rideId: ride?._id,
        bookingId: booking?._id,
        details: hasIssue
          ? "OTP is missing or expired."
          : "OTP is present and valid.",
      },
    };
  }

  if (issueType === "ride_not_found") {
    const rides = await rideModel.find({ "bookings.userId": user._id }).lean();
    const hasBookings = rides.length > 0;
    return {
      status: "success",
      db_result: {
        exists: !hasBookings,
        issueType,
        details: hasBookings
          ? "We found existing bookings for this account."
          : "No bookings found for this account.",
      },
    };
  }

  if (issueType === "captain_delayed") {
    if (!booking || !ride) {
      return {
        status: "success",
        db_result: {
          exists: false,
          issueType,
          details: "No booking found to verify captain status.",
        },
      };
    }
    const hasIssue =
      booking.status === "confirmed" && ride.status !== "completed";
    return {
      status: "success",
      db_result: {
        exists: hasIssue,
        issueType,
        rideId: ride?._id,
        bookingId: booking?._id,
        details: hasIssue
          ? "Ride is confirmed but not completed yet."
          : "Ride does not show a delay state.",
      },
    };
  }

  return {
    status: "success",
    db_result: {
      exists: false,
      issueType,
      details: "Issue type not recognized for verification.",
    },
  };
}

async function run(prompt, chatHistory, userContext = {}) {
  try {
    if (!userContext?.email) {
      return "Please log in to verify your account or view sensitive details.";
    }
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: buildInstructions(userContext),
      tools: tools,
    });

    const normalizedHistory = (chatHistory || [])
      .map((msg) => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
      .filter((msg) => msg.parts?.[0]?.text);

    while (
      normalizedHistory.length > 0 &&
      normalizedHistory[0].role !== "user"
    ) {
      normalizedHistory.shift();
    }

    const chatSession = model.startChat({
      generationConfig,
      history: normalizedHistory,
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;

    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const { name, args } = call;

      let apiResult = {
        status: "error",
        message: "Unknown function call",
      };
      if (name === "verify_issue_database") {
        apiResult = await verifyIssueDatabase(
          args,
          userContext?.email || args?.userEmail,
        );
      }

      const result2 = await chatSession.sendMessage([
        {
          functionResponse: {
            name: name,
            response: apiResult,
          },
        },
      ]);

      return result2.response.text();
    }

    const text = response.text();
    return text && text.trim().length > 0
      ? text
      : "Thanks for sharing. Our team will look into this issue and get back to you as soon as possible.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "We hit a problem while processing your request. Our team will look into this and get back to you as soon as possible.";
  }
}

export default run;
