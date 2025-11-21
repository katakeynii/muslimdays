import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Event } from '../types/calendar';

interface TimeDisplayProps {
    showMinutes?: boolean;
    showSeconds?: boolean;
    highlightCurrentHour?: boolean;
    events?: Event[];
}

interface EventWithPosition extends Event {
    startPosition: number;
    duration: number;
    height: number;
    color: any;
    durationText: string;
    isShortEvent: boolean;
    columnIndex: number;
    totalColumns: number;
}

export default function TimeDisplay({
    showMinutes = true,
    showSeconds = true,
    highlightCurrentHour = true,
    events = []
}: TimeDisplayProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();

    useEffect(() => {
        // Rafraîchir l'heure toutes les minutes
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60000ms = 1 minute

        // Nettoyer l'intervalle quand le composant est démonté
        return () => clearInterval(interval);
    }, []);

    // Générer les heures de 00h à 23h
    const generateHours = () => {
        const hours = [];
        for (let hour = 0; hour < 24; hour++) {
            const isCurrentHour = hour === currentHour;
            const timeString = `${hour.toString().padStart(2, '0')}:00`;

            hours.push({
                hour,
                timeString,
                isCurrentHour
            });
        }
        return hours;
    };

    const hours = generateHours();

    // Formater l'heure actuelle
    const formatCurrentTime = () => {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const secondString = showSeconds ? `:${currentSecond.toString().padStart(2, '0')}` : '';
        return timeString + secondString;
    };

    // Calculer la position de l'heure actuelle
    const minutes = (currentHour * 60) + currentMinute;
    const minuteToPx = 1.5;
    const minutesToAddInPx = (minutes * minuteToPx) - 7.5;

    // Fonction pour calculer la position d'un événement
    const calculateEventPosition = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const totalMinutes = (hours * 60) + minutes;
        return totalMinutes * minuteToPx;
    };

    // Fonction pour calculer la durée d'un événement
    const calculateEventDuration = (startTime: string, endTime: string) => {
        if (!endTime) return 60; // Durée par défaut d'1 heure

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startTotalMinutes = (startHours * 60) + startMinutes;
        const endTotalMinutes = (endHours * 60) + endMinutes;

        return Math.max(endTotalMinutes - startTotalMinutes, 5); // Minimum 5 minutes
    };

    // Fonction pour obtenir une couleur basée sur le titre de l'événement
    const getEventColor = (title: string) => {
        const colors = [
            { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-800' },
            { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-800' },
            { bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-800' },
            { bg: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-800' },
            { bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-800' },
            { bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-800' },
        ];

        const index = title.length % colors.length;
        return colors[index];
    };

    // Fonction pour formater la durée de manière lisible
    const formatDuration = (startTime: string, endTime: string) => {
        if (!endTime) return '';

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startTotalMinutes = (startHours * 60) + startMinutes;
        const endTotalMinutes = (endHours * 60) + endMinutes;
        const durationMinutes = endTotalMinutes - startTotalMinutes;

        if (durationMinutes < 60) {
            return `${durationMinutes}min`;
        } else {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            if (minutes === 0) {
                return `${hours}h`;
            } else {
                return `${hours}h${minutes.toString().padStart(2, '0')}`;
            }
        }
    };

    // Fonction pour détecter les chevauchements et assigner les colonnes
    const processOverlappingEvents = (events: Event[]): EventWithPosition[] => {
        const processedEvents: EventWithPosition[] = [];

        // Trier les événements par heure de début
        const sortedEvents = [...events].sort((a, b) => {
            const aTime = calculateEventPosition(a.startTime);
            const bTime = calculateEventPosition(b.startTime);
            return aTime - bTime;
        });

        // Grouper les événements qui se chevauchent
        const overlappingGroups: Event[][] = [];
        let currentGroup: Event[] = [];

        sortedEvents.forEach(event => {
            const eventStart = calculateEventPosition(event.startTime);
            const eventEnd = eventStart + calculateEventDuration(event.startTime, event.endTime) * minuteToPx;

            // Vérifier si l'événement chevauche avec le groupe actuel
            let overlaps = false;
            for (const groupEvent of currentGroup) {
                const groupEventStart = calculateEventPosition(groupEvent.startTime);
                const groupEventEnd = groupEventStart + calculateEventDuration(groupEvent.startTime, groupEvent.endTime) * minuteToPx;

                if (eventStart < groupEventEnd && eventEnd > groupEventStart) {
                    overlaps = true;
                    break;
                }
            }

            if (overlaps) {
                currentGroup.push(event);
            } else {
                if (currentGroup.length > 0) {
                    overlappingGroups.push([...currentGroup]);
                }
                currentGroup = [event];
            }
        });

        if (currentGroup.length > 0) {
            overlappingGroups.push(currentGroup);
        }

        // Assigner les colonnes pour chaque groupe
        overlappingGroups.forEach(group => {
            group.forEach((event, index) => {
                const startPosition = calculateEventPosition(event.startTime);
                const duration = calculateEventDuration(event.startTime, event.endTime);
                const height = Math.max(duration * minuteToPx, 25);
                const color = getEventColor(event.title);
                const durationText = formatDuration(event.startTime, event.endTime);
                const isShortEvent = duration < 30;

                processedEvents.push({
                    ...event,
                    startPosition,
                    duration,
                    height,
                    color,
                    durationText,
                    isShortEvent,
                    columnIndex: index,
                    totalColumns: group.length
                });
            });
        });

        return processedEvents;
    };

    const processedEvents = processOverlappingEvents(events);

    return (
        <View className="flex-1  h-screen">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-row">
                    {/* Colonne des heures (gauche) */}
                    <View className="w-16 bg-gray-50 border-r border-gray-300">
                        {hours.map(({ hour, timeString, isCurrentHour }) => (
                            <View
                                key={hour}
                                className={`h-[90px] border-b border-gray-200 p-2 justify-center ${isCurrentHour && highlightCurrentHour ? 'bg-emerald-50' : ''
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-medium text-center ${isCurrentHour && highlightCurrentHour
                                        ? 'text-emerald-700'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    {timeString}
                                </Text>
                                {showSeconds && (
                                    <Text
                                        className={`text-xs mt-1 text-center ${isCurrentHour && highlightCurrentHour
                                            ? 'text-emerald-500'
                                            : 'text-gray-400'
                                            }`}
                                    >
                                        {hour.toString().padStart(2, '0')}:00:00
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Colonne des événements (droite) */}
                    <View className="flex-1 relative">
                        {/* Indicateur de l'heure actuelle */}
                        {highlightCurrentHour && (
                            <View
                                className="absolute z-30 h-[15px] left-0 w-full flex-row items-center justify-between"
                                style={{ top: minutesToAddInPx, zIndex: 50, height: 15 }}
                            >
                                <Text className="bg-emerald-900 px-2 rounded-lg text-emerald-500 text-xs">
                                    {formatCurrentTime()}
                                </Text>
                                <View className="w-full h-[2px] bg-emerald-900" />
                            </View>
                        )}

                        {/* Grille de fond pour les heures */}
                        {hours.map(({ hour, isCurrentHour }) => (
                            <View
                                key={hour}
                                className={`h-[90px] border-b  border-gray-300 ${isCurrentHour && highlightCurrentHour ? 'bg-emerald-50' : ''
                                    }`}
                            />
                        ))}

                        {/* Affichage des événements */}
                        {processedEvents.map((event) => {
                            const leftOffset = event.columnIndex * (100 / event.totalColumns);
                            const eventWidth = event.totalColumns > 1 ? 100 / event.totalColumns - 2 : 92; // 92% pour laisser 8% de marge
                            const isOverlapping = event.totalColumns > 1;
                            const isVeryNarrow = eventWidth < 20; // Très étroit si moins de 20% de largeur

                            return (
                                <View
                                    key={event.id}
                                    className={`absolute rounded-lg ${event.color.bg} border-l-4 ${event.color.border} ${isOverlapping ? 'p-1' : event.isShortEvent ? 'p-1' : 'p-2'
                                        }`}
                                    style={{
                                        top: event.startPosition,
                                        height: event.height,
                                        left: `${leftOffset}%`,
                                        width: `${eventWidth}%`,
                                        marginHorizontal: event.totalColumns > 1 ? 2 : 8,
                                        zIndex: 40,
                                    }}
                                >
                                    {/* Titre de l'événement */}
                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            className={`font-semibold ${event.color.text} ${isVeryNarrow ? 'text-[10px]' :
                                                isOverlapping ? 'text-xs' :
                                                    event.isShortEvent ? 'text-xs' : 'text-sm'
                                                }`}
                                            numberOfLines={isVeryNarrow ? 1 : 2}
                                        >
                                            {event.title}
                                        </Text>
                                        {event.isActive && !isVeryNarrow && (
                                            <View className="w-2 h-2 rounded-full bg-emerald-500" />
                                        )}
                                    </View>

                                    {/* Description - seulement si pas trop étroit et pas d'événement court */}
                                    {!isVeryNarrow && !event.isShortEvent && event.description && !isOverlapping && (
                                        <Text className={`text-xs mt-1 ${event.color.text} opacity-80`} numberOfLines={2}>
                                            {event.description}
                                        </Text>
                                    )}

                                    {/* Heures et durée - format compact pour les événements qui se chevauchent */}
                                    <View className={`flex-row items-center justify-between mt-1 ${isVeryNarrow ? 'flex-col items-start' : ''
                                        }`}>
                                        <Text
                                            className={`${event.color.text} opacity-60 ${isVeryNarrow ? 'text-[8px]' : 'text-xs'
                                                }`}
                                            numberOfLines={1}
                                        >
                                            {isVeryNarrow ?
                                                `${event.startTime}` :
                                                `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`
                                            }
                                        </Text>
                                        {event.durationText && !isVeryNarrow && (
                                            <Text className={`text-xs ${event.color.text} opacity-70 font-medium`}>
                                                {event.durationText}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Indicateur de durée pour les événements très étroits */}
                                    {isVeryNarrow && event.durationText && (
                                        <Text className={`text-[8px] ${event.color.text} opacity-70 font-medium mt-1`}>
                                            {event.durationText}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function nearestMultipleOf5(n: number) {
    if (n < 0 || n > 59) return 0;
    return Math.round(n / 5) * 5;
}