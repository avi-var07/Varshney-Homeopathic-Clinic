/**
 * Questionnaire Engine — Varshney Homeopathic Clinic
 *
 * Structure:
 *   Organ/Category → Symptoms (pick one or more) → Follow-up questions (max 6-7, yes/no or short)
 *
 * Saved as a "complaints checklist" on the patient's profile.
 * Adding new organs/symptoms never requires changing any UI code — only this file.
 */

export interface FollowUpQuestion {
  id: string;
  text: string;
  type: "yesno" | "choice" | "text";
  options?: string[]; // for "choice" type
}

export interface Symptom {
  id: string;
  label: string;
  followUp: FollowUpQuestion[]; // max 6–7
}

export interface OrganCategory {
  id: string;
  label: string;
  icon: string;
  symptoms: Symptom[];
}

export type ComplaintAnswers = Record<string, string>; // questionId → answer

export interface PatientComplaint {
  organ: string;        // organ category label
  symptom: string;      // chosen symptom label
  answers: ComplaintAnswers;
  submittedAt: string;
}

// ─── Organ Categories & Symptoms ─────────────────────────────────────────────

export const ORGAN_CATEGORIES: OrganCategory[] = [
  // ── 1. Stomach & Digestion ─────────────────────────────────────────────────
  {
    id: "stomach",
    label: "Stomach & Digestion",
    icon: "🫁",
    symptoms: [
      {
        id: "stomach-ache",
        label: "Stomach Ache / Pain",
        followUp: [
          { id: "q1", text: "Is the pain frequent or only at a particular time?", type: "choice", options: ["Frequent (multiple times a day)", "After meals", "Empty stomach / morning", "At night", "Occasional"] },
          { id: "q2", text: "How long have you had this pain?", type: "choice", options: ["Less than 1 week", "1–4 weeks", "1–3 months", "More than 3 months"] },
          { id: "q3", text: "Is the pain sharp/burning or dull/crampy?", type: "choice", options: ["Sharp / burning", "Dull ache", "Crampy / spasms", "Mixed"] },
          { id: "q4", text: "Do you have acidity, gas, or bloating along with it?", type: "yesno" },
          { id: "q5", text: "Does eating make it better or worse?", type: "choice", options: ["Better after eating", "Worse after eating", "No effect"] },
          { id: "q6", text: "Have you taken any medicines for this before?", type: "yesno" },
        ],
      },
      {
        id: "acidity-heartburn",
        label: "Acidity / Heartburn",
        followUp: [
          { id: "q1", text: "How often do you get acidity?", type: "choice", options: ["Daily", "Few times a week", "Occasionally"] },
          { id: "q2", text: "Do you have sour belching or burning in the chest?", type: "yesno" },
          { id: "q3", text: "Does it get worse after spicy or oily food?", type: "yesno" },
          { id: "q4", text: "Do you take antacids or PPI (omeprazole etc.)?", type: "yesno" },
          { id: "q5", text: "Do you have nausea or vomiting?", type: "yesno" },
        ],
      },
      {
        id: "constipation",
        label: "Constipation",
        followUp: [
          { id: "q1", text: "How many days between bowel movements?", type: "choice", options: ["Every 2 days", "Every 3–4 days", "Less than once a week"] },
          { id: "q2", text: "Is the stool hard and dry?", type: "yesno" },
          { id: "q3", text: "Do you feel incomplete evacuation after passing stool?", type: "yesno" },
          { id: "q4", text: "Do you drink enough water (8+ glasses per day)?", type: "yesno" },
          { id: "q5", text: "How long have you had this problem?", type: "choice", options: ["Less than 1 month", "1–3 months", "More than 3 months"] },
        ],
      },
      {
        id: "loose-stools",
        label: "Loose Stools / Diarrhoea",
        followUp: [
          { id: "q1", text: "How many times per day?", type: "choice", options: ["2–3 times", "4–6 times", "More than 6 times"] },
          { id: "q2", text: "Is there blood or mucus in the stool?", type: "yesno" },
          { id: "q3", text: "Do you have stomach cramps with it?", type: "yesno" },
          { id: "q4", text: "How long has this been going on?", type: "choice", options: ["1–2 days", "3–7 days", "More than 1 week"] },
          { id: "q5", text: "Do you have fever along with it?", type: "yesno" },
        ],
      },
      {
        id: "piles-fissure",
        label: "Piles / Fissure / Hemorrhoids",
        followUp: [
          { id: "q1", text: "Do you have bleeding during or after passing stool?", type: "yesno" },
          { id: "q2", text: "Is there pain while passing stool?", type: "choice", options: ["Severe pain", "Mild discomfort", "No pain but bleeding"] },
          { id: "q3", text: "Do you feel a lump or swelling near the anus?", type: "yesno" },
          { id: "q4", text: "Do you have constipation?", type: "yesno" },
          { id: "q5", text: "How long have you had this?", type: "choice", options: ["Less than 1 month", "1–6 months", "More than 6 months"] },
          { id: "q6", text: "Have you consulted a doctor before for this?", type: "yesno" },
        ],
      },
      {
        id: "nausea-vomiting",
        label: "Nausea / Vomiting",
        followUp: [
          { id: "q1", text: "When does the nausea occur?", type: "choice", options: ["Morning only", "After meals", "Throughout the day", "During travel"] },
          { id: "q2", text: "Is there actual vomiting or only nausea?", type: "choice", options: ["Only nausea", "Occasional vomiting", "Frequent vomiting"] },
          { id: "q3", text: "Are you pregnant or could you be?", type: "choice", options: ["Yes", "No", "Not applicable"] },
          { id: "q4", text: "Do you have stomach pain along with it?", type: "yesno" },
          { id: "q5", text: "How long has this been happening?", type: "choice", options: ["1–2 days", "More than a week", "Recurring problem"] },
        ],
      },
    ],
  },

  // ── 2. Head & Brain ────────────────────────────────────────────────────────
  {
    id: "head",
    label: "Head & Brain",
    icon: "🧠",
    symptoms: [
      {
        id: "headache",
        label: "Headache",
        followUp: [
          { id: "q1", text: "Where is the pain mainly?", type: "choice", options: ["One side", "Both sides", "Forehead", "Back of head", "Top of head"] },
          { id: "q2", text: "How often do you get headaches?", type: "choice", options: ["Daily", "A few times a week", "Monthly", "Rarely"] },
          { id: "q3", text: "Is it throbbing / pulsating type?", type: "yesno" },
          { id: "q4", text: "Do you get nausea or vomiting with it?", type: "yesno" },
          { id: "q5", text: "Does light or noise make it worse?", type: "yesno" },
          { id: "q6", text: "Does stress or lack of sleep trigger it?", type: "yesno" },
        ],
      },
      {
        id: "migraine",
        label: "Migraine",
        followUp: [
          { id: "q1", text: "How often do you get migraine attacks?", type: "choice", options: ["Daily", "Few times a week", "Few times a month", "Rarely"] },
          { id: "q2", text: "Do you see flashing lights or aura before the attack?", type: "yesno" },
          { id: "q3", text: "Does it affect one side or both sides of the head?", type: "choice", options: ["Left side", "Right side", "Alternating sides", "Both sides"] },
          { id: "q4", text: "How long does each attack last?", type: "choice", options: ["Few hours", "Half a day", "1–2 days", "More than 2 days"] },
          { id: "q5", text: "Are you currently taking any migraine medicine?", type: "yesno" },
          { id: "q6", text: "Does it get triggered by specific foods, weather, or stress?", type: "yesno" },
        ],
      },
      {
        id: "dizziness",
        label: "Dizziness / Vertigo",
        followUp: [
          { id: "q1", text: "Does the room feel like it's spinning?", type: "yesno" },
          { id: "q2", text: "Does it happen when you stand up suddenly?", type: "yesno" },
          { id: "q3", text: "How long does each episode last?", type: "choice", options: ["A few seconds", "A few minutes", "More than 30 minutes"] },
          { id: "q4", text: "Do you have any hearing problems or ringing in ears?", type: "yesno" },
          { id: "q5", text: "Have you had a recent ear infection or cold?", type: "yesno" },
        ],
      },
      {
        id: "memory-concentration",
        label: "Memory / Concentration Issues",
        followUp: [
          { id: "q1", text: "Do you forget things more than usual?", type: "yesno" },
          { id: "q2", text: "Is it hard to concentrate on work or studies?", type: "yesno" },
          { id: "q3", text: "How long has this been happening?", type: "choice", options: ["Few weeks", "Few months", "More than a year"] },
          { id: "q4", text: "Do you feel mentally foggy or confused?", type: "yesno" },
          { id: "q5", text: "Do you have sleep problems?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 3. Skin ────────────────────────────────────────────────────────────────
  {
    id: "skin",
    label: "Skin",
    icon: "🌿",
    symptoms: [
      {
        id: "rash-itching",
        label: "Rash / Itching",
        followUp: [
          { id: "q1", text: "Is the itching constant or at specific times?", type: "choice", options: ["Constant", "At night mainly", "After sweating", "In cold weather", "After eating certain foods"] },
          { id: "q2", text: "Is there redness, swelling, or blisters?", type: "yesno" },
          { id: "q3", text: "Is it spreading to new areas?", type: "yesno" },
          { id: "q4", text: "How long have you had this?", type: "choice", options: ["Less than 1 week", "1–4 weeks", "1–3 months", "More than 3 months"] },
          { id: "q5", text: "Have you changed soap, detergent or cosmetics recently?", type: "yesno" },
          { id: "q6", text: "Do you have any known allergies (food/medicines)?", type: "yesno" },
        ],
      },
      {
        id: "acne",
        label: "Acne / Pimples",
        followUp: [
          { id: "q1", text: "Where mainly — face, back, or chest?", type: "choice", options: ["Face only", "Face + back", "Back / chest", "All over"] },
          { id: "q2", text: "Are they painful or just cosmetic?", type: "choice", options: ["Painful / deep cysts", "Mild whiteheads/blackheads", "Both"] },
          { id: "q3", text: "Do they worsen around your periods (for females)?", type: "yesno" },
          { id: "q4", text: "Is your skin oily?", type: "yesno" },
          { id: "q5", text: "Have you tried any creams or medicines before?", type: "yesno" },
        ],
      },
      {
        id: "hair-fall",
        label: "Hair Fall",
        followUp: [
          { id: "q1", text: "How much hair falls daily (approx)?", type: "choice", options: ["50–100 strands (mild)", "100–200 strands", "Handfuls (severe)"] },
          { id: "q2", text: "Is hair falling from all over or in patches?", type: "choice", options: ["All over", "Patchy bald spots", "Only from forehead/crown"] },
          { id: "q3", text: "Did it start suddenly or gradually?", type: "choice", options: ["Suddenly within weeks", "Gradually over months"] },
          { id: "q4", text: "Do you have dandruff or itchy scalp?", type: "yesno" },
          { id: "q5", text: "Have you had a major illness, surgery or stress recently?", type: "yesno" },
          { id: "q6", text: "Any family history of baldness?", type: "yesno" },
        ],
      },
      {
        id: "eczema-psoriasis",
        label: "Eczema / Psoriasis",
        followUp: [
          { id: "q1", text: "Which areas are affected?", type: "choice", options: ["Elbows / knees", "Scalp", "Hands / feet", "Face", "All over body"] },
          { id: "q2", text: "Is the skin dry, scaly, or cracked?", type: "yesno" },
          { id: "q3", text: "Does it itch or burn?", type: "choice", options: ["Severe itching", "Mild itching", "Burning sensation", "No discomfort"] },
          { id: "q4", text: "Does it get worse in any season?", type: "choice", options: ["Winter (dry weather)", "Summer (sweat)", "Monsoon", "No pattern"] },
          { id: "q5", text: "Have you been diagnosed by a dermatologist?", type: "yesno" },
          { id: "q6", text: "Any family history of eczema, psoriasis or asthma?", type: "yesno" },
        ],
      },
      {
        id: "fungal-infection",
        label: "Fungal Infection / Ringworm",
        followUp: [
          { id: "q1", text: "Where is the infection?", type: "choice", options: ["Groin area", "Feet / toes", "Nails", "Scalp", "Other body parts"] },
          { id: "q2", text: "Is it circular or ring-shaped?", type: "yesno" },
          { id: "q3", text: "Does it itch more in heat or after sweating?", type: "yesno" },
          { id: "q4", text: "How long have you had this?", type: "choice", options: ["Less than 2 weeks", "2–4 weeks", "More than 1 month", "Recurring problem"] },
          { id: "q5", text: "Have you used anti-fungal cream before?", type: "yesno" },
        ],
      },
      {
        id: "vitiligo-pigment",
        label: "White Patches / Vitiligo / Pigmentation",
        followUp: [
          { id: "q1", text: "Are the patches white (depigmented) or dark?", type: "choice", options: ["White patches", "Dark patches / hyperpigmentation", "Both"] },
          { id: "q2", text: "Where are the patches?", type: "choice", options: ["Face", "Hands / feet", "Body", "Around lips / eyes", "Multiple areas"] },
          { id: "q3", text: "Are they increasing in size or number?", type: "yesno" },
          { id: "q4", text: "How long have you noticed them?", type: "choice", options: ["Less than 3 months", "3–12 months", "More than 1 year"] },
          { id: "q5", text: "Any family history of vitiligo?", type: "yesno" },
        ],
      },
      {
        id: "warts-moles",
        label: "Warts / Moles / Skin Growth",
        followUp: [
          { id: "q1", text: "Where is the growth?", type: "choice", options: ["Face", "Hands / fingers", "Feet / soles", "Genital area", "Other body part"] },
          { id: "q2", text: "How many do you have?", type: "choice", options: ["Single", "2–5", "More than 5", "Spreading rapidly"] },
          { id: "q3", text: "Is it painful or just cosmetic concern?", type: "choice", options: ["Painful / itchy", "Cosmetic concern only", "Both"] },
          { id: "q4", text: "How long have you had them?", type: "choice", options: ["Less than 1 month", "1–6 months", "More than 6 months"] },
          { id: "q5", text: "Have you tried any treatment before?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 4. Eyes ─────────────────────────────────────────────────────────────────
  {
    id: "eyes",
    label: "Eyes",
    icon: "👁️",
    symptoms: [
      {
        id: "eye-pain-strain",
        label: "Eye Pain / Strain",
        followUp: [
          { id: "q1", text: "Do you work on computer/phone for long hours?", type: "yesno" },
          { id: "q2", text: "Is the pain in one eye or both?", type: "choice", options: ["Left eye", "Right eye", "Both eyes"] },
          { id: "q3", text: "Do you have headache along with eye pain?", type: "yesno" },
          { id: "q4", text: "Is your vision blurry or foggy?", type: "yesno" },
          { id: "q5", text: "Do you wear glasses/lenses?", type: "yesno" },
          { id: "q6", text: "When was your last eye check-up?", type: "choice", options: ["Within 6 months", "6–12 months ago", "More than 1 year ago", "Never"] },
        ],
      },
      {
        id: "eye-redness-watering",
        label: "Red / Watering / Itchy Eyes",
        followUp: [
          { id: "q1", text: "Is there redness in the eye?", type: "yesno" },
          { id: "q2", text: "Are your eyes watering excessively?", type: "yesno" },
          { id: "q3", text: "Is there a sticky discharge or crusting?", type: "yesno" },
          { id: "q4", text: "Do your eyes itch?", type: "yesno" },
          { id: "q5", text: "Do you have any allergies (dust, pollen)?", type: "yesno" },
          { id: "q6", text: "How long has this been happening?", type: "choice", options: ["1–3 days", "1 week", "More than 2 weeks", "Recurring problem"] },
        ],
      },
      {
        id: "weak-eyesight",
        label: "Weak Eyesight / Vision Problems",
        followUp: [
          { id: "q1", text: "Is the problem with near vision, distance, or both?", type: "choice", options: ["Near vision (reading)", "Distance vision", "Both"] },
          { id: "q2", text: "Has your power been increasing?", type: "yesno" },
          { id: "q3", text: "Do you see floaters or dark spots?", type: "yesno" },
          { id: "q4", text: "Do you have difficulty seeing at night?", type: "yesno" },
          { id: "q5", text: "Any family history of eye diseases (glaucoma, cataract)?", type: "yesno" },
        ],
      },
      {
        id: "dark-circles",
        label: "Dark Circles",
        followUp: [
          { id: "q1", text: "How long have you had dark circles?", type: "choice", options: ["Recently (few weeks)", "Few months", "Since childhood/years"] },
          { id: "q2", text: "Do you get enough sleep (7+ hours)?", type: "yesno" },
          { id: "q3", text: "Is your screen time high (5+ hours/day)?", type: "yesno" },
          { id: "q4", text: "Do you have iron deficiency or anemia?", type: "choice", options: ["Yes, diagnosed", "Not tested", "No"] },
          { id: "q5", text: "Any family history of dark circles?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 5. Ears ─────────────────────────────────────────────────────────────────
  {
    id: "ears",
    label: "Ears",
    icon: "👂",
    symptoms: [
      {
        id: "ear-pain",
        label: "Ear Pain / Infection",
        followUp: [
          { id: "q1", text: "Which ear is affected?", type: "choice", options: ["Left ear", "Right ear", "Both ears"] },
          { id: "q2", text: "Is there any discharge from the ear?", type: "yesno" },
          { id: "q3", text: "Do you have fever along with ear pain?", type: "yesno" },
          { id: "q4", text: "Has hearing reduced in the affected ear?", type: "yesno" },
          { id: "q5", text: "Did this start after a cold or swimming?", type: "yesno" },
          { id: "q6", text: "How long have you had the pain?", type: "choice", options: ["1–2 days", "3–7 days", "More than 1 week", "Recurring"] },
        ],
      },
      {
        id: "tinnitus",
        label: "Ringing in Ears (Tinnitus)",
        followUp: [
          { id: "q1", text: "Is the ringing in one ear or both?", type: "choice", options: ["Left ear", "Right ear", "Both ears"] },
          { id: "q2", text: "Is it constant or comes and goes?", type: "choice", options: ["Constant", "Comes and goes", "Only at night/quiet"] },
          { id: "q3", text: "How long have you had this?", type: "choice", options: ["Less than 1 week", "1–4 weeks", "Months", "Years"] },
          { id: "q4", text: "Are you exposed to loud noise regularly?", type: "yesno" },
          { id: "q5", text: "Do you have hearing loss?", type: "yesno" },
        ],
      },
      {
        id: "hearing-loss",
        label: "Hearing Loss",
        followUp: [
          { id: "q1", text: "Is it in one ear or both?", type: "choice", options: ["Left ear", "Right ear", "Both"] },
          { id: "q2", text: "Did it happen suddenly or gradually?", type: "choice", options: ["Suddenly", "Gradually over months/years"] },
          { id: "q3", text: "Do you have difficulty hearing in noisy places?", type: "yesno" },
          { id: "q4", text: "Have you had an audiometry (hearing test) done?", type: "yesno" },
          { id: "q5", text: "Any family history of hearing problems?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 6. Joints & Muscles ────────────────────────────────────────────────────
  {
    id: "joints",
    label: "Joints & Muscles",
    icon: "🦴",
    symptoms: [
      {
        id: "joint-pain",
        label: "Joint Pain",
        followUp: [
          { id: "q1", text: "Which joint is mainly affected?", type: "choice", options: ["Knee", "Hip", "Ankle/foot", "Wrist/hand", "Shoulder", "Back/spine", "Multiple joints"] },
          { id: "q2", text: "Is there swelling or redness at the joint?", type: "yesno" },
          { id: "q3", text: "Is it worse in the morning (stiffness)?", type: "yesno" },
          { id: "q4", text: "How long have you had this?", type: "choice", options: ["Less than 1 month", "1–6 months", "More than 6 months"] },
          { id: "q5", text: "Do you have any history of injury to that joint?", type: "yesno" },
          { id: "q6", text: "Has your uric acid been checked (gout)?", type: "choice", options: ["Yes, it is high", "Yes, it is normal", "Not checked"] },
        ],
      },
      {
        id: "back-pain",
        label: "Back Pain",
        followUp: [
          { id: "q1", text: "Where exactly is the pain?", type: "choice", options: ["Lower back", "Upper back", "Neck", "Entire spine"] },
          { id: "q2", text: "Does the pain travel down to legs or arms?", type: "yesno" },
          { id: "q3", text: "Is it worse on standing or sitting for long?", type: "choice", options: ["Worse on standing", "Worse on sitting", "Both", "Constant"] },
          { id: "q4", text: "Did it start after a fall or injury?", type: "yesno" },
          { id: "q5", text: "Have you had an X-ray or MRI done?", type: "yesno" },
        ],
      },
      {
        id: "knee-pain",
        label: "Knee Pain",
        followUp: [
          { id: "q1", text: "Which knee is affected?", type: "choice", options: ["Left knee", "Right knee", "Both knees"] },
          { id: "q2", text: "Does it hurt when climbing stairs?", type: "yesno" },
          { id: "q3", text: "Is there clicking or locking of the knee?", type: "yesno" },
          { id: "q4", text: "Is there swelling?", type: "yesno" },
          { id: "q5", text: "How long have you had this?", type: "choice", options: ["Less than 1 month", "1–6 months", "More than 6 months", "More than 1 year"] },
          { id: "q6", text: "Have you been told you have arthritis?", type: "yesno" },
        ],
      },
      {
        id: "neck-pain",
        label: "Neck Pain / Cervical",
        followUp: [
          { id: "q1", text: "Is the pain on one side or both sides?", type: "choice", options: ["Left side", "Right side", "Both sides", "Center/back of neck"] },
          { id: "q2", text: "Does the pain go to your shoulder or arm?", type: "yesno" },
          { id: "q3", text: "Do you feel numbness or tingling in hands?", type: "yesno" },
          { id: "q4", text: "Do you use phone/laptop for long hours?", type: "yesno" },
          { id: "q5", text: "Have you been diagnosed with cervical spondylosis?", type: "yesno" },
        ],
      },
      {
        id: "muscle-cramps",
        label: "Muscle Cramps / Body Pain",
        followUp: [
          { id: "q1", text: "Which muscles cramp most often?", type: "choice", options: ["Calf / legs", "Thighs", "Arms", "Full body ache"] },
          { id: "q2", text: "Do cramps happen at night?", type: "yesno" },
          { id: "q3", text: "Do you exercise or do heavy physical work?", type: "yesno" },
          { id: "q4", text: "Do you take enough water and minerals?", type: "yesno" },
          { id: "q5", text: "Have you had calcium or vitamin D checked?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 7. Respiratory / Chest & Breathing ─────────────────────────────────────
  {
    id: "respiratory",
    label: "Chest & Breathing",
    icon: "🌬️",
    symptoms: [
      {
        id: "cough",
        label: "Cough",
        followUp: [
          { id: "q1", text: "Is it a dry cough or with phlegm?", type: "choice", options: ["Dry cough", "Wet cough with phlegm", "Both at different times"] },
          { id: "q2", text: "How long have you had this cough?", type: "choice", options: ["Less than 1 week", "1–3 weeks", "More than 3 weeks"] },
          { id: "q3", text: "Is it worse at night?", type: "yesno" },
          { id: "q4", text: "Is there any fever?", type: "yesno" },
          { id: "q5", text: "Do you have asthma or allergies?", type: "yesno" },
        ],
      },
      {
        id: "breathlessness",
        label: "Breathlessness / Wheezing",
        followUp: [
          { id: "q1", text: "When do you feel breathless?", type: "choice", options: ["At rest", "On exertion/walking", "At night", "All the time"] },
          { id: "q2", text: "Is there a wheezing sound when breathing?", type: "yesno" },
          { id: "q3", text: "Do you have a history of asthma?", type: "yesno" },
          { id: "q4", text: "Does cold weather or dust trigger it?", type: "yesno" },
          { id: "q5", text: "Have you had an X-ray or spirometry done?", type: "yesno" },
        ],
      },
      {
        id: "sinus-allergy",
        label: "Sinus / Nasal Allergy",
        followUp: [
          { id: "q1", text: "Do you have a blocked or stuffy nose?", type: "yesno" },
          { id: "q2", text: "Do you sneeze frequently in the morning or with dust?", type: "yesno" },
          { id: "q3", text: "Do you have a runny nose (watery or thick)?", type: "choice", options: ["Clear/watery", "Thick/yellow-green", "Both"] },
          { id: "q4", text: "Do you get headache or pressure around eyes/forehead?", type: "yesno" },
          { id: "q5", text: "How long has this been a problem?", type: "choice", options: ["Few days (recent cold)", "Weeks", "Months / seasonal", "Years (chronic)"] },
          { id: "q6", text: "Have you been diagnosed with sinusitis?", type: "yesno" },
        ],
      },
      {
        id: "chest-pain",
        label: "Chest Pain / Tightness",
        followUp: [
          { id: "q1", text: "Where in the chest do you feel pain?", type: "choice", options: ["Left side", "Right side", "Center", "All over"] },
          { id: "q2", text: "Does it worsen with breathing or movement?", type: "yesno" },
          { id: "q3", text: "Do you feel palpitations (heart racing)?", type: "yesno" },
          { id: "q4", text: "Is the pain sharp or dull/pressure-like?", type: "choice", options: ["Sharp / stabbing", "Dull / pressure", "Burning", "Mixed"] },
          { id: "q5", text: "Do you have any heart condition or BP problem?", type: "yesno" },
          { id: "q6", text: "Have you had an ECG or heart check-up?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 8. Heart & Blood Pressure ──────────────────────────────────────────────
  {
    id: "heart",
    label: "Heart & Blood Pressure",
    icon: "❤️",
    symptoms: [
      {
        id: "high-bp",
        label: "High Blood Pressure (Hypertension)",
        followUp: [
          { id: "q1", text: "What is your usual BP reading?", type: "choice", options: ["130–140/85–90 (mild)", "140–160/90–100 (moderate)", "Above 160/100 (severe)", "Don't know"] },
          { id: "q2", text: "Are you on BP medication?", type: "yesno" },
          { id: "q3", text: "Do you have headaches, dizziness, or blurred vision?", type: "yesno" },
          { id: "q4", text: "Do you consume salt heavily?", type: "yesno" },
          { id: "q5", text: "Any family history of heart disease or hypertension?", type: "yesno" },
        ],
      },
      {
        id: "low-bp",
        label: "Low Blood Pressure (Hypotension)",
        followUp: [
          { id: "q1", text: "Do you feel dizzy when standing up?", type: "yesno" },
          { id: "q2", text: "Do you feel fatigued or weak often?", type: "yesno" },
          { id: "q3", text: "Have you fainted or blacked out?", type: "yesno" },
          { id: "q4", text: "Do you drink enough fluids?", type: "yesno" },
          { id: "q5", text: "What is your usual BP reading?", type: "choice", options: ["Below 90/60", "90–100/60–70", "Don't know"] },
        ],
      },
      {
        id: "palpitations",
        label: "Palpitations / Fast Heartbeat",
        followUp: [
          { id: "q1", text: "Do you feel your heart racing or pounding?", type: "yesno" },
          { id: "q2", text: "Does it happen at rest or after activity?", type: "choice", options: ["At rest", "After activity", "Both", "Random"] },
          { id: "q3", text: "Do you feel anxious or panicky during episodes?", type: "yesno" },
          { id: "q4", text: "How long does each episode last?", type: "choice", options: ["Few seconds", "Few minutes", "More than 30 minutes"] },
          { id: "q5", text: "Have you had an ECG done?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 9. Urinary & Kidney ────────────────────────────────────────────────────
  {
    id: "urinary",
    label: "Urinary & Kidney",
    icon: "💧",
    symptoms: [
      {
        id: "burning-urination",
        label: "Burning / Painful Urination (UTI)",
        followUp: [
          { id: "q1", text: "Do you feel burning while passing urine?", type: "yesno" },
          { id: "q2", text: "How often are you urinating?", type: "choice", options: ["Normal (6–8 times/day)", "Very frequently (10+ times)", "At night repeatedly"] },
          { id: "q3", text: "Is there blood in the urine?", type: "yesno" },
          { id: "q4", text: "Do you have fever or lower back pain?", type: "yesno" },
          { id: "q5", text: "How long has this been happening?", type: "choice", options: ["1–3 days", "1 week", "More than 2 weeks", "Recurring problem"] },
          { id: "q6", text: "Are you drinking enough water?", type: "yesno" },
        ],
      },
      {
        id: "frequent-urination",
        label: "Frequent Urination",
        followUp: [
          { id: "q1", text: "How many times do you urinate in a day?", type: "choice", options: ["8–10 times", "10–15 times", "More than 15 times"] },
          { id: "q2", text: "Do you wake up at night to urinate?", type: "choice", options: ["No", "1–2 times", "3+ times"] },
          { id: "q3", text: "Is there urgency (can't hold it)?", type: "yesno" },
          { id: "q4", text: "Have you been tested for diabetes?", type: "yesno" },
          { id: "q5", text: "Do you have increased thirst?", type: "yesno" },
        ],
      },
      {
        id: "kidney-stone",
        label: "Kidney Stone / Flank Pain",
        followUp: [
          { id: "q1", text: "Where is the pain?", type: "choice", options: ["Left side back/flank", "Right side back/flank", "Lower abdomen", "Both sides"] },
          { id: "q2", text: "Is the pain severe and comes in waves?", type: "yesno" },
          { id: "q3", text: "Have you noticed blood in urine?", type: "yesno" },
          { id: "q4", text: "Have you had an ultrasound done?", type: "yesno" },
          { id: "q5", text: "Have you had kidney stones before?", type: "yesno" },
          { id: "q6", text: "Do you drink enough water (3+ liters/day)?", type: "yesno" },
        ],
      },
      {
        id: "prostate",
        label: "Prostate Issues (Men)",
        followUp: [
          { id: "q1", text: "Do you have difficulty starting urination?", type: "yesno" },
          { id: "q2", text: "Is the urine stream weak or interrupted?", type: "yesno" },
          { id: "q3", text: "Do you feel the bladder is not fully emptied?", type: "yesno" },
          { id: "q4", text: "Do you wake up at night to urinate?", type: "choice", options: ["1–2 times", "3+ times", "No"] },
          { id: "q5", text: "Have you had a PSA test or prostate exam?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 10. Liver & Gallbladder ────────────────────────────────────────────────
  {
    id: "liver",
    label: "Liver & Gallbladder",
    icon: "🫀",
    symptoms: [
      {
        id: "fatty-liver",
        label: "Fatty Liver",
        followUp: [
          { id: "q1", text: "Has fatty liver been diagnosed via ultrasound?", type: "yesno" },
          { id: "q2", text: "What grade of fatty liver?", type: "choice", options: ["Grade 1 (mild)", "Grade 2 (moderate)", "Grade 3 (severe)", "Don't know"] },
          { id: "q3", text: "Do you consume alcohol?", type: "choice", options: ["Never", "Occasionally", "Regularly"] },
          { id: "q4", text: "Are you overweight?", type: "yesno" },
          { id: "q5", text: "Have your liver enzymes (SGOT/SGPT) been checked?", type: "yesno" },
        ],
      },
      {
        id: "jaundice",
        label: "Jaundice / Yellow Eyes",
        followUp: [
          { id: "q1", text: "Do your eyes or skin appear yellow?", type: "yesno" },
          { id: "q2", text: "Is your urine dark yellow or brown?", type: "yesno" },
          { id: "q3", text: "Do you have nausea, loss of appetite, or fatigue?", type: "yesno" },
          { id: "q4", text: "Have you had blood tests (bilirubin, liver function)?", type: "yesno" },
          { id: "q5", text: "Have you been diagnosed with hepatitis?", type: "yesno" },
        ],
      },
      {
        id: "gallstone",
        label: "Gallbladder Stone / Pain",
        followUp: [
          { id: "q1", text: "Do you get pain in the upper right abdomen?", type: "yesno" },
          { id: "q2", text: "Does the pain come after eating fatty food?", type: "yesno" },
          { id: "q3", text: "Have gallstones been confirmed by ultrasound?", type: "yesno" },
          { id: "q4", text: "What is the size of the stone?", type: "choice", options: ["Small (under 5mm)", "Medium (5–15mm)", "Large (15mm+)", "Multiple small stones", "Don't know"] },
          { id: "q5", text: "Has surgery been recommended?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 11. Mental & Emotional ─────────────────────────────────────────────────
  {
    id: "mental",
    label: "Mind & Emotions",
    icon: "🧘",
    symptoms: [
      {
        id: "anxiety",
        label: "Anxiety / Stress",
        followUp: [
          { id: "q1", text: "Do you feel anxious most days?", type: "yesno" },
          { id: "q2", text: "Do you get panic attacks (racing heart, difficulty breathing)?", type: "yesno" },
          { id: "q3", text: "How is your sleep?", type: "choice", options: ["Normal", "Takes long to sleep", "Wake up at night", "Very poor"] },
          { id: "q4", text: "Is this related to a specific situation (work/family)?", type: "yesno" },
          { id: "q5", text: "Do you have physical symptoms like headache or stomach upset due to stress?", type: "yesno" },
        ],
      },
      {
        id: "depression",
        label: "Low Mood / Depression",
        followUp: [
          { id: "q1", text: "Do you feel sad or empty most of the day?", type: "yesno" },
          { id: "q2", text: "Have you lost interest in things you used to enjoy?", type: "yesno" },
          { id: "q3", text: "Do you feel tired even without doing much?", type: "yesno" },
          { id: "q4", text: "Has your appetite changed (eating more or less)?", type: "choice", options: ["Eating much less", "Eating much more", "No change"] },
          { id: "q5", text: "How long have you been feeling this way?", type: "choice", options: ["Few days", "Few weeks", "Months", "More than 6 months"] },
          { id: "q6", text: "Are you on any medication for this?", type: "yesno" },
        ],
      },
      {
        id: "sleep-problem",
        label: "Sleep Problems / Insomnia",
        followUp: [
          { id: "q1", text: "What is your main issue?", type: "choice", options: ["Can't fall asleep", "Wake up at night", "Wake up too early", "Oversleeping / always tired"] },
          { id: "q2", text: "How many hours do you sleep on average?", type: "choice", options: ["Less than 4 hours", "4–5 hours", "5–6 hours", "More than 8 hours"] },
          { id: "q3", text: "Is your mind very active/racing when you try to sleep?", type: "yesno" },
          { id: "q4", text: "Do you use phone/screen before sleeping?", type: "yesno" },
          { id: "q5", text: "Are you on any sleeping medicines?", type: "yesno" },
        ],
      },
      {
        id: "anger-irritability",
        label: "Anger / Irritability",
        followUp: [
          { id: "q1", text: "Do you get angry over small things?", type: "yesno" },
          { id: "q2", text: "Do you feel like you can't control your temper?", type: "yesno" },
          { id: "q3", text: "Is it affecting your relationships or work?", type: "yesno" },
          { id: "q4", text: "Do you feel restless or on edge?", type: "yesno" },
          { id: "q5", text: "Has this been a recent change or lifelong pattern?", type: "choice", options: ["Recent (weeks/months)", "Since childhood", "Getting worse over time"] },
        ],
      },
    ],
  },

  // ── 12. Women's Health ─────────────────────────────────────────────────────
  {
    id: "womens",
    label: "Women's Health",
    icon: "🌸",
    symptoms: [
      {
        id: "irregular-periods",
        label: "Irregular Periods",
        followUp: [
          { id: "q1", text: "How irregular are your periods?", type: "choice", options: ["Late by 1–2 weeks", "Skip months entirely", "Come too frequently (less than 21 days)", "Very unpredictable"] },
          { id: "q2", text: "Is the flow heavy, light, or normal?", type: "choice", options: ["Very heavy", "Very light/scanty", "Normal but irregular timing"] },
          { id: "q3", text: "Do you have severe cramps (dysmenorrhea)?", type: "yesno" },
          { id: "q4", text: "Have you been diagnosed with PCOD/PCOS?", type: "yesno" },
          { id: "q5", text: "Have you had hormonal blood tests done?", type: "yesno" },
        ],
      },
      {
        id: "pcod-pcos",
        label: "PCOD / PCOS",
        followUp: [
          { id: "q1", text: "When were you diagnosed with PCOD?", type: "choice", options: ["Recently", "1–3 years ago", "More than 3 years ago", "Not officially diagnosed but suspect"] },
          { id: "q2", text: "Do you have irregular periods?", type: "yesno" },
          { id: "q3", text: "Do you have acne or excess facial hair?", type: "yesno" },
          { id: "q4", text: "Have you gained weight recently?", type: "yesno" },
          { id: "q5", text: "Are you on any hormonal medication?", type: "yesno" },
          { id: "q6", text: "Are you trying to conceive?", type: "yesno" },
        ],
      },
      {
        id: "white-discharge",
        label: "White / Abnormal Discharge",
        followUp: [
          { id: "q1", text: "What colour is the discharge?", type: "choice", options: ["White/milky (normal looking)", "Yellow/green", "Brown", "Clear/watery"] },
          { id: "q2", text: "Is there an unpleasant smell?", type: "yesno" },
          { id: "q3", text: "Is there itching or burning sensation?", type: "yesno" },
          { id: "q4", text: "How long have you had this?", type: "choice", options: ["Less than 1 week", "1–4 weeks", "More than 1 month"] },
          { id: "q5", text: "Does it increase around periods?", type: "yesno" },
        ],
      },
      {
        id: "menopause",
        label: "Menopause Symptoms",
        followUp: [
          { id: "q1", text: "Have your periods stopped completely?", type: "choice", options: ["Yes, stopped", "Becoming irregular/infrequent", "Very heavy/unpredictable"] },
          { id: "q2", text: "Do you have hot flashes?", type: "yesno" },
          { id: "q3", text: "Do you have mood swings or irritability?", type: "yesno" },
          { id: "q4", text: "Do you have trouble sleeping?", type: "yesno" },
          { id: "q5", text: "Do you have joint pain or dryness?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 13. Children's Health ──────────────────────────────────────────────────
  {
    id: "child",
    label: "Child's Health",
    icon: "👶",
    symptoms: [
      {
        id: "child-fever",
        label: "Fever (Child)",
        followUp: [
          { id: "q1", text: "What is the highest temperature noted?", type: "choice", options: ["Below 100°F (mild)", "100–102°F", "102–104°F", "Above 104°F"] },
          { id: "q2", text: "How many days has the fever been there?", type: "choice", options: ["1 day", "2–3 days", "4–7 days", "More than 1 week"] },
          { id: "q3", text: "Does the child have any cold, cough, or sore throat?", type: "yesno" },
          { id: "q4", text: "Is the child eating and drinking normally?", type: "yesno" },
          { id: "q5", text: "Has any medicine been given already?", type: "yesno" },
        ],
      },
      {
        id: "child-recurrent-cold",
        label: "Frequent Cold / Tonsils",
        followUp: [
          { id: "q1", text: "How often does the child fall sick?", type: "choice", options: ["Almost every month", "Every 2–3 months", "3–4 times a year"] },
          { id: "q2", text: "Does the child have enlarged tonsils?", type: "yesno" },
          { id: "q3", text: "Does the child snore at night?", type: "yesno" },
          { id: "q4", text: "Has adenoid or tonsil removal been suggested by a doctor?", type: "yesno" },
          { id: "q5", text: "Are vaccinations up to date?", type: "yesno" },
        ],
      },
      {
        id: "child-bedwetting",
        label: "Bedwetting (Enuresis)",
        followUp: [
          { id: "q1", text: "How old is the child?", type: "choice", options: ["3–5 years", "5–7 years", "7–10 years", "Above 10 years"] },
          { id: "q2", text: "How often does bedwetting happen?", type: "choice", options: ["Every night", "3–5 times a week", "Occasionally (1–2/week)"] },
          { id: "q3", text: "Does the child wet during daytime too?", type: "yesno" },
          { id: "q4", text: "Is there a family history of bedwetting?", type: "yesno" },
          { id: "q5", text: "Is the child under any emotional stress (school/home)?", type: "yesno" },
        ],
      },
      {
        id: "child-poor-appetite",
        label: "Poor Appetite / Picky Eating",
        followUp: [
          { id: "q1", text: "Does the child refuse meals regularly?", type: "yesno" },
          { id: "q2", text: "Is the child underweight for their age?", type: "yesno" },
          { id: "q3", text: "Does the child eat junk food but refuses home food?", type: "yesno" },
          { id: "q4", text: "Does the child have worms (deworming done)?", type: "choice", options: ["Yes, dewormed recently", "Not dewormed in 6+ months", "Don't know"] },
          { id: "q5", text: "Is the child generally active and playful?", type: "yesno" },
        ],
      },
      {
        id: "child-growth",
        label: "Slow Growth / Delayed Milestones",
        followUp: [
          { id: "q1", text: "What is the child's age?", type: "choice", options: ["0–1 year", "1–3 years", "3–5 years", "5–10 years", "Above 10 years"] },
          { id: "q2", text: "Which milestone is delayed?", type: "choice", options: ["Walking", "Talking", "Height/weight", "Teething", "Multiple"] },
          { id: "q3", text: "Was the child born premature?", type: "yesno" },
          { id: "q4", text: "Is the child getting proper nutrition?", type: "yesno" },
          { id: "q5", text: "Have you consulted a paediatrician?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 14. Thyroid / Diabetes / Weight ────────────────────────────────────────
  {
    id: "systemic",
    label: "Thyroid / Diabetes / Weight",
    icon: "⚕️",
    symptoms: [
      {
        id: "thyroid",
        label: "Thyroid Problem",
        followUp: [
          { id: "q1", text: "Have you been diagnosed with thyroid disorder?", type: "choice", options: ["Yes, hypothyroid (underactive)", "Yes, hyperthyroid (overactive)", "Suspected but not confirmed", "Not diagnosed"] },
          { id: "q2", text: "Are you on thyroid medicine currently?", type: "yesno" },
          { id: "q3", text: "Do you have fatigue, weight gain, and hair loss?", type: "yesno" },
          { id: "q4", text: "When was your last TSH test done?", type: "choice", options: ["Within 3 months", "3–6 months ago", "More than 6 months ago", "Never tested"] },
          { id: "q5", text: "Any family history of thyroid problems?", type: "yesno" },
        ],
      },
      {
        id: "diabetes",
        label: "Diabetes / High Sugar",
        followUp: [
          { id: "q1", text: "Have you been diagnosed with diabetes?", type: "choice", options: ["Yes, Type 1", "Yes, Type 2", "Pre-diabetic", "Not diagnosed"] },
          { id: "q2", text: "What is your usual fasting sugar level?", type: "choice", options: ["Below 100 mg/dL (normal)", "100–125 mg/dL (pre-diabetic)", "126–200 mg/dL", "Above 200 mg/dL", "Don't know"] },
          { id: "q3", text: "Are you on diabetes medication or insulin?", type: "yesno" },
          { id: "q4", text: "Do you have increased thirst, frequent urination, or fatigue?", type: "yesno" },
          { id: "q5", text: "Any family history of diabetes?", type: "yesno" },
          { id: "q6", text: "Do you exercise regularly?", type: "yesno" },
        ],
      },
      {
        id: "weight-gain",
        label: "Weight Gain / Obesity",
        followUp: [
          { id: "q1", text: "How much weight have you gained?", type: "choice", options: ["2–5 kg", "5–10 kg", "10–20 kg", "More than 20 kg"] },
          { id: "q2", text: "Has the gain been sudden or gradual?", type: "choice", options: ["Sudden (within weeks)", "Gradual over months"] },
          { id: "q3", text: "Do you exercise regularly?", type: "yesno" },
          { id: "q4", text: "Have you been tested for thyroid or hormones?", type: "yesno" },
          { id: "q5", text: "Do you have PCOD or diabetes?", type: "yesno" },
        ],
      },
      {
        id: "weight-loss",
        label: "Unexplained Weight Loss",
        followUp: [
          { id: "q1", text: "How much weight have you lost?", type: "choice", options: ["2–5 kg", "5–10 kg", "More than 10 kg"] },
          { id: "q2", text: "Has it happened without dieting or exercise?", type: "yesno" },
          { id: "q3", text: "Do you have good appetite or poor appetite?", type: "choice", options: ["Good appetite but still losing", "Poor appetite", "Normal appetite"] },
          { id: "q4", text: "Do you have diarrhoea, fever, or night sweats?", type: "yesno" },
          { id: "q5", text: "Have you been tested for thyroid or diabetes?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 15. Dental / Mouth ─────────────────────────────────────────────────────
  {
    id: "dental",
    label: "Teeth & Mouth",
    icon: "🦷",
    symptoms: [
      {
        id: "toothache",
        label: "Toothache",
        followUp: [
          { id: "q1", text: "Which tooth/area hurts?", type: "choice", options: ["Upper left", "Upper right", "Lower left", "Lower right", "Multiple teeth"] },
          { id: "q2", text: "Is the pain sharp or dull?", type: "choice", options: ["Sharp / throbbing", "Dull ache", "Sensitivity to hot/cold"] },
          { id: "q3", text: "Is there swelling in the gums or face?", type: "yesno" },
          { id: "q4", text: "Do your gums bleed when brushing?", type: "yesno" },
          { id: "q5", text: "Have you visited a dentist recently?", type: "yesno" },
        ],
      },
      {
        id: "mouth-ulcers",
        label: "Mouth Ulcers / Sores",
        followUp: [
          { id: "q1", text: "How often do you get mouth ulcers?", type: "choice", options: ["Currently for the first time", "Every few weeks", "Monthly", "Rarely"] },
          { id: "q2", text: "How many ulcers do you have now?", type: "choice", options: ["1–2", "3–5", "More than 5"] },
          { id: "q3", text: "Are they very painful while eating?", type: "yesno" },
          { id: "q4", text: "Do you have any vitamin deficiency (B12, iron)?", type: "choice", options: ["Yes, diagnosed", "Not tested", "No"] },
          { id: "q5", text: "Do you have any digestive problems (acidity, constipation)?", type: "yesno" },
        ],
      },
      {
        id: "bad-breath",
        label: "Bad Breath (Halitosis)",
        followUp: [
          { id: "q1", text: "How long have you noticed bad breath?", type: "choice", options: ["Recently", "Months", "Years"] },
          { id: "q2", text: "Do you have tooth decay or gum problems?", type: "yesno" },
          { id: "q3", text: "Do you have acidity or stomach problems?", type: "yesno" },
          { id: "q4", text: "Do you brush twice daily and use mouthwash?", type: "yesno" },
          { id: "q5", text: "Do others notice it or only you?", type: "choice", options: ["Others have told me", "Only I notice it", "Both"] },
        ],
      },
    ],
  },

  // ── 16. Sexual Health ──────────────────────────────────────────────────────
  {
    id: "sexual",
    label: "Sexual Health",
    icon: "🔒",
    symptoms: [
      {
        id: "erectile-dysfunction",
        label: "Erectile Dysfunction (Men)",
        followUp: [
          { id: "q1", text: "How long have you had this problem?", type: "choice", options: ["Less than 3 months", "3–12 months", "More than 1 year"] },
          { id: "q2", text: "Is it complete inability or occasional difficulty?", type: "choice", options: ["Complete inability", "Occasional difficulty", "Reduced firmness"] },
          { id: "q3", text: "Do you have diabetes, BP, or heart problems?", type: "yesno" },
          { id: "q4", text: "Are you taking any medications?", type: "yesno" },
          { id: "q5", text: "Do you have stress, anxiety, or relationship issues?", type: "yesno" },
        ],
      },
      {
        id: "premature-ejaculation",
        label: "Premature Ejaculation",
        followUp: [
          { id: "q1", text: "How long has this been a problem?", type: "choice", options: ["Always had it", "Developed recently", "Getting worse over time"] },
          { id: "q2", text: "Does it happen every time?", type: "choice", options: ["Every time", "Most times", "Occasionally"] },
          { id: "q3", text: "Is it causing relationship stress?", type: "yesno" },
          { id: "q4", text: "Do you feel anxious about performance?", type: "yesno" },
          { id: "q5", text: "Have you tried any treatment before?", type: "yesno" },
        ],
      },
      {
        id: "low-libido",
        label: "Low Libido / Desire",
        followUp: [
          { id: "q1", text: "How long has desire been low?", type: "choice", options: ["Few weeks", "Months", "More than a year"] },
          { id: "q2", text: "Do you feel fatigued or stressed?", type: "yesno" },
          { id: "q3", text: "Have you had hormonal tests done (testosterone)?", type: "yesno" },
          { id: "q4", text: "Are you on any medications (BP, antidepressants)?", type: "yesno" },
          { id: "q5", text: "Is your relationship generally healthy?", type: "yesno" },
        ],
      },
    ],
  },

  // ── 17. Fever & General ────────────────────────────────────────────────────
  {
    id: "general",
    label: "Fever & General Health",
    icon: "🌡️",
    symptoms: [
      {
        id: "fever",
        label: "Fever",
        followUp: [
          { id: "q1", text: "What is your temperature?", type: "choice", options: ["99–100°F (mild)", "100–102°F (moderate)", "102–104°F (high)", "Above 104°F"] },
          { id: "q2", text: "How many days have you had fever?", type: "choice", options: ["1–2 days", "3–5 days", "More than 1 week"] },
          { id: "q3", text: "Does the fever come and go or stay constant?", type: "choice", options: ["Constant throughout", "Comes in evening/night", "Comes and goes randomly"] },
          { id: "q4", text: "Do you have body ache, cold, or cough with it?", type: "yesno" },
          { id: "q5", text: "Have you taken any blood tests?", type: "yesno" },
        ],
      },
      {
        id: "fatigue-weakness",
        label: "Fatigue / Weakness",
        followUp: [
          { id: "q1", text: "How long have you been feeling tired?", type: "choice", options: ["Few days", "Few weeks", "Months", "Always tired"] },
          { id: "q2", text: "Do you feel tired even after sleeping well?", type: "yesno" },
          { id: "q3", text: "Have you lost weight or appetite?", type: "yesno" },
          { id: "q4", text: "Have you had blood tests (hemoglobin, thyroid, sugar)?", type: "yesno" },
          { id: "q5", text: "Do you have any chronic disease (diabetes, thyroid)?", type: "yesno" },
        ],
      },
      {
        id: "allergy",
        label: "Allergy (General)",
        followUp: [
          { id: "q1", text: "What triggers your allergy?", type: "choice", options: ["Dust / pollen", "Food items", "Cold weather", "Medicines", "Don't know"] },
          { id: "q2", text: "What are your symptoms?", type: "choice", options: ["Sneezing / runny nose", "Skin rashes / hives", "Itchy eyes", "Breathing difficulty", "Multiple symptoms"] },
          { id: "q3", text: "Is it seasonal or year-round?", type: "choice", options: ["Seasonal (specific months)", "Year-round", "Random"] },
          { id: "q4", text: "Do you take antihistamines?", type: "yesno" },
          { id: "q5", text: "How long have you had allergies?", type: "choice", options: ["Recent", "Few years", "Since childhood"] },
        ],
      },
      {
        id: "immunity",
        label: "Low Immunity / Frequent Infections",
        followUp: [
          { id: "q1", text: "How often do you fall sick?", type: "choice", options: ["Almost every month", "Every 2–3 months", "Seasonally"] },
          { id: "q2", text: "What infections do you get most?", type: "choice", options: ["Cold / cough", "Throat infections", "Skin infections", "UTI", "Multiple types"] },
          { id: "q3", text: "Do you eat a balanced diet with fruits and vegetables?", type: "yesno" },
          { id: "q4", text: "Do you exercise or stay physically active?", type: "yesno" },
          { id: "q5", text: "Do you take any vitamins or supplements?", type: "yesno" },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getOrganById(id: string): OrganCategory | undefined {
  return ORGAN_CATEGORIES.find((o) => o.id === id);
}

export function getSymptomById(organId: string, symptomId: string): Symptom | undefined {
  return getOrganById(organId)?.symptoms.find((s) => s.id === symptomId);
}

/**
 * Look up the full question text for a given question ID within a specific organ+symptom.
 * Used by the doctor dashboard to display questions alongside answers.
 */
export function getQuestionText(organLabel: string, symptomLabel: string, questionId: string): string {
  const organ = ORGAN_CATEGORIES.find((o) => o.label === organLabel);
  if (!organ) return questionId;
  const symptom = organ.symptoms.find((s) => s.label === symptomLabel);
  if (!symptom) return questionId;
  const question = symptom.followUp.find((q) => q.id === questionId);
  return question?.text ?? questionId;
}

/**
 * Get all questions for a given organ+symptom as a map: questionId → questionText
 * Useful for bulk lookup when displaying complaint answers.
 */
export function getQuestionMap(organLabel: string, symptomLabel: string): Record<string, string> {
  const organ = ORGAN_CATEGORIES.find((o) => o.label === organLabel);
  if (!organ) return {};
  const symptom = organ.symptoms.find((s) => s.label === symptomLabel);
  if (!symptom) return {};
  const map: Record<string, string> = {};
  for (const q of symptom.followUp) {
    map[q.id] = q.text;
  }
  return map;
}
