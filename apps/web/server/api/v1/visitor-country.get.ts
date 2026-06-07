import { visitorCountryFromHeaders } from "~/utils/visitor-country";

export default defineEventHandler((event) => {
  const cc = visitorCountryFromHeaders(getRequestHeaders(event));
  return { code: cc || null };
});
