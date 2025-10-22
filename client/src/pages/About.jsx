import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10 text-center md:text-left">
        {/* Heading Section */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight"
        >
          About <span className="text-blue-500">AfyaLink KE</span>
        </motion.h2>

        {/* Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          <strong>AfyaLink KE</strong> is a digital health platform designed to
          make healthcare more accessible, transparent, and community-driven
          across Kenya. By bridging the gap between users, Community Health
          Volunteers (CHVs), and trusted local clinics, AfyaLink KE empowers
          individuals to take control of their health through technology and
          information.
        </motion.p>

        {/* Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          Our mission is to connect Kenyans with reliable medical guidance,
          starting right from their smartphones. Through our intelligent{" "}
          <strong className="text-blue-600">AI Symptom Checker</strong>, users
          can describe their symptoms and receive insights that help them
          understand possible causes, urgency levels, and the next steps to
          take. This tool acts as a digital first line of support—especially
          useful for those in remote areas or seeking quick, confidential advice
          before visiting a facility.
        </motion.p>

        {/* Paragraph 3 */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          Beyond virtual assistance, AfyaLink KE collaborates with verified
          clinics and CHVs to ensure users get connected to real people who can
          help—whether it’s scheduling an appointment, following up on
          treatment, or finding the nearest healthcare provider. Every clinic
          and CHV on our platform undergoes a careful verification process to
          guarantee trust, reliability, and quality service.
        </motion.p>

        {/* Paragraph 4 */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-700 leading-relaxed text-lg"
        >
          Our vision is to create a healthier Kenya by combining technology,
          community, and compassion. With{" "}
          <span className="font-semibold text-blue-700">AfyaLink KE</span>,
          healthcare isn’t just about hospitals and medicine—it’s about access,
          awareness, and empowerment for every individual. Whether you’re
          looking for a nearby clinic, need quick health insights, or want to
          engage with a CHV in your area, AfyaLink KE is your trusted digital
          health companion.
        </motion.p>

        {/* Motto / Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 bg-blue-100 border-l-4 border-blue-500 py-6 px-6 rounded-xl shadow-sm"
        >
          <p className="text-gray-700 italic text-lg md:text-xl text-center md:text-left">
            “Together, we’re redefining how healthcare is accessed and delivered
            —
            <span className="font-semibold text-blue-700">
              {" "}
              one link at a time.
            </span>
            ”
          </p>
        </motion.div>

        {/* Motto line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="h-1 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full mt-8"
        ></motion.div>

        {/* Motto subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center md:text-right text-blue-600 font-semibold italic mt-4 tracking-wide"
        >
          — Empowering Health, Empowering You 💙
        </motion.p>
      </div>
    </section>
  );
}
