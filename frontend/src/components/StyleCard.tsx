"use client";

interface StyleCardProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    gradientClass: string;
    badge?: string;
    badgeClass?: string;
    selected?: boolean;
    onSelect: (id: string) => void;
}

export default function StyleCard({
    id,
    name,
    description,
    icon,
    gradientClass,
    badge,
    badgeClass,
    selected,
    onSelect
}: StyleCardProps) {
    return (
        <div
            className={`style-card ${selected ? 'selected' : ''}`}
            onClick={() => onSelect(id)}
        >
            <div className={`style-card-img ${gradientClass}`}>
                {icon}
            </div>
            <div className="style-card-overlay">
                <div className="style-card-name">{name}</div>
                <div className="style-card-sub">{description}</div>
            </div>
            {badge && (
                <div className={`style-card-badge ${badgeClass}`}>
                    {badge}
                </div>
            )}
        </div>
    );
}
