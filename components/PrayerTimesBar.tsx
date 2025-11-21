import { Text, View } from 'react-native';

// Only works in Node, not directly in React Native code!
import { LinearGradient } from "expo-linear-gradient";
import { SvgProps } from 'react-native-svg';
import { getCurrentPrayer } from 'services/prayerTimes';
import colors from 'tailwindcss/colors';
import AsrIcon from '../assets/muslim-icons/asr.svg';
import IshaIcon from '../assets/muslim-icons/isha.svg';
import MaghrebIcon from '../assets/muslim-icons/maghreb.svg';
import SubhIcon from '../assets/muslim-icons/subh.svg';
import ZuhrIcon from '../assets/muslim-icons/zuhr.svg';
import { PrayerSchedule } from '../lib/astro';
import { formatTime } from '../utils/time';

interface PrayerTimesBarProps {
    schedule: PrayerSchedule;
}

export default function PrayerTimesBar({ schedule }: PrayerTimesBarProps) {
    const prayers = [
        { key: 'fajr', name: 'Subh', Icon: SubhIcon },
        { key: 'dhuhr', name: 'Zuhr', Icon: ZuhrIcon },
        { key: 'asr', name: 'Asr', Icon: AsrIcon },
        { key: 'maghrib', name: 'Maghreb', Icon: MaghrebIcon },
        { key: 'isha', name: 'Isha', Icon: IshaIcon }
    ];


    return (
        <LinearGradient
            colors={[colors.black, colors.emerald[900]]}
            start={{ x: 0, y: -1 }}
            end={{ x: 1, y: -2 }}
            style={{
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
            }}
        >
            <View className=" rounded-lg p-5">
                <View className="flex-row justify-between items-center">
                    {prayers.map((prayer, index) => (
                        <PrayerTimeBarItem key={prayer.key} prayer={prayer} schedule={schedule} index={index} />
                    ))}
                </View>
            </View>
        </LinearGradient>
    );
}
const PrayerTimeBarItem = ({ prayer, schedule, index }: { prayer: { key: string, name: string, Icon: React.FC<SvgProps> }, schedule: PrayerSchedule, index: number }) => {
    const currentPrayer = getCurrentPrayer(schedule);
    // const nextPrayer = getNextPrayer(schedule);

    const isCurrentPrayer = currentPrayer?.name === prayer.key;
    // const isNextPrayer = nextPrayer?.name === prayer.key;
    return (
        <View key={prayer.key} className="items-center flex-1">
            {/* Icône */}
            <View className="mb-2">
                <prayer.Icon width={24} height={24} color={isCurrentPrayer ? colors.emerald[500] : 'white'} />
            </View>

            {/* Nom de la prière */}
            <Text className={`text-white text-xs font-semibold mb-1 ${isCurrentPrayer ? 'text-emerald-300' : ''}`}>
                {prayer.name}
            </Text>

            {/* Heure */}
            <Text className={`text-white text-sm font-bold ${isCurrentPrayer ? 'text-emerald-300' : ''}`}>
                {formatTime(schedule[prayer.key as keyof PrayerSchedule].time)}
            </Text>
            <View className={`w-2 h-2  rounded-full animate-pulse ${isCurrentPrayer ? 'bg-emerald-300' : 'bg-transparent'}`} />
        </View>
    );
}