// Clinic Constants
export const CLINIC_NAME = "Varshney Homeopathic Clinic";
export const PHARMACY_NAME = "Reliable Homeo Pharmacy";
export const ENTERPRISE_NAME = "Varshney Enterprises";
export const DOCTOR_NAME = "Dr. Aman Varshney";
export const PHONE = "+91 7388333991";
export const PHONE_RAW = "917388333991";
export const LOCATION = "Lbs Katra, Dharmsala Rd, LBS Katra Road, near ajay tea stall, Mughalsarai, Uttar Pradesh 232101";
export const LOCATION_SHORT = "Mughalsarai, Chandauli, UP";
export const NEAR_CITY = "Varanasi";
export const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.4!2d83.1187567!3d25.2822515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e3b558a6eb8ef%3A0x6c51d171c32eeee0!2sVarshney%20Homoeopathic%20Clinic%20%2C%20Mughalsarai%20%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

export const MAPS_SHARE_URL = "https://www.google.com/maps/place/Varshney+Homoeopathic+Clinic+,+Mughalsarai+,+Uttar+Pradesh/@25.2821391,83.1215845,16.99z/data=!4m6!3m5!1s0x398e3b558a6eb8ef:0x6c51d171c32eeee0!8m2!3d25.2822974!4d83.1211495!16s%2Fg%2F11x36q4wvz?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D";
export const MAPS_DIRECTIONS_URL = "https://www.google.com/maps/place/Varshney+Homoeopathic+Clinic+,+Mughalsarai+,+Uttar+Pradesh/@25.2821391,83.1215845,16.99z/data=!4m6!3m5!1s0x398e3b558a6eb8ef:0x6c51d171c32eeee0!8m2!3d25.2822974!4d83.1211495!16s%2Fg%2F11x36q4wvz?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D";

export const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Doctor, I want to book an appointment for homeopathic consultation."
);
export const WHATSAPP_LINK = `https://wa.me/${PHONE_RAW}?text=${WHATSAPP_MESSAGE}`;

export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "dramanvarshney@ybl";
export const CONSULTATION_FEE_ONLINE = "₹200";
export const CONSULTATION_FEE_OFFLINE = "₹150";

export const CLINIC_TIMINGS = [
  { day: "Monday – Saturday", time: "11:00 AM – 2:00 PM & 4:00 PM – 8:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export const DOCTOR_PHOTO = "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270551/vhc-site/Dr-Aman.jpg";

export const DOCTOR_QUALIFICATIONS = [
  {
    degree: "B.H.M.S",
    institution: "Bhopal",
    short: "Bachelor of Homeopathic Medicine & Surgery",
  },
  {
    degree: "Diploma in Thyroid Disorders & Diabetes Management",
    institution: "Yoga University, America",
    short: "Specialized in Thyroid & Diabetes",
  },
  {
    degree: "Diploma in Advanced Classical Homeopathy",
    institution: "Yoga University, America",
    short: "Advanced Classical Homeopathy",
  },
  {
    degree: "EMT – Advanced",
    institution: "National Skill Development Corporation",
    short: "Emergency Medical Technician",
  },
];

export const TREATMENT_CATEGORIES = [
  {
    id: "migraine",
    name: "Migraine",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    color: "from-purple-100 to-purple-50",
    borderColor: "border-purple-200",
    tagColor: "bg-purple-100 text-purple-700",
    description: "Chronic headaches treated gently with constitutional homeopathy",
    symptoms: ["Throbbing headache", "Nausea", "Light sensitivity", "Aura"],
  },
  {
    id: "hair-fall",
    name: "Hair Fall",
    icon: "💆",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80&auto=format&fit=crop",
    color: "from-amber-100 to-amber-50",
    borderColor: "border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
    description: "Restore hair growth naturally with deep-acting homeopathic remedies",
    symptoms: ["Excessive shedding", "Thinning hair", "Bald patches", "Weak roots"],
  },
  {
    id: "skin-allergy",
    name: "Skin Allergy",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80&auto=format&fit=crop",
    color: "from-green-100 to-green-50",
    borderColor: "border-green-200",
    tagColor: "bg-green-100 text-green-700",
    description: "Safe, side-effect-free treatment for all skin conditions",
    symptoms: ["Rashes", "Itching", "Redness", "Hives", "Eczema"],
  },
  {
    id: "acne-pimples",
    name: "Acne & Pimples",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80&auto=format&fit=crop",
    color: "from-pink-100 to-pink-50",
    borderColor: "border-pink-200",
    tagColor: "bg-pink-100 text-pink-700",
    description: "Clear skin with holistic treatment addressing root causes",
    symptoms: ["Acne breakouts", "Cysts", "Blackheads", "Oily skin"],
  },
  {
    id: "pcod-pcos",
    name: "PCOD / PCOS",
    icon: "🌸",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80&auto=format&fit=crop",
    color: "from-rose-100 to-rose-50",
    borderColor: "border-rose-200",
    tagColor: "bg-rose-100 text-rose-700",
    description: "Hormonal balance naturally restored for women's wellness",
    symptoms: ["Irregular periods", "Weight gain", "Hormonal imbalance", "Cysts"],
  },
  {
    id: "thyroid",
    name: "Thyroid Disorders",
    icon: "⚕️",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80&auto=format&fit=crop",
    color: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200",
    tagColor: "bg-blue-100 text-blue-700",
    description: "Regulate thyroid function with constitutional homeopathy",
    symptoms: ["Fatigue", "Weight changes", "Hair loss", "Mood swings"],
  },
  {
    id: "joint-pain",
    name: "Joint Pain",
    icon: "🦴",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    color: "from-orange-100 to-orange-50",
    borderColor: "border-orange-200",
    tagColor: "bg-orange-100 text-orange-700",
    description: "Arthritis and joint pain relief without harmful side effects",
    symptoms: ["Knee pain", "Back pain", "Stiffness", "Swelling"],
  },
  {
    id: "acidity-gas",
    name: "Acidity & Gas",
    icon: "🫁",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80&auto=format&fit=crop",
    color: "from-lime-100 to-lime-50",
    borderColor: "border-lime-200",
    tagColor: "bg-lime-100 text-lime-700",
    description: "Digestive wellness through gentle homeopathic treatment",
    symptoms: ["Heartburn", "Bloating", "Gas", "Indigestion"],
  },
  {
    id: "anxiety-stress",
    name: "Anxiety & Stress",
    icon: "🧘",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80&auto=format&fit=crop",
    color: "from-indigo-100 to-indigo-50",
    borderColor: "border-indigo-200",
    tagColor: "bg-indigo-100 text-indigo-700",
    description: "Mental peace and emotional healing through homeopathy",
    symptoms: ["Anxiety", "Panic attacks", "Insomnia", "Stress"],
  },
  {
    id: "child-health",
    name: "Child Health",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80&auto=format&fit=crop",
    color: "from-yellow-100 to-yellow-50",
    borderColor: "border-yellow-200",
    tagColor: "bg-yellow-100 text-yellow-700",
    description: "Safe, gentle homeopathy specially designed for children",
    symptoms: ["Recurrent colds", "Tonsils", "Bedwetting", "Poor appetite"],
  },
  {
    id: "seasonal-diseases",
    name: "Seasonal Diseases",
    icon: "🍂",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format&fit=crop",
    color: "from-teal-100 to-teal-50",
    borderColor: "border-teal-200",
    tagColor: "bg-teal-100 text-teal-700",
    description: "Build immunity and treat seasonal infections naturally",
    symptoms: ["Fever", "Flu", "Cold", "Dengue prevention"],
  },
  {
    id: "sinus-allergy",
    name: "Sinus & Allergy",
    icon: "🌬️",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80&auto=format&fit=crop",
    color: "from-cyan-100 to-cyan-50",
    borderColor: "border-cyan-200",
    tagColor: "bg-cyan-100 text-cyan-700",
    description: "Long-term relief from sinus and respiratory allergies",
    symptoms: ["Nasal congestion", "Sneezing", "Post-nasal drip", "Headache"],
  },
];

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Sunita Devi",
    location: "Mughalsarai",
    problem: "Migraine",
    rating: 5,
    text: "I suffered from severe migraines for 5 years. After 3 months of treatment with Dr. Aman, I am almost 90% better. His gentle medicines worked where everything else failed.",
    avatar: "S",
    date: "March 2024",
  },
  {
    id: "2",
    name: "Rakesh Kumar",
    location: "Chandauli",
    problem: "Joint Pain",
    rating: 5,
    text: "My knee pain was unbearable. The homeopathic treatment from Varshney Clinic gave me relief without any side effects. Very affordable too. Highly recommend.",
    avatar: "R",
    date: "January 2024",
  },
  {
    id: "3",
    name: "Priya Singh",
    location: "Varanasi",
    problem: "PCOD",
    rating: 5,
    text: "Dr. Aman's treatment for my PCOD has been life-changing. My periods are regular now, and I feel much healthier. He listens patiently and explains everything.",
    avatar: "P",
    date: "February 2024",
  },
  {
    id: "4",
    name: "Amit Yadav",
    location: "Mughal Sarai",
    problem: "Skin Allergy",
    rating: 5,
    text: "Chronic skin allergy for years, tried everything. Homeopathic treatment here cleared it completely in 4 months. Amazing results and very kind doctor.",
    avatar: "A",
    date: "April 2024",
  },
  {
    id: "5",
    name: "Meena Sharma",
    location: "Naugarh",
    problem: "Child Health",
    rating: 5,
    text: "My son had frequent tonsil infections. After homeopathic treatment from Dr. Varshney, he hasn't fallen sick in 8 months. Safe medicines, great results.",
    avatar: "M",
    date: "May 2024",
  },
  {
    id: "6",
    name: "Deepak Gupta",
    location: "Chandauli",
    problem: "Anxiety",
    rating: 5,
    text: "I was struggling with severe anxiety and sleep problems. Dr. Aman's homeopathic treatment helped me regain mental peace. Very understanding and professional.",
    avatar: "D",
    date: "June 2024",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Doctor" },
  { href: "/treatments", label: "Treatments" },
  { href: "/blog", label: "Health Blog" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
  { href: "/book", label: "Book Appointment" },
];

export const BLOG_CATEGORIES = [
  "All",
  "Skin Problems",
  "Hair Care",
  "Migraine",
  "Acidity",
  "Child Health",
  "Women's Health",
  "Seasonal Health",
  "Lifestyle Tips",
  "Homeopathy Education",
];

export const SAMPLE_BLOGS = [
  {
    id: "homeopathic-treatment-migraine",
    title: "Homeopathic Treatment for Migraine: A Complete Guide",
    slug: "homeopathic-treatment-migraine",
    category: "Migraine",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "Discover how homeopathy provides long-lasting relief from chronic migraines without side effects. Learn about the best homeopathic remedies and lifestyle changes.",
    readTime: "5 min read",
    date: "2024-05-15",
    tags: ["migraine", "headache", "homeopathy", "natural treatment"],
  },
  {
    id: "hair-fall-causes-homeopathy",
    title: "Hair Fall in Summer: Causes and Homeopathic Solutions",
    slug: "hair-fall-causes-homeopathy",
    category: "Hair Care",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "Excessive hair fall affects millions of Indians. Understand the root causes and how homeopathy addresses them holistically for permanent results.",
    readTime: "4 min read",
    date: "2024-05-10",
    tags: ["hair fall", "hair loss", "homeopathy", "natural remedies"],
  },
  {
    id: "best-homeopathic-clinic-mughalsarai",
    title: "Best Homeopathic Clinic in Mughalsarai – Varshney Clinic",
    slug: "best-homeopathic-clinic-mughalsarai",
    category: "Homeopathy Education",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "Looking for trusted homeopathic care in Mughalsarai or Chandauli? Learn about the expert care available at Varshney Homeopathic Clinic near Varanasi.",
    readTime: "3 min read",
    date: "2024-05-05",
    tags: ["mughalsarai", "chandauli", "homeopathic clinic", "dr aman varshney"],
  },
  {
    id: "pcod-symptoms-homeopathy",
    title: "PCOD Symptoms and Natural Homeopathic Treatment",
    slug: "pcod-symptoms-homeopathy",
    category: "Women's Health",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "PCOD affects 1 in 5 Indian women. Learn how homeopathy treats the root cause of PCOD through hormonal balance without harsh synthetic hormones.",
    readTime: "6 min read",
    date: "2024-04-28",
    tags: ["PCOD", "PCOS", "women health", "hormonal balance", "homeopathy"],
  },
  {
    id: "acidity-relief-tips",
    title: "Natural Acidity Relief Tips and Homeopathic Remedies",
    slug: "acidity-relief-tips",
    category: "Acidity",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "Chronic acidity disrupts daily life. Discover dietary changes, lifestyle tips, and powerful homeopathic remedies that provide lasting relief from acidity.",
    readTime: "4 min read",
    date: "2024-04-20",
    tags: ["acidity", "gas", "digestion", "homeopathy", "lifestyle"],
  },
  {
    id: "seasonal-viral-prevention",
    title: "How to Boost Immunity Before Monsoon Season",
    slug: "seasonal-viral-prevention",
    category: "Seasonal Health",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80&auto=format&fit=crop",
    excerpt:
      "Monsoon brings viral infections. Learn how homeopathic preventive care strengthens your immunity and keeps your family healthy during seasonal changes.",
    readTime: "4 min read",
    date: "2024-04-15",
    tags: ["immunity", "monsoon", "seasonal health", "prevention", "homeopathy"],
  },
];
