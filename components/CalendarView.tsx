import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarViewProps } from '../types/calendar';

export default function CalendarView({
    selectedDate,
    onDateSelect,
    isExpanded,
    onToggleExpanded,
}: CalendarViewProps) {
    const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    const [currentDate, setCurrentDate] = useState(new Date());

    const date = currentDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Fonction pour obtenir le premier jour du mois
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    // Fonction pour obtenir le dernier jour du mois
    const getLastDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    // Fonction pour obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    const getDayOfWeek = (date: Date) => {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1; // Convertir pour que lundi = 0
    };

    // Fonction pour générer les dates du calendrier
    const generateCalendarDates = () => {
        const firstDay = getFirstDayOfMonth(currentDate);
        const lastDay = getLastDayOfMonth(currentDate);
        const startDay = getDayOfWeek(firstDay);
        const daysInMonth = lastDay.getDate();

        const dates = [];

        // Ajouter les jours du mois précédent pour remplir la première semaine
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();

        for (let i = startDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            dates.push({
                day,
                isCurrentMonth: false,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
            });
        }

        // Ajouter les jours du mois actuel
        for (let day = 1; day <= daysInMonth; day++) {
            dates.push({
                day,
                isCurrentMonth: true,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            });
        }

        // Ajouter les jours du mois suivant pour remplir la dernière semaine
        const remainingDays = 42 - dates.length; // 6 semaines * 7 jours = 42
        for (let day = 1; day <= remainingDays; day++) {
            dates.push({
                day,
                isCurrentMonth: false,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
            });
        }

        return dates;
    };

    // Fonction pour naviguer vers le mois précédent
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Fonction pour naviguer vers le mois suivant
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Fonction pour formater la date en string pour la comparaison
    const formatDateForComparison = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Fonction pour vérifier si une date est aujourd'hui
    const isToday = (date: Date) => {
        const today = new Date();
        return formatDateForComparison(date) === formatDateForComparison(today);
    };

    const renderFullCalendar = () => {
        const calendarDates = generateCalendarDates();

        return (
            <View className="bg-white p-4 border-b border-gray-200">
                {/* En-tête avec navigation */}
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={goToPreviousMonth}>
                        <ChevronLeft size={20} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-gray-800 text-lg font-semibold">
                        {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </Text>
                    <TouchableOpacity onPress={goToNextMonth}>
                        <ChevronRight size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Jours de la semaine */}
                <View className="flex-row mb-2">
                    {days.map((day, index) => (
                        <View key={index} className="flex-1 items-center">
                            <Text className="text-gray-600 text-xs">{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Grille du calendrier */}
                <View className="flex-row flex-wrap">
                    {calendarDates.map((dateObj, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-[14.28%] h-10 items-center justify-center ${formatDateForComparison(dateObj.date) === selectedDate
                                ? 'bg-emerald-600 rounded-full'
                                : isToday(dateObj.date)
                                    ? 'bg-emerald-100 rounded-full'
                                    : ''
                                }`}
                            onPress={() => onDateSelect(formatDateForComparison(dateObj.date))}
                        >
                            <Text
                                className={`text-sm ${formatDateForComparison(dateObj.date) === selectedDate
                                    ? 'text-white'
                                    : isToday(dateObj.date)
                                        ? 'text-emerald-600 font-semibold'
                                        : dateObj.isCurrentMonth
                                            ? 'text-gray-800'
                                            : 'text-gray-400'
                                    }`}
                            >
                                {dateObj.day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bouton pour réduire le calendrier */}
                <TouchableOpacity
                    className="items-center mt-2"
                    onPress={onToggleExpanded}
                >
                    <ChevronDown size={20} color="#374151" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderCollapsedCalendar = () => {
        const today = new Date();
        const currentWeekDates = [];

        // Obtenir le lundi de la semaine actuelle
        const monday = new Date(today);
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        monday.setDate(today.getDate() - daysToMonday);

        // Générer les 7 jours de la semaine
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            currentWeekDates.push({
                day: date.getDate(),
                date: date,
                isToday: formatDateForComparison(date) === formatDateForComparison(today)
            });
        }

        return (
            <View className="bg-white p-4 border-b border-gray-200">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-800 text-lg font-semibold">
                        {today.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }).toUpperCase()}
                    </Text>
                    <TouchableOpacity>
                        <MoreVertical size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Jours de la semaine */}
                <View className="flex-row mb-2">
                    {days.map((day, index) => (
                        <View key={index} className="flex-1 items-center">
                            <Text className="text-gray-600 text-xs">{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Semaine réduite */}
                <View className="flex-row flex-wrap mb-2">
                    {currentWeekDates.map((dateObj, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-[14.28%] h-10 items-center justify-center ${formatDateForComparison(dateObj.date) === selectedDate
                                ? 'bg-emerald-600 rounded-full'
                                : dateObj.isToday
                                    ? 'bg-emerald-100 rounded-full'
                                    : ''
                                }`}
                            onPress={() => onDateSelect(formatDateForComparison(dateObj.date))}
                        >
                            <Text
                                className={`text-sm ${formatDateForComparison(dateObj.date) === selectedDate
                                    ? 'text-white'
                                    : dateObj.isToday
                                        ? 'text-emerald-600 font-semibold'
                                        : 'text-gray-800'
                                    }`}
                            >
                                {dateObj.day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bouton pour étendre le calendrier */}
                <TouchableOpacity
                    className="items-center"
                    onPress={onToggleExpanded}
                >
                    <ChevronUp size={20} color="#374151" />
                </TouchableOpacity>
            </View>
        );
    };

    return isExpanded ? renderFullCalendar() : renderCollapsedCalendar();
} 