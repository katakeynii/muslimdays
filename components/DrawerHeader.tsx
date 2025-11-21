import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import colors from 'tailwindcss/colors';
import AsrIcon from '../assets/muslim-icons/asr.svg';
import IshaIcon from '../assets/muslim-icons/isha.svg';
import MaghrebIcon from '../assets/muslim-icons/maghreb.svg';
import SubhIcon from '../assets/muslim-icons/subh.svg';
import ZuhrIcon from '../assets/muslim-icons/zuhr.svg';
import { PrayerSchedule } from '../lib/astro';
import { getCurrentPrayer, getTimeUntilNextPrayer } from '../services/prayerTimes';
import { formatDuration } from '../utils/time';

interface DrawerHeaderProps {
    schedule: PrayerSchedule;
}

export default function DrawerHeader({ schedule }: DrawerHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const currentPrayer = getCurrentPrayer(schedule);
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const prayerDisplayNames = {
        fajr: 'Subh',
        dhuhr: 'Zuhr',
        asr: 'Asr',
        maghrib: 'Maghreb',
        isha: 'Isha'
    };

    const getPrayerIcon = (prayerName: string) => {
        const iconMap: { [key: string]: React.ReactNode } = {
            fajr: <SubhIcon width={20} height={20} color="#fff" />,
            dhuhr: <ZuhrIcon width={20} height={20} color="#fff" />,
            asr: <AsrIcon width={20} height={20} color="#fff" />,
            maghrib: <MaghrebIcon width={32} height={32} color="#fff" />,
            isha: <IshaIcon width={20} height={20} color="#fff" />
        };
        return iconMap[prayerName] || <SubhIcon width={20} height={20} color="#fff" />;
    };

    return (
        <LinearGradient
            colors={[colors.emerald[500], colors.emerald[700], colors.emerald[900]]}
            start={{ x: 0, y: -1 }}
            end={{ x: 1, y: 0 }}
            style={{
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
            }}
        >
            <View className="">
                {/* Logo */}
                <View className="items-center mb-2 flex-row gap-4 ">
                    <Image
                        source={require('../assets/icon.png')}
                        className="w-8 h-8 rounded-full"
                        style={{ width: 48, height: 48, borderRadius: 24 }}
                    />
                    <Text className="text-white   text-xl font-black">Zamanee</Text>
                </View>
                <View className="mb-4">
                    <Text className="text-white text-sm">
                        {currentTime.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </Text>
                    <Text className="text-white text-lg font-black">
                        {currentTime.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
                {timeUntilNext && (
                    <View className="mb-4">
                        <Text className="text-white  text-sm mb-2 ">Prochaine prière</Text>
                        <View className="flex-row items-center">
                            <View className="mr-3">
                                {getPrayerIcon(timeUntilNext.prayer)}
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-bold">
                                    {prayerDisplayNames[timeUntilNext.prayer as keyof typeof prayerDisplayNames]}
                                </Text>
                                <Text className="text-white text-sm">
                                    d&apos;ici {formatDuration(timeUntilNext.timeRemaining)}.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Date actuelle */}
            </View >
        </LinearGradient >
    );
} 