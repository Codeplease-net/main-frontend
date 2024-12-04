import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {   
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';

const HexagonPawIcon = ({ color, className }: { color: string; className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" fill={color} />
      <path d="M35 40 Q40 30 45 40 Q50 30 55 40 Q60 30 65 40 Q70 50 65 60 Q50 80 35 60 Q30 50 35 40" fill="white" />
    </svg>
)

const getIconColor = (rank: number) => {
    switch (rank) {
        case 1: return "#FFD700" // Gold
        case 2: return "#C0C0C0" // Silver
        case 3: return "#CD7F32" // Bronze
        default: return "#6b7280" // Default gray
    }
}

interface Performer {
    id: string;
    name: string;
    avatar: string;
    problem: any;
    rank: number;
    totalScore: number;
}

export default function TopPerformers({ topPerformers }: { topPerformers: Performer[] }) {
    return (
        <>
        
        <div className='flex flex-col justify-center items-center'>
            <div className='relative w-40 h-40'>
                <HexagonPawIcon color={getIconColor(topPerformers[0].rank)} className="w-full h-full absolute" />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center transform translate-x-1.5">
                </div>
            </div>
            <div className='flex transform'>
                <div className='relative w-40 h-40'>
                    <HexagonPawIcon color={getIconColor(topPerformers[1].rank)} className="w-full h-full absolute" />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center transform translate-x-1.5">
                    </div>
                </div>
                <div className='relative w-40 h-40'>
                    <HexagonPawIcon color={getIconColor(topPerformers[2].rank)} className="w-full h-full absolute" />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center transform translate-x-1.5">
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}