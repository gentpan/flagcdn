const namedColors: Record<string, string> = {
  black: "#000000",
  blue: "#0000FF",
  green: "#008000",
  red: "#FF0000",
  white: "#FFFFFF",
  yellow: "#FFFF00",
};

export function extractFlagColors(svg: string, limit = 5) {
  if (!svg) return [];

  const counts = new Map<string, { count: number; firstSeen: number }>();
  const matches = svg.matchAll(/(?:fill|stroke|stop-color|flood-color)="([^"]+)"/gi);
  let order = 0;

  for (const match of matches) {
    const color = normalizeSvgColor(match[1]);
    if (!color) continue;
    const current = counts.get(color);
    if (current) {
      current.count += 1;
    } else {
      counts.set(color, { count: 1, firstSeen: order });
      order += 1;
    }
  }

  if (!counts.size) {
    for (const match of svg.matchAll(/#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi)) {
      const color = normalizeSvgColor(match[0]);
      if (!color) continue;
      const current = counts.get(color);
      if (current) current.count += 1;
      else counts.set(color, { count: 1, firstSeen: order++ });
    }
  }

  return [...counts.entries()]
    .sort((a, b) => {
      const orderDelta = a[1].firstSeen - b[1].firstSeen;
      return orderDelta || b[1].count - a[1].count;
    })
    .slice(0, limit)
    .map(([color]) => color);
}

function normalizeSvgColor(value: string) {
  const raw = value.trim().toLowerCase();
  if (!raw || raw === "none" || raw === "transparent" || raw === "currentcolor" || raw.startsWith("url(")) {
    return "";
  }

  const named = namedColors[raw];
  if (named) return named;

  const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)?.[1];
  if (!hex) return "";

  const withoutAlpha = hex.length === 4 || hex.length === 8 ? hex.slice(0, hex.length === 4 ? 3 : 6) : hex;
  const expanded = withoutAlpha.length === 3
    ? withoutAlpha.split("").map((char) => char + char).join("")
    : withoutAlpha;

  return `#${expanded.toUpperCase()}`;
}
