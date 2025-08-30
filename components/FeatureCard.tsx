import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({
  title,
  description,
  Icon,
  delay,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
  delay: number;
}) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="absolute inset-0 bg-[--brand] rounded-lg transform -skew-y-3" />
    <div className="relative bg-white p-6 rounded-lg shadow-xl">
      <div className="w-12 h-12 bg-[--brand] rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

export default FeatureCard;
