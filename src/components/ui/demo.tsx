'use client';
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
// Lucide icons for the features
import { Shield as ShieldIcon, MapPin as MapPinIcon, Clock as ClockIcon, CreditCard as CreditCardIcon, Key as KeyIcon, Bell as BellIcon } from 'lucide-react';

const features = [
	{
		title: 'Minimal to No Security Deposit',
		icon: ShieldIcon,
		description: 'Enjoy stress-free rentals with the lowest security deposits in the market — and zero deposit on select models.',
	},
	{
		title: 'Delivery Anywhere in Dubai',
		icon: MapPinIcon,
		description: 'From your hotel to the helipad — we deliver your car wherever you are, right on time.',
	},
	{
		title: 'Speed Meets Simplicity',
		icon: ClockIcon,
		description: 'Book a car in under 60 seconds. Lightning-fast, hassle-free, and mobile-first.',
	},
	{
		title: 'No Hidden Fees. Ever.',
		icon: CreditCardIcon,
		description: 'Transparent pricing with no surprises — what you see is what you pay.',
	},
	{
		title: 'Exclusive Fleet Access',
		icon: KeyIcon,
		description: 'Access rare supercars, elite SUVs, and chauffeur-class vehicles that aren\'t listed elsewhere.',
	},
	{
		title: 'Premium Concierge',
		icon: BellIcon,
		description: 'Personal concierge services available 24/7 to ensure your experience is nothing short of extraordinary.',
	},
];

export default function DemoOne() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto w-full max-w-5xl space-y-8 px-4">
				<AnimatedContainer className="mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
						Experience the <span className="text-primary">Elite Selection</span>
					</h2>
					<p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
						Premium service for discerning clients who expect nothing but the best.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
} 