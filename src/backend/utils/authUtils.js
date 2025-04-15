import { Response } from "miragejs";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

export const requiresAuth = function (request) {
  const encodedToken = request.requestHeaders.authorization;

  const decodedToken = jwt_decode(
    encodedToken,
    process.env.JWT_SECRET
  );

  if (decodedToken) {
    const user = this.db.users.findBy({ email: decodedToken.email });
    if (user) {
      return user._id;
    }
  }

  return new Response(
    401,
    {},
    { errors: ["The token is invalid. Unauthorized access error."] }
  );
};

export const formatDate = () => dayjs().format("YYYY-MM-DD HH:mm:ssZ");


//thsis the new code
// import { Response } from "miragejs";
// import dayjs from "dayjs";
// import jwt_decode from "jwt-decode";

// export const formatDate = () => dayjs().format("YYYY-MM-DD HH:mm:ssZ");



// export const requiresAuth = function (request) {
//   try {
//     const encodedToken = request.requestHeaders.authorization;

//     if (!encodedToken || !encodedToken.startsWith("mock-token-")) {
//       console.error("🚨 Invalid token format:", encodedToken);
//       return null;
//     }

//     // Decode mock token to get email directly:
//     const email = atob(encodedToken.replace("mock-token-", ""));

//     if (email) {
//       const user = this.db.users.findBy({ email });
//       if (user) return user._id;
//     }

//     console.error("🚨 User not found for email:", email);
//     return null;
//   } catch (error) {
//     console.error("🧨 requiresAuth error:", error.message);
//     return null;
//   }
// };
