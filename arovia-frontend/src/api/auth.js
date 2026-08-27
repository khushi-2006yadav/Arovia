// Wraps the real backend endpoints exposed by UserController.
import { request, setToken, invalidateCache } from "./client";

/** POST /api/signup — matches SignupDto. No response body from backend today. */
export async function signup(signupDto) {
  await request("/api/signup", { method: "POST", body: signupDto, auth: false });
}

/** POST /api/signin — matches SigninDto -> UserResponseDto (includes jwt). */
export async function signin({ emailId, password }) {
  const data = await request("/api/signin", {
    method: "POST",
    body: { emailId, password },
    auth: false,
  });
  if (data?.jwt) setToken(data.jwt);
  invalidateCache();
  return data;
}

/** POST /api/oauth-signin — { token: googleIdToken } -> UserResponseDto */
export async function oauthSignin(googleIdToken) {
  const data = await request("/api/oauth-signin", {
    method: "POST",
    body: { token: googleIdToken },
    auth: false,
  });
  if (data?.jwt) setToken(data.jwt);
  invalidateCache();
  return data;
}

/** POST /api/oauth-signup — matches OAuthDto -> UserResponseDto */
export async function oauthSignup(oAuthDto) {
  const data = await request("/api/oauth-signup", {
    method: "POST",
    body: oAuthDto,
    auth: false,
  });
  if (data?.jwt) setToken(data.jwt);
  invalidateCache();
  return data;
}
