'use client'

import HeroSection from "@/components/sections/HeroSection";
import Features from "@/components/sections/Features";
import TrustedCompanies from "@/components/sections/TrustedCompanies";
import Testimonials from "@/components/sections/Testimonials";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";
import React from "react";

export default function Home() {
	return (
		<>
			<HeroSection />
			<Features />
			<TrustedCompanies />
			<Testimonials />
			<CallToAction />
			<Footer />
		</>
	)
}
