import { motion } from "framer-motion";
import Navbar from "../hooks/layouts/Navbar";

export default function About() {
  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Nairobi",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const developers = [
    {
      name: "Benson Mwanake",
      role: "Lead Developer",
      github: "https://github.com/Benson-Mwanake",
    },
    {
      name: "Lillian Cherono ",
      role: "UI/UX Designer",
      github: "https://github.com/liliancherono",
    },
    {
      name: "Jesse Mwendwa Ndunda",
      role: "Backend Developer",
      github: "https://github.com/JesseMwendwaNdunda",
    },
  ];

  const leadership = [
    {
      name: "Dr. Amina Mohammed",
      title: "Chief Medical Officer",
      bio: "Over 15 years in public health, specializing in rural healthcare.",
      photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    },
    {
      name: "Mr. Peter Kimani",
      title: "Operations Director",
      bio: "Expert in healthcare logistics with a decade of experience.",
      photo: "https://plus.unsplash.com/premium_photo-1682130171029-49261a5ba80a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMGJsYWNrJTIwJTIwZG9jdG9yfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    },
  ];

  const services = [
    {
      name: "AI Symptom Checker",
      link: "/services/symptom-checker",
      description: "Get preliminary health insights instantly.",
    },
    {
      name: "Clinic Booking",
      link: "/services/clinic-booking",
      description: "Schedule appointments with verified providers.",
    },
    {
      name: "Health Education",
      link: "/services/health-education",
      description: "Access resources to improve health literacy.",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Ali",
      quote:
        "AfyaLink KE saved me time and connected me to a nearby clinic—amazing service!",
      location: "Nairobi",
    },
    {
      name: "David Otieno",
      quote:
        "The AI Symptom Checker gave me peace of mind before my doctor’s visit.",
      location: "Kisumu",
    },
  ];

  const awards = [
    "2025 Kenya Health Innovation Award",
    "Certified by the Kenya Medical Practitioners and Dentists Council",
  ];

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-6 md:px-12 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12 text-center md:text-left">
          {/* Heading Section */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight"
          >
            About <span className="text-green-500">AfyaLink KE</span>
          </motion.h2>

          {/* Mission and Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Mission and Values
            </h3>
            <p>
              <strong>AfyaLink KE</strong> is committed to improving healthcare
              accessibility across Kenya, launched on {currentDate}. Our mission
              is to empower communities through patient-centered care,
              innovative technology, and collaboration with Community Health
              Volunteers (CHVs) and verified clinics. We value transparency,
              trust, and equitable health solutions for all Kenyans.
            </p>
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our History
            </h3>
            <p>
              Founded in 2025 as a capstone project by a team of dedicated
              developers, AfyaLink KE emerged from a vision to address
              healthcare disparities in Kenya. Starting as a prototype, it has
              evolved into a full-stack platform, integrating AI-driven tools
              and a verified clinic network to serve thousands across the
              nation.
            </p>
          </motion.div>

          {/* Leadership and Staff */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Leadership and Staff
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.map((leader, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow custom-shadow"
                >
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h4 className="text-xl font-medium">{leader.name}</h4>
                  <p className="text-green-600">{leader.title}</p>
                  <p className="mt-2">{leader.bio}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our Services
            </h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li
                  key={index}
                  className="bg-white p-4 rounded-xl shadow custom-shadow"
                >
                  <a
                    href={service.link}
                    className="text-green-600 hover:underline"
                  >
                    {service.name}
                  </a>
                  <p>{service.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Patient-Centered Approach */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Patient-Centered Approach
            </h3>
            <p>
              At AfyaLink KE, we prioritize patient needs by offering
              personalized health insights, flexible appointment scheduling, and
              support from CHVs. Our platform is designed to enhance the patient
              experience, ensuring care is accessible, respectful, and tailored
              to individual preferences.
            </p>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              What Our Patients Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow custom-shadow"
                >
                  <p className="italic">"{testimonial.quote}"</p>
                  <p className="mt-2 font-semibold text-green-600">
                    - {testimonial.name}, {testimonial.location}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Awards and Recognition */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Awards and Recognition
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {awards.map((award, index) => (
                <li key={index} className="text-green-600">
                  {award}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
            className="text-gray-700 leading-relaxed text-lg bg-white p-6 rounded-xl shadow custom-shadow"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Contact Us
            </h3>
            <p>Phone: +254 712 345 678</p>
            <p>Email: support@afyalink.ke</p>
            <p>Address: P.O. Box 12345, Nairobi, Kenya</p>
            <a
              href="/contact"
              className="text-green-600 hover:underline mt-2 inline-block"
            >
              Contact Form
            </a>
          </motion.div>

          {/* Motto / Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="mt-10 bg-green-100 border-l-4 border-green-500 py-6 px-6 rounded-xl shadow custom-shadow"
          >
            <p className="text-gray-700 italic text-lg md:text-xl text-center md:text-left">
              “Enhancing healthcare accessibility through innovation and
              community trust—
              <span className="font-semibold text-green-700">
                {" "}
                one connection at a time.
              </span>
              ”
            </p>
          </motion.div>

          {/* Developers Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            viewport={{ once: true }}
            className="mt-12 bg-white p-6 rounded-xl shadow custom-shadow"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our Development Team
            </h3>
            <ul className="space-y-4">
              {developers.map((dev, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    <strong>{dev.name}</strong> - {dev.role}
                  </span>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 underline"
                  >
                    GitHub
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Motto Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-green-600 to-green-300 rounded-full mt-8"
          ></motion.div>

          {/* Motto Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center md:text-right text-green-600 font-semibold italic mt-4 tracking-wide"
          >
            — Empowering Health, Empowering Kenya 💚
          </motion.p>
        </div>
      </section>
    </>
  );
}
