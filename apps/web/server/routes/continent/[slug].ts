import { continentFromSlug } from "../../../utils/continents";

export default defineEventHandler((event) => {
  const slug = String(getRouterParam(event, "slug") || "");

  if (!continentFromSlug(slug)) {
    throw createError({ statusCode: 404, statusMessage: "Continent not found" });
  }

  return sendRedirect(event, `/${slug}`, 301);
});
