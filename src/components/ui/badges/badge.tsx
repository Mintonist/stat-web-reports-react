import React from 'react';

export interface IBadge {
  _id: string;
  icon?: string;
  badgeClass?: string;
  color?: string;
  title?: string;
}

interface BadgeProps extends IBadge {
  onSelect?: any;
}

const Badge = ({ icon = null, color = null, badgeClass = '', title = null, onSelect = null }: BadgeProps) => {
  return (
    <div
      role={onSelect ? 'button' : ''}
      className="d-flex flex-column justify-content-center me-2"
      onDoubleClick={() => onSelect && onSelect()}
    >
      <span
        className={'badge text-body align-middle ' + badgeClass}
        style={
          color
            ? {
                backgroundColor: color + 'AA',
                border: '2px solid ' + color,
              }
            : {
                backgroundColor: '#FFF',
                border: '2px solid #CCC',
              }
        }
      >
        {title ? title : ''}
      </span>
      {icon && <img src={icon} alt="" width="24" height="24" className="d-inline-block align-text-top m-0 p-0" />}
    </div>
  );
};

export default Badge;
