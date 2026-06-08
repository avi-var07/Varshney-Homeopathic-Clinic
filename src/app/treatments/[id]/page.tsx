import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { TREATMENT_CATEGORIES, CLINIC_NAME, DOCTOR_NAME, WHATSAPP_LINK } from "@/lib/constants";
import { FiCheckCircle, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// Extended treatment data
const treatmentDetails: Record<
  string,
  {
    fullDescription: string;
    causes: string[];
    symptoms: string[];
    lifestyle: string[];
    howHomeopathyHelps: string;
    faqs: Array<{ q: string; a: string }>;
  }
> = {
  migraine: {
    fullDescription:
      "Migraine is more than just a headache — it's a complex neurological condition that affects millions of people. Constitutional homeopathy addresses the root cause of migraines by working on the individual's overall health, stress response, and nervous system balance.",
    causes: [
      "Hormonal changes and stress",
      "Sleep disturbances",
      "Dietary triggers (cheese, caffeine, alcohol)",
      "Environmental factors like bright light or strong smells",
      "Genetic predisposition",
    ],
    symptoms: [
      "Throbbing headache on one side",
      "Nausea and vomiting",
      "Sensitivity to light and sound",
      "Visual aura (flashes, zigzag lines)",
      "Neck stiffness and fatigue",
    ],
    lifestyle: [
      "Maintain regular sleep schedule",
      "Stay well hydrated throughout the day",
      "Identify and avoid personal triggers",
      "Practice yoga and meditation daily",
      "Avoid screen overuse before bed",
    ],
    howHomeopathyHelps:
      "Homeopathy treats migraine constitutionally — addressing the individual's unique symptom pattern. Remedies like Belladonna, Natrum Muriaticum, Spigelia, and Iris Versicolor are prescribed based on the individual pattern, not just the headache. Most patients see significant improvement within 2-3 months of treatment.",
    faqs: [
      {
        q: "How long does it take to cure migraine with homeopathy?",
        a: "Most patients experience noticeable improvement within 4-8 weeks. Complete relief usually takes 3-6 months depending on severity and duration of the condition.",
      },
      {
        q: "Can I take homeopathic medicines with my regular migraine medication?",
        a: "Yes, homeopathic medicines are safe to take alongside conventional medications. As your condition improves, you can gradually reduce conventional medication under medical supervision.",
      },
      {
        q: "Is homeopathy safe for children with migraines?",
        a: "Absolutely. Homeopathic medicines are gentle, non-toxic, and safe for children of all ages. They have zero side effects.",
      },
    ],
  },
  "hair-fall": {
    fullDescription:
      "Hair fall is one of the most common complaints in India, affecting both men and women. Homeopathy addresses hair fall at the root level by treating the underlying causes such as hormonal imbalances, nutritional deficiencies, stress, and scalp conditions.",
    causes: [
      "Hormonal imbalance (thyroid, PCOD)",
      "Nutritional deficiencies (iron, zinc, protein)",
      "Chronic stress and anxiety",
      "Scalp infections or dandruff",
      "Hereditary factors",
      "Post-illness hair fall",
    ],
    symptoms: [
      "Excessive daily hair shedding",
      "Visible thinning of hair",
      "Receding hairline",
      "Bald patches (alopecia areata)",
      "Weak and brittle hair",
    ],
    lifestyle: [
      "Eat protein-rich foods (eggs, lentils, nuts)",
      "Massage scalp with warm oil weekly",
      "Reduce heat styling and chemical treatments",
      "Manage stress through yoga and meditation",
      "Stay well hydrated",
    ],
    howHomeopathyHelps:
      "Homeopathy treats hair fall holistically. Remedies like Silicea, Phosphorus, Lycopodium, Natrum Mur, and Thuja are prescribed based on the individual's complete health picture. Homeopathy not only stops hair fall but also stimulates new hair growth by improving overall vitality.",
    faqs: [
      {
        q: "Can homeopathy actually regrow lost hair?",
        a: "Yes, in many cases homeopathy can stimulate regrowth, especially in alopecia areata and early-stage pattern baldness. Results vary by cause and duration of hair loss.",
      },
      {
        q: "How long before I see results?",
        a: "Initial reduction in hair fall is usually seen within 4-6 weeks. Visible regrowth takes 3-4 months of consistent treatment.",
      },
    ],
  },
  "skin-allergy": {
    fullDescription:
      "Skin allergies and dermatitis are increasingly common due to environmental pollution, lifestyle changes, and stress. Homeopathy offers safe, long-term relief from all types of skin conditions without the side effects of steroids.",
    causes: [
      "Allergic reactions to food, pollen, or chemicals",
      "Environmental pollutants",
      "Stress and immune system imbalance",
      "Hereditary eczema or psoriasis",
      "Contact with irritants",
    ],
    symptoms: [
      "Itching, burning, and redness",
      "Rashes and hives",
      "Dry, scaly skin patches",
      "Oozing or crusting lesions",
      "Swelling and inflammation",
    ],
    lifestyle: [
      "Use natural, fragrance-free skincare products",
      "Wear cotton clothing",
      "Avoid known allergens",
      "Keep skin moisturized",
      "Maintain a clean, allergen-free home environment",
    ],
    howHomeopathyHelps:
      "Homeopathy treats skin from the inside out — addressing the immune system imbalance that causes allergic reactions. Remedies like Sulphur, Graphites, Arsenicum, Natrum Mur, and Apis are chosen based on the specific pattern of the allergy, providing lasting relief.",
    faqs: [
      {
        q: "Can homeopathy cure chronic eczema?",
        a: "Yes, homeopathy has excellent results for chronic eczema and psoriasis. It addresses the root cause — immune dysregulation — rather than suppressing symptoms.",
      },
      {
        q: "Are there dietary restrictions during homeopathy skin treatment?",
        a: "General advice is to avoid coffee, camphor, and strong-smelling substances as they can antidote some remedies. Specific advice varies by prescription.",
      },
    ],
  },
  "acne-pimples": {
    fullDescription:
      "Acne affects 85% of teenagers and many adults. Rather than just treating the surface, homeopathy addresses hormonal imbalances, digestive issues, and immune system function that contribute to acne.",
    causes: [
      "Hormonal fluctuations during puberty or menstrual cycles",
      "Excess sebum production",
      "Bacterial infection (P. acnes)",
      "Stress and lack of sleep",
      "Poor diet high in sugar and dairy",
    ],
    symptoms: [
      "Pimples, whiteheads, and blackheads",
      "Painful cystic acne",
      "Oily skin",
      "Acne scars and pigmentation",
      "Inflamed, red pustules",
    ],
    lifestyle: [
      "Wash face twice daily with gentle cleanser",
      "Avoid touching your face",
      "Reduce sugar and dairy intake",
      "Stay hydrated and sleep well",
      "Never pop pimples",
    ],
    howHomeopathyHelps:
      "Homeopathic treatment for acne includes remedies like Sulphur, Psorinum, Kali Bromatum, Silicea, and Hepar Sulph. These work by regulating sebum production, balancing hormones, and strengthening the immune system.",
    faqs: [
      {
        q: "How long does homeopathic acne treatment take?",
        a: "Most patients see improvement within 6-8 weeks. For severe cystic acne, treatment may take 4-6 months for full resolution.",
      },
    ],
  },
  "pcod-pcos": {
    fullDescription:
      "PCOD (Polycystic Ovarian Disease) affects 1 in 5 Indian women. Homeopathy offers a gentle, hormone-free approach to restoring menstrual regularity, reducing cysts, and improving fertility.",
    causes: [
      "Insulin resistance",
      "Hormonal imbalance (high androgens)",
      "Genetic predisposition",
      "Sedentary lifestyle and obesity",
      "Chronic stress",
    ],
    symptoms: [
      "Irregular or absent periods",
      "Weight gain, especially around abdomen",
      "Acne and oily skin",
      "Excess facial hair (hirsutism)",
      "Difficulty conceiving",
    ],
    lifestyle: [
      "Regular exercise (at least 30 min daily)",
      "Low glycemic index diet",
      "Stress management — yoga, meditation",
      "Maintain healthy weight",
      "Get regular health checkups",
    ],
    howHomeopathyHelps:
      "Homeopathy treats PCOD constitutionally, addressing hormonal imbalances from within. Remedies like Pulsatilla, Sepia, Thuja, Calcarea Carbonica, and Apis Mellifica are used based on individual symptoms to regulate cycles and reduce cysts.",
    faqs: [
      {
        q: "Can homeopathy help with PCOD and fertility?",
        a: "Yes, many women with PCOD have successfully conceived after homeopathic treatment. It works by restoring hormonal balance naturally.",
      },
      {
        q: "Do I need to stop my hormonal pills?",
        a: "No. Homeopathy can be started alongside conventional treatment. As your condition improves, you can reduce conventional medications under your gynecologist's guidance.",
      },
    ],
  },
  thyroid: {
    fullDescription:
      "Thyroid disorders — both hypothyroidism and hyperthyroidism — affect millions of Indians. Homeopathy helps regulate thyroid function naturally, reducing dependence on hormone replacement therapy.",
    causes: [
      "Autoimmune conditions (Hashimoto's, Graves' disease)",
      "Iodine deficiency or excess",
      "Genetic predisposition",
      "Stress and emotional trauma",
      "Post-pregnancy hormonal changes",
    ],
    symptoms: [
      "Fatigue and weakness",
      "Weight gain or loss",
      "Hair loss and dry skin",
      "Mood changes and depression",
      "Irregular heartbeat or palpitations",
    ],
    lifestyle: [
      "Eat iodine-rich foods (seafood, dairy)",
      "Avoid raw cruciferous vegetables in excess",
      "Exercise regularly",
      "Manage stress",
      "Get adequate sleep",
    ],
    howHomeopathyHelps:
      "Homeopathy supports thyroid function holistically. Remedies like Iodum, Spongia, Thyroidinum, Calcarea Carbonica, and Lycopus are chosen based on the individual's symptom pattern to help normalize thyroid hormone levels.",
    faqs: [
      {
        q: "Can I stop my thyroid medication after homeopathic treatment?",
        a: "This should only be done gradually and under medical supervision after blood tests confirm normalization. Homeopathy helps, but medication changes should be doctor-supervised.",
      },
    ],
  },
  "joint-pain": {
    fullDescription:
      "Joint pain and arthritis are common in India, especially among older adults. Homeopathy provides effective relief from pain, inflammation, and stiffness without the gastrointestinal and kidney side effects of conventional pain medications.",
    causes: [
      "Osteoarthritis (wear and tear)",
      "Rheumatoid arthritis (autoimmune)",
      "Gout (uric acid buildup)",
      "Injury and overuse",
      "Vitamin D and calcium deficiency",
    ],
    symptoms: [
      "Joint pain and tenderness",
      "Morning stiffness",
      "Swelling and warmth",
      "Reduced range of motion",
      "Crepitus (cracking sounds)",
    ],
    lifestyle: [
      "Low-impact exercise (swimming, walking)",
      "Maintain healthy weight",
      "Warm up before any activity",
      "Anti-inflammatory diet (turmeric, ginger)",
      "Adequate calcium and Vitamin D intake",
    ],
    howHomeopathyHelps:
      "Homeopathy treats joint conditions with remedies like Rhus Tox, Bryonia, Arnica, Causticum, and Colchicum. These reduce inflammation, improve joint mobility, and address the underlying cause whether autoimmune, metabolic, or degenerative.",
    faqs: [
      {
        q: "How quickly does homeopathy work for joint pain?",
        a: "Many patients experience significant pain relief within 2-4 weeks. Long-term improvement in joint function takes 3-6 months of treatment.",
      },
    ],
  },
  "acidity-gas": {
    fullDescription:
      "Chronic acidity, gastritis, and IBS are extremely common in India due to spicy diets, stress, and irregular eating habits. Homeopathy offers gentle, lasting relief without the acid suppression that can lead to nutritional deficiencies.",
    causes: [
      "Irregular eating habits",
      "Spicy, oily, and acidic foods",
      "Stress and anxiety",
      "H. pylori infection",
      "Excessive tea/coffee consumption",
    ],
    symptoms: [
      "Heartburn and acid reflux",
      "Bloating and gas",
      "Nausea and belching",
      "Stomach pain after eating",
      "Indigestion and heaviness",
    ],
    lifestyle: [
      "Eat smaller, frequent meals",
      "Avoid lying down immediately after eating",
      "Reduce spicy and fried foods",
      "Stay hydrated",
      "Manage stress through relaxation techniques",
    ],
    howHomeopathyHelps:
      "Homeopathic remedies for acidity include Nux Vomica, Lycopodium, Carbo Veg, Arsenicum, and Pulsatilla. These treat the root digestive weakness rather than just suppressing acid, leading to long-term digestive health.",
    faqs: [
      {
        q: "Is homeopathy effective for GERD (acid reflux)?",
        a: "Yes, homeopathy is very effective for GERD. Unlike antacids, it doesn't suppress acid but corrects the underlying digestive imbalance.",
      },
    ],
  },
  "anxiety-stress": {
    fullDescription:
      "In today's fast-paced world, anxiety and stress are extremely common. Homeopathy treats mental and emotional conditions gently and effectively without the dependency and side effects associated with psychiatric medications.",
    causes: [
      "Work and life pressure",
      "Relationship difficulties",
      "Financial concerns",
      "Grief and loss",
      "Chronic illness",
    ],
    symptoms: [
      "Persistent worry and fear",
      "Sleep disturbances",
      "Palpitations and chest tightness",
      "Irritability and mood swings",
      "Difficulty concentrating",
    ],
    lifestyle: [
      "Daily meditation and deep breathing",
      "Regular physical exercise",
      "Limit screen time and news consumption",
      "Maintain social connections",
      "Establish a regular sleep routine",
    ],
    howHomeopathyHelps:
      "Homeopathy is remarkably effective for anxiety and stress. Remedies like Argentum Nitricum, Gelsemium, Arsenicum, Pulsatilla, and Ignatia are prescribed based on the specific anxiety pattern — whether it's anticipatory anxiety, grief, or chronic worry.",
    faqs: [
      {
        q: "Can homeopathy replace antidepressants?",
        a: "Homeopathy can be very helpful for mild to moderate anxiety and depression. For severe cases, it works best alongside conventional treatment. Never stop psychiatric medications without medical supervision.",
      },
    ],
  },
  "child-health": {
    fullDescription:
      "Children respond beautifully to homeopathic treatment. It is the safest system of medicine for infants, children, and teenagers — with no toxic side effects and excellent efficacy for both acute and chronic childhood conditions.",
    causes: [
      "Recurrent infections (low immunity)",
      "Allergies",
      "Developmental factors",
      "Environmental exposures",
      "Dietary deficiencies",
    ],
    symptoms: [
      "Frequent cold, cough, and fever",
      "Tonsillitis and adenoid enlargement",
      "Bedwetting (enuresis)",
      "Poor appetite and growth",
      "Behavioral issues and tantrums",
    ],
    lifestyle: [
      "Balanced diet with fruits and vegetables",
      "Adequate outdoor play and sunlight",
      "Regular sleep schedule",
      "Limited screen time",
      "Good hygiene practices",
    ],
    howHomeopathyHelps:
      "Homeopathy boosts children's immunity naturally, reducing the frequency of infections without suppressing symptoms. Remedies are gentle, sweet-tasting, and safe for all ages. Common child remedies include Pulsatilla, Chamomilla, Calcarea, Baryta Carb, and Belladonna.",
    faqs: [
      {
        q: "From what age can children take homeopathic medicines?",
        a: "Homeopathy is safe from birth. Newborns and infants can take dissolved remedies. The medicines are sweet and non-toxic.",
      },
      {
        q: "Can homeopathy treat recurrent tonsillitis in children?",
        a: "Yes, homeopathy is excellent for recurrent tonsillitis. Many children avoid surgery after constitutional homeopathic treatment.",
      },
    ],
  },
  "seasonal-diseases": {
    fullDescription:
      "Seasonal diseases like viral fevers, dengue, chikungunya, flu, and cold are very common in India. Homeopathy offers preventive and curative treatment that strengthens the immune system for year-round protection.",
    causes: [
      "Viral and bacterial infections",
      "Seasonal allergies",
      "Weakened immunity",
      "Environmental changes",
      "Mosquito-borne infections",
    ],
    symptoms: [
      "Fever and body ache",
      "Cold, cough, and sneezing",
      "Diarrhea and vomiting",
      "Fatigue and weakness",
      "Skin rashes (dengue, chickenpox)",
    ],
    lifestyle: [
      "Stay hydrated with warm fluids",
      "Rest and avoid overexertion",
      "Use mosquito repellents",
      "Boost immunity with Vitamin C foods",
      "Maintain personal hygiene",
    ],
    howHomeopathyHelps:
      "Homeopathy is excellent for both prevention and treatment of seasonal illnesses. Genus epidemicus remedies are prescribed for epidemic prevention. Remedies like Eupatorium, Gelsemium, Rhus Tox, and Arsenicum Album treat various viral illnesses effectively.",
    faqs: [
      {
        q: "Can homeopathy prevent dengue fever?",
        a: "Homeopathy has genus epidemicus remedies that may help reduce susceptibility. It also helps in faster recovery from dengue and supports platelet count.",
      },
    ],
  },
  "sinus-allergy": {
    fullDescription:
      "Chronic sinusitis and respiratory allergies are debilitating conditions that conventional medicine often struggles to cure permanently. Homeopathy addresses the immune imbalance that makes you susceptible to sinus inflammation.",
    causes: [
      "Seasonal pollen allergies",
      "Dust mites and pet dander",
      "Air pollution",
      "Recurring respiratory infections",
      "Deviated nasal septum (as a predisposing factor)",
    ],
    symptoms: [
      "Nasal congestion and runny nose",
      "Facial pain and pressure",
      "Post-nasal drip",
      "Sneezing fits",
      "Headache and disturbed sleep",
    ],
    lifestyle: [
      "Use air purifiers at home",
      "Rinse nasal passages with saline",
      "Avoid cold and damp environments",
      "Identify and minimize allergen exposure",
      "Steam inhalation for relief",
    ],
    howHomeopathyHelps:
      "Homeopathy treats sinusitis constitutionally, improving immune tolerance to allergens. Remedies like Allium Cepa, Kali Bichromicum, Hydrastis, Pulsatilla, and Silicea are chosen based on the specific pattern of congestion and discharge.",
    faqs: [
      {
        q: "Can homeopathy cure chronic sinusitis without surgery?",
        a: "Many patients avoid sinus surgery with constitutional homeopathic treatment. Success depends on the severity and duration of the condition.",
      },
    ],
  },
};

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const treatment = TREATMENT_CATEGORIES.find((t) => t.id === params.id);
  if (!treatment) return { title: "Treatment Not Found" };

  return {
    title: `${treatment.name} Homeopathic Treatment in Mughalsarai`,
    description: `${treatment.description} Safe, natural homeopathic treatment at Varshney Clinic, Mughalsarai. Dr. Aman Varshney, BHMS. Call +91 7388333991.`,
    keywords: [
      `${treatment.name.toLowerCase()} homeopathy`,
      `${treatment.name.toLowerCase()} treatment mughalsarai`,
      `homeopathic ${treatment.name.toLowerCase()} chandauli`,
      "dr aman varshney",
    ],
  };
}

export async function generateStaticParams() {
  return TREATMENT_CATEGORIES.map((t) => ({ id: t.id }));
}

export default function TreatmentDetailPage({ params }: Props) {
  const treatment = TREATMENT_CATEGORIES.find((t) => t.id === params.id);
  if (!treatment) notFound();

  const details = treatmentDetails[params.id];
  const otherTreatments = TREATMENT_CATEGORIES.filter((t) => t.id !== params.id).slice(0, 4);

  const whatsappMsg = encodeURIComponent(
    `Hello Doctor, I need consultation for ${treatment.name}. Please help me.`
  );

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className={`pt-28 pb-14 bg-gradient-to-br ${treatment.color}`}>
        <div className="container-pad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <Link
                href="/treatments"
                className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mb-4 hover:text-green-700"
              >
                ← All Treatments
              </Link>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${treatment.tagColor} rounded-full text-sm font-medium mb-4`}>
                <span>{treatment.icon}</span>
                {treatment.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-950 leading-tight mb-4">
                Homeopathic Treatment for{" "}
                <span className="text-gradient">{treatment.name}</span>
              </h1>
              <p className="text-green-700 text-lg leading-relaxed mb-6">
                {details?.fullDescription || treatment.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/#appointment" className="btn-primary">
                  📅 Book Appointment
                </Link>
                <a
                  href={`https://wa.me/917388333991?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp Now
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className={`w-56 h-56 rounded-full bg-gradient-to-br ${treatment.color} border-8 border-white shadow-xl flex items-center justify-center`}
              >
                <span className="text-8xl">{treatment.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Symptoms */}
              {details?.symptoms && (
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-5 flex items-center gap-2">
                    <FiAlertCircle className="w-6 h-6 text-saffron-500" />
                    Common Symptoms
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.symptoms.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></div>
                        <span className="text-red-800 text-sm font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Causes */}
              {details?.causes && (
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-5">
                    🔍 Common Causes
                  </h2>
                  <div className="space-y-2">
                    {details.causes.map((c) => (
                      <div
                        key={c}
                        className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100"
                      >
                        <FiCheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-800 text-sm">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How Homeopathy Helps */}
              {details?.howHomeopathyHelps && (
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                  <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    🌿 How Homeopathy Helps
                  </h2>
                  <p className="text-green-700 leading-relaxed">
                    {details.howHomeopathyHelps}
                  </p>
                </div>
              )}

              {/* Lifestyle Tips */}
              {details?.lifestyle && (
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-5">
                    💡 Lifestyle Tips
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.lifestyle.map((tip) => (
                      <div
                        key={tip}
                        className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100"
                      >
                        <FiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {details?.faqs && (
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-5">
                    ❓ Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {details.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="border border-green-100 rounded-2xl overflow-hidden"
                      >
                        <div className="p-4 bg-green-50">
                          <p className="font-semibold text-green-900 text-sm">
                            Q: {faq.q}
                          </p>
                        </div>
                        <div className="p-4 bg-white">
                          <p className="text-green-700 text-sm leading-relaxed">
                            A: {faq.a}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Appointment card */}
              <div className="bg-green-gradient rounded-3xl p-6 text-white sticky top-24">
                <h3 className="font-bold text-xl mb-3">
                  Book Consultation for {treatment.name}
                </h3>
                <p className="text-green-100 text-sm mb-5">
                  Get personalized treatment from Dr. Aman Varshney. Safe, natural, and effective.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/#appointment"
                    className="flex items-center justify-center gap-2 w-full bg-white text-green-700 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    📅 Book Appointment
                  </Link>
                  <a
                    href={`https://wa.me/917388333991?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#1fba59] transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp Now
                  </a>
                  <a
                    href="tel:+917388333991"
                    className="flex items-center justify-center gap-2 w-full bg-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    📞 +91 7388333991
                  </a>
                </div>

                <div className="mt-5 pt-5 border-t border-white/20">
                  <p className="text-green-200 text-xs text-center">
                    🔒 Free first consultation · No side effects
                  </p>
                </div>
              </div>

              {/* Other treatments */}
              <div className="bg-white rounded-3xl p-5 border border-green-100 shadow-card">
                <h3 className="font-bold text-green-900 text-base mb-4">
                  Other Treatments
                </h3>
                <div className="space-y-2">
                  {otherTreatments.map((t) => (
                    <Link
                      key={t.id}
                      href={`/treatments/${t.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-xl transition-colors group"
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-green-700 text-sm font-medium group-hover:text-green-800">
                        {t.name}
                      </span>
                      <FiArrowRight className="w-3.5 h-3.5 text-green-400 ml-auto" />
                    </Link>
                  ))}
                  <Link
                    href="/treatments"
                    className="block text-center text-green-600 text-sm font-semibold pt-2 hover:text-green-700"
                  >
                    View All →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
