import React from 'react';
import Badge, { IBadge } from './badge';

interface BadgeProps {
  badges: Array<IBadge>;
  onSelect?: any;
}

const BadgeList = ({ badges, onSelect }: BadgeProps) => {
  return (
    <div className="d-flex flex-wrap flex-row justify-content-left">
      {badges.map((q) => (
        <Badge key={q._id} {...q} onSelect={() => onSelect && onSelect(q)} />
      ))}
    </div>
  );
};

export default BadgeList;
