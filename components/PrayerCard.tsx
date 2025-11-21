import { Text, TouchableOpacity, View } from 'react-native';
import { PrayerTime } from '../lib/astro';
import { formatTime, isCurrentTimeBetween } from '../utils/time';


import AsrIcon from '../assets/muslim-icons/asr.svg';
import IshaIcon from '../assets/muslim-icons/isha.svg';
import MaghrebIcon from '../assets/muslim-icons/maghreb.svg';
import SubhIcon from '../assets/muslim-icons/subh.svg';
import ZuhrIcon from '../assets/muslim-icons/zuhr.svg';

interface PrayerCardProps {
    name: string;
    prayerTime: PrayerTime;
    isActive: boolean;
    isNext: boolean;
    onPress?: () => void;
}

const prayerNames = {
    fajr: 'Fajr',
    sunrise: 'Lever du soleil',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
};

const prayerEmojis = {
    fajr: <SubhIcon width={48} height={48} />,
    sunrise: <SubhIcon width={48} height={48} />,
    dhuhr: <ZuhrIcon width={48} height={48} />,
    asr: <AsrIcon width={48} height={48} />,
    maghrib: <MaghrebIcon width={48} height={48} />,
    isha: <IshaIcon width={48} height={48} />
};

export default function PrayerCard({
    name,
    prayerTime,
    isActive,
    isNext,
    onPress
}: PrayerCardProps) {
    const displayName = prayerNames[name as keyof typeof prayerNames] || name;
    const emoji = prayerEmojis[name as keyof typeof prayerEmojis] || '🕌';

    const isCurrentlyInRange = isCurrentTimeBetween(prayerTime.start, prayerTime.end);

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`p-4 rounded-xl mb-3 border ${isActive
                ? 'bg-blue-50 border-blue-300 shadow-lg'
                : isNext
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-white border-gray-200'
                }`}
            style={{
                shadowColor: isActive ? '#3B82F6' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.25 : 0.1,
                shadowRadius: 4,
                elevation: isActive ? 5 : 2,
            }}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-2xl mr-2">{emoji}</Text>
                        <Text
                            className={`text-lg font-semibold ${isActive ? 'text-blue-800' : 'text-gray-800'
                                }`}
                        >
                            {displayName}
                        </Text>
                        {isActive && (
                            <View className="ml-2 px-2 py-1 bg-blue-100 rounded-full">
                                <Text className="text-xs font-medium text-blue-700">
                                    En cours
                                </Text>
                            </View>
                        )}
                        {isNext && !isActive && (
                            <View className="ml-2 px-2 py-1 bg-orange-100 rounded-full">
                                <Text className="text-xs font-medium text-orange-700">
                                    Prochaine
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="mb-2">
                        <Text className="text-3xl font-bold text-gray-900">
                            {formatTime(prayerTime.time)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text className="text-sm text-gray-600 mr-4">
                            Plage: {formatTime(prayerTime.start)} - {formatTime(prayerTime.end)}
                        </Text>
                    </View>

                    {isCurrentlyInRange && !isActive && (
                        <View className="mt-2">
                            <Text className="text-xs text-green-600 font-medium">
                                ⏰ Période valide pour cette prière
                            </Text>
                        </View>
                    )}
                </View>

                <View className="items-end">
                    {isActive && (
                        <View className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
} 