import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CLINIC_NAME, DOCTOR_NAME, LOCATION, PHONE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://varshneyhomoeopathy.com"),
  title: {
    default: `${CLINIC_NAME} | ${DOCTOR_NAME} - Mughalsarai, Chandauli`,
    template: `%s | ${CLINIC_NAME}`,
  },
  description:
    "Varshney Homeopathic Clinic in Mughalsarai, Chandauli, UP. Dr. Aman Varshney provides expert homeopathic treatment for migraine, skin, PCOD, joint pain, child health & more. Call +91 7388333991.",
  keywords: [
    "homeopathic doctor mughalsarai",
    "homeopathic clinic chandauli",
    "homeopathy near varanasi",
    "best homeopathic doctor UP",
    "dr aman varshney",
    "varshney homeopathic clinic",
    "homeopathy migraine treatment",
    "homeopathic treatment PCOD",
    "skin allergy homeopathy",
    "reliable homeo pharmacy",
    "homeopathic treatment chandauli",
    "homeopathy mughalsarai",
  ],
  authors: [{ name: DOCTOR_NAME }],
  creator: CLINIC_NAME,
  publisher: CLINIC_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://varshneyhomoeopathy.com",
    siteName: CLINIC_NAME,
    title: `${CLINIC_NAME} | ${DOCTOR_NAME}`,
    description:
      "Expert homeopathic care in Mughalsarai, Chandauli. Dr. Aman Varshney treats chronic and acute diseases naturally. Book your appointment today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: CLINIC_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC_NAME} | ${DOCTOR_NAME}`,
    description:
      "Expert homeopathic care in Mughalsarai, Chandauli, UP. Book appointment: +91 7388333991",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Add your Google Search Console verification code here when available
  // verification: {
  //   google: "your-actual-verification-code",
  // },
  alternates: {
    canonical: "https://varshneyhomoeopathy.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: CLINIC_NAME,
              alternateName: "Reliable Homeo Pharmacy",
              description:
                "Serving patients through family practice since 1992. Expert homeopathic clinic in Mughalsarai, Chandauli, UP providing safe and natural treatment for all diseases.",
              foundingDate: "1992",
              url: "https://varshneyhomoeopathy.com",
              telephone: PHONE,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Lbs Katra, Dharmsala Rd, LBS Katra Road, near ajay tea stall, Mughalsarai",
                addressLocality: "Chandauli",
                addressRegion: "Uttar Pradesh",
                postalCode: "232101",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 25.2822974,
                longitude: 83.1211495,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "11:00",
                  closes: "14:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "16:00",
                  closes: "20:00",
                },
              ],
              medicalSpecialty: "Homeopathy",
              hasMap: "https://www.google.com/maps/place/Varshney+Homoeopathic+Clinic+,+Mughalsarai+,+Uttar+Pradesh/@25.2821391,83.1215845,16.99z/data=!4m6!3m5!1s0x398e3b558a6eb8ef:0x6c51d171c32eeee0!8m2!3d25.2822974!4d83.1211495!16s%2Fg%2F11x36q4wvz?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D",
              employee: {
                "@type": "Physician",
                name: DOCTOR_NAME,
                medicalSpecialty: "Homeopathy",
                description:
                  "BHMS (Bhopal), Diploma in Thyroid Disorders & Diabetes Management (Yoga University, America), Diploma in Advanced Classical Homeopathy (Yoga University, America), EMT-Advanced (NSDC)",
                hasCredential: [
                  "B.H.M.S - Bhopal",
                  "Diploma in Thyroid Disorders & Diabetes Management - Yoga University, America",
                  "Diploma in Advanced Classical Homeopathy - Yoga University, America",
                  "EMT-Advanced - National Skill Development Corporation",
                ],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "500",
                bestRating: "5",
              },
              sameAs: [
                `https://wa.me/917388333991`,
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#166534",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              padding: "12px 16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              style: {
                border: "1px solid #fecaca",
                color: "#dc2626",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
