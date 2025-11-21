import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { PrayerSchedule } from '../lib/astro';
import { getTimeUntilNextPrayer } from '../services/prayerTimes';
import { formatDurationShort, formatTime } from '../utils/time';

interface CurrentTimeDisplayProps {
    schedule: PrayerSchedule;
}

export default function CurrentTimeDisplay({ schedule }: CurrentTimeDisplayProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeUntilNext, setTimeUntilNext] = useState<{
        prayer: string;
        timeRemaining: number;
    } | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            setTimeUntilNext(getTimeUntilNextPrayer(schedule));
        }, 1000);

        return () => clearInterval(timer);
    }, [schedule]);

    const prayerNames = {
        fajr: 'Fajr',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha'
    };

    const prayerEmojis = {
        fajr: '🌅',
        dhuhr: '☀️',
        asr: '🌤️',
        maghrib: '🌆',
        isha: '🌙'
    };

    return (
        <View className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl mb-6">
            <View className="items-center">
                {/* Heure actuelle */}
                <Text className="text-black text-4xl font-bold mb-2">
                    {formatTime(currentTime)}
                </Text>

                <Text className="text-black text-lg mb-4">
                    {currentTime.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>

                {/* Prochaine prière */}
                {timeUntilNext && (
                    <View className="bg-black bg-opacity-20 p-4 rounded-xl w-full">
                        <Text className="text-white text-center text-lg font-semibold mb-2">
                            Prochaine prière
                        </Text>

                        <View className="flex-row items-center justify-center mb-2">
                            <Text className="text-2xl mr-2">
                                {prayerEmojis[timeUntilNext.prayer as keyof typeof prayerEmojis]}
                            </Text>
                            <Text className="text-white text-xl font-bold">
                                {prayerNames[timeUntilNext.prayer as keyof typeof prayerNames]}
                            </Text>
                        </View>

                        <Text className="text-blue-100 text-center text-sm">
                            Dans {formatDurationShort(timeUntilNext.timeRemaining)}
                        </Text>

                        <Text className="text-blue-100 text-center text-sm mt-1">
                            à {formatTime(schedule[timeUntilNext.prayer as keyof PrayerSchedule].time)}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}