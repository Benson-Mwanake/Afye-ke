import React from "react";
import { motion } from "framer-motion";
import Footer from "../layouts/Footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-green-50 to-white"
      >
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Quality healthcare, simplified.
          </h1>
          <p className="text-text-secondary mt-4 mb-6">
            AfyaLink connects patients with nearby clinics and community health
            volunteers for better access to care — anytime, anywhere.
          </p>
          <Button>Find a Clinic</Button>
        </div>
        <motion.img
          src="/hero-illustration.png"
          alt="Healthcare illustration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-full md:w-1/2 mt-10 md:mt-0"
        />
      </motion.section>

      {/* Why Choose AfyaLink */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-6 md:px-20 py-16 bg-white"
      >
        <h2 className="text-2xl font-semibold text-center mb-12">
          Why Choose AfyaLink?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              emoji: "💬",
              title: "Trusted Support",
              desc: "Connect with verified health professionals and CHVs you can trust.",
            },
            {
              emoji: "📍",
              title: "Accessible Clinics",
              desc: "Find nearby clinics quickly with location-based recommendations.",
            },
            {
              emoji: "⚕️",
              title: "Quality Healthcare",
              desc: "We partner with accredited healthcare providers for reliable services.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <div className="text-primary text-4xl mb-4">{card.emoji}</div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-text-secondary text-sm">{card.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Clinics */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-6 md:px-20 py-16 bg-background"
      >
        <h2 className="text-2xl font-semibold text-center mb-10">
          Featured Clinics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <img
                  src={`/clinic-${id}.jpg`}
                  alt="Clinic"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-1">Sunrise Medical Centre</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Nairobi, Kenya
                </p>
                <Button variant="secondary">Book Appointment</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
