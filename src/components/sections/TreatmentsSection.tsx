import Link from "next/link";
import { TREATMENT_CATEGORIES } from "@/lib/constants";
import { FiArrowRight } from "react-icons/fi";

export default function TreatmentsSection() {
  return (
    <section id="treatments" className="section-pad bg-warm-gradient">
      <div className="container-pad">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="badge-saffron mb-3">What We Treat</span>
          <h2 className="section-title mb-4">
            Conditions We <span className="text-gradient">Specialize In</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Our gentle homeopathic treatments address the root cause of your health problems — providing lasting relief without harmful side effects.
          </p>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {TREATMENT_CATEGORIES.map((treatment) => (
            <Link
              key={treatment.id}
              href={`/treatments/${treatment.id}`}
              className="group bg-white rounded-3xl p-5 border border-green-100 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-green-200"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${treatment.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border ${treatment.borderColor}`}
              >
                <span className="text-2xl">{treatment.icon}</span>
              </div>

              {/* Content */}
              <h3 className="font-bold text-green-900 text-base mb-1.5 group-hover:text-green-700 transition-colors">
                {treatment.name}
              </h3>
              <p className="text-green-600 text-xs leading-relaxed mb-3 line-clamp-2">
                {treatment.description}
              </p>

              {/* Symptoms */}
              <div className="flex flex-wrap gap-1 mb-3">
                {treatment.symptoms.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className={`text-xs px-2 py-0.5 rounded-full ${treatment.tagColor}`}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold group-hover:gap-2 transition-all">
                Learn More
                <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href="/treatments" className="btn-primary">
            View All Treatments
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-green-600 text-sm mt-3">
            Not sure which treatment you need?{" "}
            <Link
              href="/#appointment"
              className="text-green-700 font-semibold underline hover:text-green-800"
            >
              Book a free consultation
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
