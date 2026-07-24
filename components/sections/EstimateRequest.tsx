"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";
import MagneticButton from "@/components/interaction/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  { id: "interior", label: "Interior Design" },
  { id: "3d", label: "3D Visualization & Rendering" },
  { id: "concept", label: "Concept & Mood Boards" },
  { id: "animation", label: "Animation & VR Experiences" },
];

// The capital city of each of Germany's 16 federal states ("Bundesländer").
// id must match the corresponding key in STATE_ID_MAP so that hovering a
// dot and hovering its state outline highlight the same feature.
// offsetX/offsetY (in the 590x730 SVG coordinate space) nudge a marker's
// on-screen position away from its true lon/lat — only used for capitals
// that sit almost on top of each other at this map scale (e.g. Wiesbaden
// and Mainz are ~9km apart) so their dots don't visually merge.
const LOCATIONS = [
  {
    id: "DE-BW",
    city: "Stuttgart",
    state: "Baden-Württemberg",
    lon: 9.1829,
    lat: 48.7758,
  },
  { id: "DE-BY", city: "Munich", state: "Bavaria", lon: 11.582, lat: 48.1351 },
  { id: "DE-BE", city: "Berlin", state: "Berlin", lon: 13.405, lat: 52.52 },
  {
    id: "DE-BB",
    city: "Potsdam",
    state: "Brandenburg",
    lon: 13.0645,
    lat: 52.3906,
  },
  { id: "DE-HB", city: "Bremen", state: "Bremen", lon: 8.8017, lat: 53.0793 },
  { id: "DE-HH", city: "Hamburg", state: "Hamburg", lon: 9.9937, lat: 53.5511 },
  {
    id: "DE-HE",
    city: "Wiesbaden",
    state: "Hesse",
    lon: 8.2473,
    lat: 50.0782,
    offsetX: 12,
    offsetY: -8,
  },
  {
    id: "DE-MV",
    city: "Schwerin",
    state: "Mecklenburg-Vorpommern",
    lon: 11.4132,
    lat: 53.6355,
  },
  {
    id: "DE-NI",
    city: "Hanover",
    state: "Lower Saxony",
    lon: 9.732,
    lat: 52.3759,
  },
  {
    id: "DE-NW",
    city: "Düsseldorf",
    state: "North Rhine-Westphalia",
    lon: 6.7735,
    lat: 51.2277,
  },
  {
    id: "DE-RP",
    city: "Mainz",
    state: "Rhineland-Palatinate",
    lon: 8.2473,
    lat: 49.9929,
    offsetX: -12,
    offsetY: 8,
  },
  {
    id: "DE-SL",
    city: "Saarbrücken",
    state: "Saarland",
    lon: 7.0066,
    lat: 49.2401,
  },
  { id: "DE-SN", city: "Dresden", state: "Saxony", lon: 13.7373, lat: 51.0504 },
  {
    id: "DE-ST",
    city: "Magdeburg",
    state: "Saxony-Anhalt",
    lon: 11.6276,
    lat: 52.1205,
  },
  {
    id: "DE-SH",
    city: "Kiel",
    state: "Schleswig-Holstein",
    lon: 10.1228,
    lat: 54.3233,
  },
  {
    id: "DE-TH",
    city: "Erfurt",
    state: "Thuringia",
    lon: 11.0299,
    lat: 50.9848,
  },
];

const STATE_ID_MAP: Record<string, string> = {
  "Baden-Württemberg": "DE-BW",
  Bayern: "DE-BY",
  Berlin: "DE-BE",
  Brandenburg: "DE-BB",
  Bremen: "DE-HB",
  Hamburg: "DE-HH",
  Hessen: "DE-HE",
  "Mecklenburg-Vorpommern": "DE-MV",
  Niedersachsen: "DE-NI",
  "Nordrhein-Westfalen": "DE-NW",
  "Rheinland-Pfalz": "DE-RP",
  Saarland: "DE-SL",
  Sachsen: "DE-SN",
  "Sachsen-Anhalt": "DE-ST",
  "Schleswig-Holstein": "DE-SH",
  Thüringen: "DE-TH",
};

const project = (
  lon: number,
  lat: number,
  width: number,
  height: number,
): [number, number] => {
  const latRad = (l: number) => (l * Math.PI) / 180;
  const lonRad = (l: number) => (l * Math.PI) / 180;
  const mercY = (l: number) => Math.log(Math.tan(Math.PI / 4 + latRad(l) / 2));

  const minLon = lonRad(5.866);
  const maxLon = lonRad(15.042);
  const minY = mercY(47.27);
  const maxY = mercY(55.059);

  const dx = maxLon - minLon;
  const dy = maxY - minY;

  const scale = Math.min(width / dx, height / dy) * 0.95;

  const cx = width / 2;
  const cy = height / 2;

  const centerLon = (minLon + maxLon) / 2;
  const centerLatY = (minY + maxY) / 2;

  const x = cx + (lonRad(lon) - centerLon) * scale;
  const y = cy - (mercY(lat) - centerLatY) * scale;

  return [x, y];
};

const generatePath = (feature: any, width: number, height: number): string => {
  if (!feature.geometry) return "";
  const { type, coordinates } = feature.geometry;
  const processPolygon = (polygon: number[][][]) => {
    return polygon
      .map((ring: number[][]) => {
        return (
          "M" +
          ring
            .map((coord: number[]) => {
              const [x, y] = project(coord[0], coord[1], width, height);
              return `${x},${y}`;
            })
            .join("L") +
          "Z"
        );
      })
      .join(" ");
  };
  if (type === "Polygon") return processPolygon(coordinates);
  if (type === "MultiPolygon")
    return coordinates
      .map((poly: number[][][]) => processPolygon(poly))
      .join(" ");
  return "";
};

export default function EstimateRequest() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const theme = useUIStore((s) => s.theme);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const [activeService, setActiveService] = useState<string>("interior");
  const [budget, setBudget] = useState<number>(50000);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json",
    )
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      reducedMotion ||
      !sectionRef.current ||
      !mapRef.current ||
      !formRef.current
    )
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, filter: "blur(10px)", scale: 0.95 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: mapRef.current, start: "top 75%" },
        },
      );

      const dots = gsap.utils.toArray(".map-dot");
      if (dots.length > 0) {
        gsap.fromTo(
          dots,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: mapRef.current, start: "top 60%" },
          },
        );
      }

      const formElements = gsap.utils.toArray(".form-animate");
      gsap.fromTo(
        formElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: formRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const isLight = theme === "light";

  const bgColor = isLight ? "bg-[#f4f3ef]" : "bg-[#0a0a0a]";
  const textColor = isLight ? "text-[#1a1a1a]" : "text-[#f4f3ef]";
  const mutedText = isLight ? "text-[#1a1a1a]/50" : "text-[#f4f3ef]/50";
  const borderColor = isLight ? "border-[#1a1a1a]/20" : "border-[#f4f3ef]/20";
  const focusBorder = isLight
    ? "focus:border-[#1a1a1a]"
    : "focus:border-[#f4f3ef]";

  const markerColor = "#c25e3a";

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden px-6 py-32 transition-colors duration-700 md:px-12 md:py-48 lg:px-24 ${bgColor}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] md:opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${isLight ? "#000" : "#fff"} 40px)`,
          }}
        />
        <div
          className={`absolute top-0 left-1/4 h-full w-1/3 -skew-x-12 blur-[100px] ${isLight ? "bg-white" : "bg-white/5"}`}
        />
        <div
          className={`absolute top-0 right-1/4 h-full w-1/3 skew-x-12 blur-[120px] ${isLight ? "bg-[#e3ddd3]" : "bg-white/5"}`}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
        <div
          className="flex flex-col justify-between lg:col-span-5"
          ref={mapRef}
        >
          <div className="mb-16">
            <h2
              className={`font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl ${textColor}`}
            >
              Perfect craft from <br />
              the heart of Germany
            </h2>
            <p
              className={`mt-6 max-w-md font-sans text-sm leading-relaxed md:text-base ${mutedText}`}
            >
              We work with artisans from specific German regions with
              time-tested techniques that have been refined over centuries,
              connecting modern luxury to a legacy of craft and tradition.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[450px] aspect-[4/5]">
            <svg
              viewBox="0 0 590 730"
              className="absolute inset-0 h-full w-full transition-all duration-700"
              style={{
                filter: isLight
                  ? "drop-shadow(0 20px 30px rgba(0,0,0,0.05))"
                  : "drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                stroke={isLight ? "#f4f3ef" : "#0a0a0a"}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {geoData &&
                  geoData.features.map((feature: any, idx: number) => {
                    const stateName =
                      feature.properties.NAME_1 ||
                      feature.properties.name ||
                      feature.properties.GEN;
                    const stateId = STATE_ID_MAP[stateName] || `DE-${idx}`;
                    const d = generatePath(feature, 590, 730);

                    const isHovered = hoveredState === stateId;

                    return (
                      <path
                        key={stateId}
                        id={stateId}
                        className="cursor-pointer transition-colors duration-500"
                        fill={
                          isHovered
                            ? isLight
                              ? "#d8cdb8"
                              : "#2b241c"
                            : isLight
                              ? "#e8e4db"
                              : "#1e1e1e"
                        }
                        d={d}
                        onMouseEnter={() => setHoveredState(stateId)}
                        onMouseLeave={() => setHoveredState(null)}
                      />
                    );
                  })}
              </g>
            </svg>

            {LOCATIONS.map((loc) => {
              const [x, y] = project(loc.lon, loc.lat, 590, 730);
              return (
                <div
                  key={loc.id}
                  onMouseEnter={() => setHoveredState(loc.id)}
                  onMouseLeave={() => setHoveredState(null)}
                  className="map-dot group absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    top: `${(y / 730) * 100}%`,
                    left: `${(x / 590) * 100}%`,
                  }}
                >
                  <div
                    className="absolute h-5 w-5 rounded-full border opacity-0 scale-100 transition-all duration-500 group-hover:scale-[2.2] group-hover:opacity-40"
                    style={{
                      borderColor: markerColor,
                      backgroundColor: `${markerColor}15`,
                    }}
                  />

                  <div
                    className="absolute h-4 w-4 rounded-full border transition-transform duration-500 ease-out group-hover:scale-125"
                    style={{
                      borderColor: markerColor,
                      backgroundColor: isLight ? "#f4f3ef" : "#0a0a0a",
                    }}
                  />

                  <div
                    className="relative h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor: markerColor,
                      boxShadow: isLight
                        ? "0 0 0 2px #f4f3ef"
                        : "0 0 0 2px #0a0a0a",
                    }}
                  />

                  <div
                    className={`pointer-events-none absolute bottom-full mb-3 z-20 flex flex-col items-center whitespace-nowrap rounded-md px-4 py-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100 ${isLight ? "bg-[#1a1a1a] text-[#f4f3ef]" : "bg-[#f4f3ef] text-[#1a1a1a]"}`}
                  >
                    <span
                      className="font-mono text-[8px] uppercase tracking-widest"
                      style={{ color: markerColor }}
                    >
                      State Capital
                    </span>
                    <span className="font-serif text-lg leading-tight">
                      {loc.city}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">
                      {loc.state}
                    </span>
                    <div
                      className={`absolute top-full h-2 w-2 -translate-y-1/2 rotate-45 ${isLight ? "bg-[#1a1a1a]" : "bg-[#f4f3ef]"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex flex-col justify-center lg:col-span-7 lg:pl-12"
          ref={formRef}
        >
          <div className="flex flex-col gap-12">
            <div className="form-animate">
              <label
                className={`mb-6 block font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}
              >
                01. Select Service
              </label>
              <div className="flex flex-wrap gap-4">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setActiveService(srv.id)}
                    className={`rounded-full border px-6 py-3 font-sans text-sm transition-all duration-300 ${
                      activeService === srv.id
                        ? `${isLight ? "bg-[#1a1a1a] text-[#f4f3ef] border-[#1a1a1a]" : "bg-[#f4f3ef] text-[#1a1a1a] border-[#f4f3ef]"}`
                        : `bg-transparent ${borderColor} ${textColor} hover:border-[var(--accent)]`
                    }`}
                  >
                    {srv.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-animate flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="w-full">
                <label
                  className={`mb-4 block font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}
                >
                  02. City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Berlin"
                  className={`w-full border-b bg-transparent py-4 font-serif text-3xl outline-none transition-colors duration-300 placeholder:opacity-20 ${borderColor} ${textColor} ${focusBorder}`}
                />
              </div>
              <div className="w-full">
                <label
                  className={`mb-4 block font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}
                >
                  03. Area (m²)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  className={`w-full border-b bg-transparent py-4 font-serif text-3xl outline-none transition-colors duration-300 placeholder:opacity-20 ${borderColor} ${textColor} ${focusBorder}`}
                />
              </div>
            </div>

            <div className="form-animate w-full">
              <div className="mb-6 flex items-end justify-between">
                <label
                  className={`block font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}
                >
                  04. Estimated Budget
                </label>
                <span className={`font-serif text-3xl ${textColor}`}>
                  € {budget.toLocaleString()}
                </span>
              </div>

              <div className="relative flex items-center h-8">
                <div className={`absolute w-full h-[1px] ${borderColor}`} />
                <div
                  className="absolute w-full h-[3px] border-y border-transparent"
                  style={{
                    borderTopColor: isLight
                      ? "rgba(0,0,0,0.1)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />

                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="absolute w-full cursor-pointer appearance-none bg-transparent outline-none z-10"
                  style={{ WebkitAppearance: "none" }}
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: ${markerColor};
                    cursor: pointer;
                    -webkit-appearance: none;
                    border: 4px solid ${isLight ? "#f4f3ef" : "#0a0a0a"};
                    box-shadow: 0 0 0 1px ${markerColor};
                    transition: transform 0.2s;
                  }
                  input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                  }
                `}</style>
              </div>
            </div>

            <div className="form-animate w-full">
              <label
                className={`mb-4 block font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}
              >
                05. Email Address
              </label>
              <input
                type="email"
                placeholder="hello@example.com"
                className={`w-full border-b bg-transparent py-4 font-serif text-3xl outline-none transition-colors duration-300 placeholder:opacity-20 ${borderColor} ${textColor} ${focusBorder}`}
              />
            </div>

            <div className="form-animate mt-8">
              <MagneticButton
                className={`group flex items-center gap-6 rounded-full px-10 py-5 font-mono text-xs uppercase tracking-widest transition-all ${
                  isLight
                    ? "bg-[#1a1a1a] text-[#f4f3ef]"
                    : "bg-[#f4f3ef] text-[#1a1a1a]"
                }`}
              >
                <span>Request Proposal</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  &rarr;
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
