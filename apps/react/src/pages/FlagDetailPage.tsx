import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import type { Country, FlagDetailResponse, Ratio } from "../types/flag";
import { fetchFlagDetail, fetchFlagSvg } from "../hooks/useFlags";
import { absolute, svgUrl } from "../hooks/useRaster";
import { useCopy } from "../hooks/useCopy";
import { extractFlagColors } from "../utils/flag-colors";
import { formatArea, formatNumber } from "../utils/format";
import { VariantPicker } from "../components/flag/VariantPicker";
import { QuickCommands } from "../components/flag/QuickCommands";
import { CodePanel } from "../components/flag/CodePanel";
import { ExportGrid } from "../components/flag/ExportGrid";
import { NotFoundPage } from "./NotFoundPage";

interface LiveInfo {
  timezone?: string;
  timezoneOffsetSeconds?: number | null;
  temperature?: number | null;
  weatherCode?: number | null;
}

export function FlagDetailPage() {
  const params = useParams();
  const cc = String(params.cc || "").toLowerCase();
  const { copyText } = useCopy();

  const [activeRatio, setActiveRatio] = useState<Ratio>("4x3");
  const [detail, setDetail] = useState<FlagDetailResponse | null>(null);
  const [svgBundle, setSvgBundle] = useState<{ svg1x1: string; svg4x3: string } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    document.body.classList.add("flag-detail-body");
    return () => document.body.classList.remove("flag-detail-body");
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setSvgBundle(null);
    setNotFound(false);
    window.scrollTo(0, 0);
    fetchFlagDetail(cc)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    fetchFlagSvg(cc)
      .then((s) => {
        if (!cancelled) setSvgBundle(s);
      })
      .catch(() => {
        /* SVG code tab stays empty */
      });
    return () => {
      cancelled = true;
    };
  }, [cc]);

  if (notFound) return <NotFoundPage />;
  if (!detail) {
    return (
      <div className="detail-page">
        <div className="detail-page__inner">
          <p style={{ color: "var(--text-muted)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <FlagDetail
      key={cc}
      cc={cc}
      detail={detail}
      svg1x1={svgBundle?.svg1x1 || ""}
      svg4x3={svgBundle?.svg4x3 || ""}
      activeRatio={activeRatio}
      setActiveRatio={setActiveRatio}
      copyText={copyText}
    />
  );
}

function FlagDetail({
  cc,
  detail,
  svg1x1,
  svg4x3,
  activeRatio,
  setActiveRatio,
  copyText,
}: {
  cc: string;
  detail: FlagDetailResponse;
  svg1x1: string;
  svg4x3: string;
  activeRatio: Ratio;
  setActiveRatio: (r: Ratio) => void;
  copyText: (text: string) => Promise<boolean>;
}) {
  const country = detail.country;
  const related = detail.related || [];
  const activeSvg = activeRatio === "1x1" ? svg1x1 : svg4x3;
  const flagColors = useMemo(() => extractFlagColors(activeSvg, 4), [activeSvg]);
  const bundleUrl = `/api/v1/flags/${encodeURIComponent(cc)}/download.zip`;

  const countryDescription = useMemo(() => {
    const parts = [`${country.name} is listed in the flagcdn.io flag library under code ${cc.toUpperCase()}.`];
    if (country.continent) parts.push(`It is grouped in ${country.continent}.`);
    if (country.capital) parts.push(`The capital is ${country.capital}.`);
    if (country.population !== undefined) parts.push(`Population estimate: ${formatNumber(country.population)}.`);
    if (country.area) parts.push(`Area: ${formatArea(country.area)}.`);
    return parts.join(" ");
  }, [country, cc]);

  const hasProfile = Boolean(country.population !== undefined || country.area || countryDescription);
  const hasLiveInfo = Boolean(country.latlng?.length || country.capital);

  const live = useLiveInfo(country, cc);

  const mapModel = useMemo(() => buildMapModel(country), [country]);

  async function copyCdn() {
    await copyText(absolute(svgUrl(activeRatio, cc)));
  }

  return (
    <div className="detail-page">
      <div className="detail-page__inner">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="detail-breadcrumb__link">
            <i className="fa-solid fa-house" aria-hidden="true" />
            <span className="detail-breadcrumb__home">Home</span>
          </Link>
          {country.continent && (
            <>
              <span className="detail-breadcrumb__sep">/</span>
              <Link to="/" className="detail-breadcrumb__link">
                {country.continent}
              </Link>
            </>
          )}
          <span className="detail-breadcrumb__sep">/</span>
          <span className="detail-breadcrumb__current">{country.name}</span>
        </nav>

        <div className="detail-page__grid">
          <aside className="detail-sidebar">
            <div className="detail-preview card squircle icon-preview-bg">
              <img
                src={svgUrl(activeRatio, cc)}
                alt={country.name}
                className={`detail-preview__img ${activeRatio === "1x1" ? "is-square" : "is-wide"}`}
              />
              <div className="detail-preview__code">{cc.toUpperCase()}</div>
              {flagColors.length > 0 && (
                <div className="detail-preview__colors" aria-label="Main flag colors">
                  {flagColors.map((color) => (
                    <span key={color} className="detail-preview__color" title={color}>
                      <span className="detail-preview__swatch" style={{ backgroundColor: color }} />
                      <span>{color}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="detail-meta card squircle">
              <div className="detail-meta__row">
                <span className="detail-meta__key">Ratios</span>
                <span className="detail-meta__val">2</span>
              </div>
              {country.continent && (
                <div className="detail-meta__row">
                  <span className="detail-meta__key">Region</span>
                  <span className="detail-meta__val">{country.continent}</span>
                </div>
              )}
              {country.capital && (
                <div className="detail-meta__row">
                  <span className="detail-meta__key">Capital</span>
                  <span className="detail-meta__val">{country.capital}</span>
                </div>
              )}
            </div>

            {country.continent && (
              <div className="detail-meta card squircle">
                <p className="detail-label">Categories</p>
                <div className="detail-pills">
                  <Link to="/" className="detail-pill">
                    {country.continent}
                  </Link>
                  {country.iso && <span className="detail-pill">ISO 3166</span>}
                </div>
              </div>
            )}

            {country.name_zh && (
              <div className="detail-meta card squircle">
                <p className="detail-label">Also known as</p>
                <p className="detail-meta__aliases">{country.name_zh}</p>
              </div>
            )}

            {hasLiveInfo && (
              <div className="detail-meta card squircle">
                <p className="detail-label">Local info</p>
                <div className="detail-live">
                  <div className="detail-live__item squircle">
                    <span className="detail-live__icon squircle">
                      <i className="fa-regular fa-clock" aria-hidden="true" />
                    </span>
                    <div className="detail-live__content">
                      <span className="detail-meta__key detail-live__title">
                        <span>Local time</span>
                        {live.timezoneOffsetLabel && <small>{live.timezoneOffsetLabel}</small>}
                      </span>
                      <span className="detail-live__value">
                        <strong className="detail-live__clock">
                          <span>{live.localTimeLabel}</span>
                          {live.localTimeSecondLabel && (
                            <>
                              <span className="detail-live__clock-sep">:</span>
                              <span className="detail-live__second" aria-label={live.localTimeSecondLabel}>
                                {live.localTimeSecondLabel.split("").map((digit, index) => (
                                  <span key={`${index}-${digit}`} className="detail-live__second-digit">
                                    {digit}
                                  </span>
                                ))}
                              </span>
                            </>
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                  {country.capital && (
                    <div className="detail-live__item squircle">
                      <span className="detail-live__icon squircle">
                        <i className={`fa-solid ${live.weatherIcon}`} aria-hidden="true" />
                      </span>
                      <div className="detail-live__content">
                        <span className="detail-meta__key">{country.capital}</span>
                        <span className="detail-live__value">
                          <strong>{live.weatherLabel}</strong>
                          {live.weatherSummary && <small>{live.weatherSummary}</small>}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasProfile && (
              <div className="detail-meta card squircle">
                <p className="detail-label">Country profile</p>
                <div className="detail-profile__stats">
                  {country.population !== undefined && (
                    <div className="detail-profile__stat squircle">
                      <span className="detail-meta__key">Population estimate</span>
                      <strong>{formatNumber(country.population)}</strong>
                    </div>
                  )}
                  {country.area ? (
                    <div className="detail-profile__stat squircle">
                      <span className="detail-meta__key">Area</span>
                      <strong>{formatArea(country.area)}</strong>
                    </div>
                  ) : null}
                </div>
                <p className="detail-profile__text">{countryDescription}</p>
              </div>
            )}

            {mapModel && (
              <div className="detail-meta card squircle">
                <div className="detail-label-row">
                  <p className="detail-label">Map</p>
                  <a
                    className="detail-map__credits"
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    © OpenStreetMap
                  </a>
                </div>
                <a
                  className="detail-map squircle"
                  href={mapModel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${country.name} map on OpenStreetMap`}
                >
                  <span className="detail-map__tiles" aria-hidden="true">
                    {mapModel.tiles.map((tile) => (
                      <img
                        key={`${tile.key}-light`}
                        className="detail-map__tile detail-map__tile--light"
                        src={tile.lightSrc}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {mapModel.tiles.map((tile) => (
                      <img
                        key={`${tile.key}-dark`}
                        className="detail-map__tile detail-map__tile--dark"
                        src={tile.darkSrc}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </span>
                  <span className="detail-map__marker" style={mapModel.markerStyle} aria-hidden="true" />
                </a>
              </div>
            )}
          </aside>

          <div className="detail-main">
            <div className="detail-header">
              <div>
                <h1 className="detail-header__title">{country.name}</h1>
                <p className="detail-header__slug">{cc}</p>
              </div>
              <div className="detail-header__actions">
                <a
                  href={svgUrl(activeRatio, cc)}
                  className="detail-btn squircle detail-btn--square detail-btn--primary"
                  download={`${cc}_${activeRatio}.svg`}
                  title="Download current SVG"
                  aria-label="Download current SVG"
                >
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </a>
                <a
                  href={bundleUrl}
                  className="detail-btn squircle detail-btn--square detail-btn--ghost"
                  download={`${cc}-flag-assets.zip`}
                  title="Download all formats and sizes"
                  aria-label="Download all formats and sizes"
                >
                  <i className="fa-solid fa-file-zipper" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  className="detail-btn squircle detail-btn--square detail-btn--ghost"
                  title="Copy current SVG CDN URL"
                  aria-label="Copy current SVG CDN URL"
                  onClick={copyCdn}
                >
                  <i className="fa-solid fa-link" aria-hidden="true" />
                </button>
              </div>
            </div>

            <VariantPicker cc={cc} value={activeRatio} onChange={setActiveRatio} />
            <QuickCommands cc={cc} ratio={activeRatio} />
            <CodePanel
              key={`${cc}-${activeRatio}`}
              cc={cc}
              name={country.name}
              ratio={activeRatio}
              svg1x1={svg1x1}
              svg4x3={svg4x3}
            />
            <ExportGrid key={`${cc}-${activeRatio}`} cc={cc} ratio={activeRatio} />

            <section className="detail-about card squircle">
              <h2 className="detail-about__title">{country.name} flag information</h2>
              <div className="detail-about__body">
                <p>
                  The {country.name} flag page provides optimized flag assets for websites, apps, documentation,
                  dashboards, and design systems. Use the SVG file for crisp vector rendering, or export PNG, WebP,
                  and AVIF images for fixed-size UI.
                </p>
                <p>
                  Code <span className="detail-inline-code">{cc.toUpperCase()}</span> is listed as{" "}
                  {country.iso ? "an ISO 3166-1 alpha-2 code" : "a non-ISO extension code"}.
                  {country.continent && <> The flag is grouped under {country.continent}.</>}
                  {country.capital && <> Capital: {country.capital}.</>}
                </p>
                <p>
                  CDN SVG URL: <span className="detail-inline-code block">{absolute(svgUrl(activeRatio, cc))}</span>
                </p>
                <p>
                  Available formats: SVG, PNG, WebP, and AVIF. Available ratios: 4:3 and 1:1. Raster exports are
                  available from 16px to 512px.
                </p>
              </div>
            </section>

            {related.length > 0 && country.continent && (
              <section className="detail-related">
                <div className="detail-related__head">
                  <p className="detail-label">Related in {country.continent}</p>
                  <Link to="/flags" className="detail-related__all">
                    View all
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                  </Link>
                </div>
                <div className="detail-related__grid">
                  {related.slice(0, 12).map((r) => (
                    <Link key={r.code} to={`/flag/${r.code}`} className="detail-related__item squircle">
                      <div className="detail-related__thumb squircle icon-preview-bg">
                        <img src={`/flags/1x1/${r.code}.svg`} alt={r.name} loading="lazy" />
                      </div>
                      <span className="detail-related__name">{r.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function useLiveInfo(country: Country, cc: string) {
  const [localTime, setLocalTime] = useState<Date | null>(null);
  const [timezoneLabel, setTimezoneLabel] = useState("");
  const [timezoneOffsetMinutes, setTimezoneOffsetMinutes] = useState<number | null>(null);
  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setLocalTime(new Date());
    timerRef.current = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const coords = country.latlng;
    if (coords && coords.length >= 2 && Number.isFinite(coords[1])) {
      const offset = Math.round((coords[1] / 15) * 2) * 30;
      setTimezoneOffsetMinutes(Math.max(-12 * 60, Math.min(14 * 60, offset)));
    }
  }, [country]);

  useEffect(() => {
    if (!country.latlng?.length && !country.capital) return;
    const coords = country.latlng;
    if (!coords || coords.length < 2) {
      setWeatherLoading(false);
      return;
    }
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(false);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current=temperature_2m,weather_code&timezone=auto`;
    fetch(url)
      .then((res) => res.json())
      .then((data: { timezone?: string; utc_offset_seconds?: number; current?: { temperature_2m?: number; weather_code?: number } }) => {
        if (cancelled) return;
        const live: LiveInfo = {
          timezone: data.timezone || "",
          timezoneOffsetSeconds: typeof data.utc_offset_seconds === "number" ? data.utc_offset_seconds : null,
          temperature: typeof data.current?.temperature_2m === "number" ? data.current.temperature_2m : null,
          weatherCode: typeof data.current?.weather_code === "number" ? data.current.weather_code : null,
        };
        if (live.timezone) setTimezoneLabel(live.timezone);
        if (typeof live.timezoneOffsetSeconds === "number") {
          setTimezoneOffsetMinutes(Math.round(live.timezoneOffsetSeconds / 60));
        }
        setWeatherTemp(live.temperature ?? null);
        setWeatherCode(live.weatherCode ?? null);
        setWeatherLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherError(true);
          setWeatherLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [country, cc]);

  function formatLocalTimeParts(timeZone: string, value: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    }).formatToParts(value);
    const hour = parts.find((part) => part.type === "hour")?.value || "00";
    const minute = parts.find((part) => part.type === "minute")?.value || "00";
    const second = parts.find((part) => part.type === "second")?.value || "00";
    return { time: `${hour}:${minute}`, second };
  }

  function formatLocalTimePartsFromOffset(offsetMinutes: number, value: Date) {
    const shifted = new Date(value.getTime() + offsetMinutes * 60_000);
    const hour = String(shifted.getUTCHours()).padStart(2, "0");
    const minute = String(shifted.getUTCMinutes()).padStart(2, "0");
    const second = String(shifted.getUTCSeconds()).padStart(2, "0");
    return { time: `${hour}:${minute}`, second };
  }

  function resolveLocalTimeParts(value: Date) {
    if (timezoneLabel) return formatLocalTimeParts(timezoneLabel, value);
    if (timezoneOffsetMinutes !== null) return formatLocalTimePartsFromOffset(timezoneOffsetMinutes, value);
    return null;
  }

  function getTimezoneOffsetMinutes(timeZone: string, value: Date) {
    const offsetPart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(value)
      .find((part) => part.type === "timeZoneName")?.value;
    if (!offsetPart) return null;
    const match = offsetPart.match(/^GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?$/);
    if (!match?.[1]) return 0;
    const hours = Number(match[2]);
    const minutes = Number(match[3] || 0);
    const direction = match[1] === "-" ? -1 : 1;
    return direction * (hours * 60 + minutes);
  }

  function resolveTimezoneOffsetMinutes(value: Date) {
    if (timezoneLabel) {
      const offset = getTimezoneOffsetMinutes(timezoneLabel, value);
      if (offset !== null) return offset;
    }
    if (typeof timezoneOffsetMinutes === "number") return timezoneOffsetMinutes;
    return null;
  }

  function formatOffsetLabel(offsetMinutes: number) {
    const sign = offsetMinutes < 0 ? "-" : "+";
    const abs = Math.abs(offsetMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = String(abs % 60).padStart(2, "0");
    return `UTC ${sign}${hours}:${minutes}`;
  }

  const localTimeLabel = !localTime ? "Loading" : resolveLocalTimeParts(localTime)?.time ?? "Unavailable";
  const localTimeSecondLabel = !localTime ? "" : resolveLocalTimeParts(localTime)?.second || "";
  const timezoneOffsetLabel = !localTime
    ? ""
    : (() => {
        const offset = resolveTimezoneOffsetMinutes(localTime);
        return offset === null ? "" : formatOffsetLabel(offset);
      })();
  const weatherLabel = weatherLoading
    ? "Loading"
    : weatherError || weatherTemp === null
      ? "Unavailable"
      : `${Math.round(weatherTemp)}°C`;
  const weatherSummary = weatherLoading
    ? "Fetching current conditions"
    : weatherError
      ? "Weather API unavailable"
      : weatherCode === null
        ? ""
        : weatherText(weatherCode);
  const weatherIcon = weatherCode === null ? "fa-cloud-sun" : weatherIconClass(weatherCode);

  return {
    localTimeLabel,
    localTimeSecondLabel,
    timezoneOffsetLabel,
    weatherLabel,
    weatherSummary,
    weatherIcon,
  };
}

function weatherText(code: number) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Current weather";
}

function weatherIconClass(code: number) {
  if (code === 0) return "fa-sun";
  if ([1, 2, 3].includes(code)) return "fa-cloud-sun";
  if ([45, 48].includes(code)) return "fa-smog";
  if ([51, 53, 55, 56, 57].includes(code)) return "fa-cloud-rain";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "fa-cloud-showers-heavy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "fa-snowflake";
  if ([95, 96, 99].includes(code)) return "fa-cloud-bolt";
  return "fa-cloud-sun";
}

function buildMapModel(country: Country) {
  const coords = country.latlng;
  if (!coords || coords.length < 2) return null;
  const [lat, lng] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const zoom =
    country.area && country.area < 1000
      ? 7
      : country.area && country.area < 25000
        ? 5
        : country.area && country.area < 200000
          ? 4
          : 3;
  const scale = 2 ** zoom;
  const tileX = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const tileY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  const startX = Math.floor(tileX) - 1;
  const startY = Math.max(0, Math.min(scale - 3, Math.floor(tileY) - 1));
  const tiles = [];

  for (let y = 0; y < 3; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      const wrappedX = (((startX + x) % scale) + scale) % scale;
      const tileRow = startY + y;
      tiles.push({
        key: `${zoom}-${wrappedX}-${tileRow}`,
        lightSrc: `https://tiles.mapcdn.io/${zoom}/${wrappedX}/${tileRow}.png`,
        darkSrc: `https://tiles.mapcdn.io/dark/${zoom}/${wrappedX}/${tileRow}.png`,
      });
    }
  }

  return {
    href: `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=${zoom}/${lat.toFixed(5)}/${lng.toFixed(5)}`,
    tiles,
    markerStyle: {
      left: `${Math.max(8, Math.min(92, ((tileX - startX) / 3) * 100))}%`,
      top: `${Math.max(8, Math.min(92, ((tileY - startY) / 3) * 100))}%`,
    },
  };
}
