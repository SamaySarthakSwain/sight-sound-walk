import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // REC NIST Clean-Tech Design System Color Palette (Volumes 2, 3, 4)
        rec: {
          neutral: {
            obsidian: "#0A0D0B", // N01 - Velvety Carbon Micro-Tooth
            pitch: "#121613",    // N02 - Matte Carbon Tooth
            deepCarton: "#1A1E1B",// N03
            slate: "#2B312D",    // N04 - Dark Mineral Slate
            graphite: "#48504A", // N05
            heather: "#6E7770",  // N06
            platinum: "#9BA59E", // N07
            silkSilver: "#C4CEC6",// N08
            mist: "#E5EBE6",     // N09 - Ceramic Mist
            alabaster: "#F8FAF8",// N10 - Alabaster Pure White
            washi: "#F7F9F5",    // Artisanal Cold-Pressed Washi
          },
          teal: {
            abyssal: "#062325",  // T01
            ocean: "#0B383B",    // T02
            spruce: "#104E52",   // T03
            persian: "#00B496",  // T04 - Persian Jade Teal
            aegean: "#188A91",   // T05
            radiant: "#1DB2BA",  // T06
            surf: "#3BD0D8",     // T07
            polar: "#6CE2E8",    // T08
            glacier: "#A8F0F4",  // T09
            crystal: "#DDFAFE",  // T10
          },
          blue: {
            midnight: "#081226", // B01 - Midnight Velvet Tooth
            oxford: "#0C1E40",   // B02
            navy: "#102C5C",     // B03
            cobalt: "#1656AD",   // B04
            ultramarine: "#236BD6", // B05
            azure: "#3885F2",    // B06
            cornflower: "#5B9EF9", // B07
            sky: "#8BBCFC",      // B08
            horizon: "#B9D7FD",  // B09
            arctic: "#E4EFFE",   // B10
          },
          purple: {
            plum: "#1A0826",     // P01 - Void Plum
            imperial: "#2D0E40", // P02
            indigo: "#3C20A3",   // P03
            regal: "#54228A",    // P04
            amethyst: "#6D289E", // P05
            royal: "#800080",    // P06
            violet: "#9D3BF0",   // P07
            lavender: "#B86CF7", // P08
            wisteria: "#D5A4FA", // P09
            orchid: "#F1DCFE",   // P10
          },
          red: {
            burgundy: "#2B060E", // R01
            bordeaux: "#4A0A19", // R02
            oxblood: "#6E0F25",  // R03
            ruby: "#9C1535",     // R04
            crimson: "#FF0000",  // R05
            rose: "#EE0943",     // R06
            cherry: "#F42E5D",   // R07
            camellia: "#F76388", // R08
            peony: "#FA9EB6",    // R09
            rosewater: "#FDE2E8",// R10
          },
          amber: {
            espressoRust: "#381105", // O01
            burntUmber: "#591D09",   // O02
            terracotta: "#852E10",   // O03 - Spiced Terracotta
            sedona: "#B24317",       // O04 - Baked Adobe
            maple: "#D95C1E",        // O05 - Warm Maple
            tangelo: "#F47321",      // O06 - Vibrant Citrus Silk
            apricot: "#F7934B",      // O07
            marmalade: "#FAB176",    // O08
            peach: "#FDCFAB",        // O09
            linen: "#FEEEDF",        // O10 - Warm Sunlit Linen
          },
          gold: {
            bronze: "#362804",   // Y01
            umberGold: "#594307",// Y02
            brass: "#7D600B",    // Y03
            dijon: "#A6810E",    // Y04
            amberYellow: "#F0C807", // Y05
            marigold: "#F6D52B", // Y06
            sunflower: "#F8DF54",// Y07
            buttercup: "#FAE982",// Y08
            primrose: "#FDF3B4", // Y09
            champagne: "#FEFBE4",// Y10 - Champagne Silk
          },
          earth: {
            roastedEspresso: "#1E0E08", // M01
            walnut: "#2E160D",          // M02
            mocha: "#401E12",           // M03
            cocoa: "#542818",           // M04
            mahogany: "#6D3520",        // M05
            chestnut: "#87442B",        // M06
            hazelnut: "#A65839",        // M07
            sandstone: "#C47957",       // M08
            desert: "#DEA386",          // M09
            oat: "#F2D3C2",             // M10
          },
          green: {
            forest: "#0F2E19",   // G01
            hunter: "#0B381B",   // G02
            racing: "#0C4822",   // G03
            brand: "#0F5E24",    // G04 - Signature Brand Forest
            pine: "#186F32",     // G05
            emerald: "#228B40",  // G06
            lush: "#347C44",     // G07
            jade: "#4EA662",     // G08
            meadow: "#7BC28C",   // G09
            celadon: "#BCE2C6",  // G10
          },
          lime: {
            olive: "#25300E",    // L01
            lichen: "#3A4D13",   // L02
            highland: "#516C1A", // L03
            cyber: "#6D9122",    // L04
            solarMoss: "#88B528",// L05
            chartreuse: "#AEE454",// L06
            electric: "#C4F068", // L07
            neon: "#DAF882",     // L08
            wasabi: "#E9FBB5",   // L09
            dewdrop: "#F4FDE0",  // L10
          },
        },
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'glow': 'var(--shadow-glow)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--glow-primary) / 0.1)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--glow-primary) / 0.3)" },
        },
        "scroll-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap, 1rem)))" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        orbit: {
          "0%": {
            transform: "rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))",
          },
          "100%": {
            transform: "rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
        shine: {
          "0%": { "background-position": "0% 0%" },
          "50%": { "background-position": "100% 100%" },
          to: { "background-position": "0% 0%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "scroll-bounce": "scroll-bounce 2s ease-in-out infinite",
        marquee: "marquee var(--duration, 30s) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration, 30s) linear infinite",
        "border-beam": "border-beam calc(var(--duration, 6)*1s) infinite linear",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit calc(var(--duration, 20)*1s) linear infinite",
        "shimmer-slide": "shimmer-slide var(--speed, 3s) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed, 3s) * 2) infinite linear",
        ripple: "ripple var(--duration, 2s) ease calc(var(--i, 0)*.2s) infinite",
        shine: "shine var(--duration, 14s) infinite linear",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
