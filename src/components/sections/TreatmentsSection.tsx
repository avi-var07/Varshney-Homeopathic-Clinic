import Link from "next/link";
import Image from "next/image";
import { TREATMENT_CATEGORIES } from "@/lib/constants";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

export default function TreatmentsSection() {
  return (
    <section id="treatments" className="section-pad bg-warm-gradient">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-saffron mb-3">What We Treat</span>
          <h2 className="section-title mb-4">
            Conditions We <span className="text-gradient">Specialize In</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Our gentle homeopathic treatments address the root cause — providing lasting relief without harmful side effects.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {TREATMENT_CATEGORIES.map((treatment) => (
            <div
              key={treatment.id}
              className="group bg-white rounded-3xl border border-green-100 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
            >
              {/* Real image */}
              <div className="relative h-40 overflow-hidden bg-green-100">
                <Image
                  src={treatment.image}
                  alt={`${treatment.name} treatment`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Treatment name overlay on image */}
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${treatment.tagColor} bg-opacity-90`}>
                    {treatment.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-green-600 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
                  {treatment.description}
                </p>

                {/* Symptoms */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {treatment.symptoms.slice(0, 2).map((s) => (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${treatment.tagColor}`}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Dual CTAs */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/treatments/${treatment.id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-green-300 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-50 transition-colors"
                  >
                    Learn More
                    <FiArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/book"
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-gradient text-white text-xs font-bold rounded-xl hover:shadow-soft transition-all"
                  >
                    <FiCalendar className="w-3 h-3" />
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href="/treatments" className="btn-primary">
            View All Treatments
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-green-600 text-sm mt-3">
            Not sure which treatment?{" "}
            <Link href="/book" className="text-green-700 font-semibold underline hover:text-green-800">
              Book a free consultation
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
