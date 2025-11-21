import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsrIcon from '../assets/muslim-icons/asr.svg';
import IshaIcon from '../assets/muslim-icons/isha.svg';
import MaghrebIcon from '../assets/muslim-icons/maghreb.svg';
import SubhIcon from '../assets/muslim-icons/subh.svg';
import ZuhrIcon from '../assets/muslim-icons/zuhr.svg';
import { PrayerSchedule } from '../lib/astro';
import { getCurrentPrayer, getNextPrayer, getTimeUntilNextPrayer } from '../services/prayerTimes';
import { formatDuration } from '../utils/time';

interface HeaderSectionProps {
    schedule: PrayerSchedule;
}

export default function HeaderSection({ schedule }: HeaderSectionProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeUntilNext, setTimeUntilNext] = useState<{
        prayer: string;
        timeRemaining: number;
    } | null>(null);

    const currentPrayer = getCurrentPrayer(schedule);
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            setTimeUntilNext(getTimeUntilNextPrayer(schedule));
        }, 1000);

        return () => clearInterval(timer);
    }, [schedule]);


    const prayerDisplayNames = {
        fajr: 'Subh',
        dhuhr: 'Zuhr',
        asr: 'Asr',
        maghrib: 'Maghreb',
        isha: 'Isha'
    };

    const getPrayerIcon = (prayerName: string) => {
        let iconSize = 48
        const iconMap: { [key: string]: React.ReactNode } = {
            fajr: <SubhIcon width={iconSize} height={iconSize} color="#374151" />,
            dhuhr: <ZuhrIcon width={iconSize} height={iconSize} color="#374151" />,
            asr: <AsrIcon width={iconSize} height={iconSize} color="#374151" />,
            maghrib: <MaghrebIcon width={iconSize} height={iconSize} color="#374151" />,
            isha: <IshaIcon width={iconSize} height={iconSize} color="#374151" />
        };
        return iconMap[prayerName] || <SubhIcon width={iconSize} height={iconSize} color="#374151" />;
    };

    const getCompletedPrayersCount = () => {
        const currentPrayer = getCurrentPrayer(schedule);
        if (!currentPrayer) return 0;
        const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const currentIndex = prayerOrder.indexOf(currentPrayer.name);
        return Math.max(0, currentIndex);
    };

    const completedPrayers = getCompletedPrayersCount();
    const nextPrayer = getNextPrayer(schedule);
    // console.log(nextPrayer);
    // console.log(schedule);

    return (
        <View className="mt-4">
            {/* Dates en haut à gauche */}
            <View className="flex justify-center items-center w-full " >
                {/* <Text className="text-gray-700 text-sm">
                    {formatIslamicDate(currentTime)}
                </Text> */}
                <Text className="text-gray-700 text-sm">
                    {currentTime.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>
                {timeUntilNext && (
                    <View className='flex flex-row items-center gap-2'>
                        <Text className="text-gray-800 text-xl font-bold">
                            {prayerDisplayNames[timeUntilNext.prayer as keyof typeof prayerDisplayNames]}
                        </Text>
                        <Text className="text-gray-800 text-xl">
                            dans {formatDuration(timeUntilNext.timeRemaining)}.
                        </Text>
                    </View>
                )}
            </View>

            {/* Section principale avec prochaine prière et progrès */}
            <View className="flex-row justify-between items-center">
                {/* Prochaine prière */}
                <View className="flex-1">

                    <View className="flex-row items-center justify-between">

                        {/* {currentPrayer && (
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-2">Prière en cours</Text>
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        {getPrayerIcon(currentPrayer.name)}
                                    </View>
                                    <View>
                                        <Text className="text-gray-800 text-2xl font-bold">
                                            {prayerDisplayNames[currentPrayer.name as keyof typeof prayerDisplayNames]}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            Fin: {formatDuration(getRemainingTime(schedule, currentPrayer.name))}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )} */}
                        {/* {timeUntilNext && (
                            <View className="mb-4">
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        {getPrayerIcon(timeUntilNext.prayer)}
                                    </View>
                                    <View>
                                        <Text className="text-gray-700 text-sm">Prochaine prière</Text>
                                        <Text className="text-gray-800 text-xl font-bold">
                                            {prayerDisplayNames[timeUntilNext.prayer as keyof typeof prayerDisplayNames]}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            d&apos;ici {formatDuration(timeUntilNext.timeRemaining)}.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )} */}
                    </View>
                </View>

                {/* Progrès des prières */}
                {/* <View className="items-end">
                    <Text className="text-gray-700 text-sm mb-1">Aujourd&apos;hui</Text>
                    <Text className="text-gray-800 text-3xl font-bold">
                        {completedPrayers}/5
                    </Text>
                </View> */}
            </View>
        </View>
    );
} 