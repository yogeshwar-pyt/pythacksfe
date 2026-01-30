import React from 'react';

interface CircleProgressProps {
  percentage?: number;
  totalTickets?: number;
  closedTickets?: number;
  mode?: 'percentage' | 'tickets';
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  totalTickets = 0,
  closedTickets,
  mode = 'percentage',
}) => {
  const radius = 20;
  const strokeWidth = 7;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let progressPercentage: number;
  if (mode === 'percentage') {
    progressPercentage = percentage || 0;
  } else if (totalTickets !== undefined && closedTickets !== undefined) {
    progressPercentage =
      totalTickets === 0 ? 0 : (closedTickets / totalTickets) * 100;
  } else {
    progressPercentage = 0;
  }

  const strokeDashoffset =
    circumference - (circumference * progressPercentage) / 100;

  return (
    <svg height="48px" width="48px" style={{ flexShrink: 0 }}>
      <circle
        stroke="#E2E8F0"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={24}
        cy={24}
      />

      <circle
        stroke="#16A34A"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
          strokeDashoffset,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
        r={normalizedRadius}
        cx={24}
        cy={24}
      />
    </svg>
  );
};

export default CircleProgress;
