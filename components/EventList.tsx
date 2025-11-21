import { ScrollView, Text, View } from 'react-native';
import { Event, EventListProps } from '../types/calendar';

export default function EventList({ events }: EventListProps) {
    const renderEvent = (event: Event) => (
        <View
            key={event.id}
            className={`flex-row items-start mb-4 ${event.isActive ? 'bg-emerald-600 rounded-lg p-3' : ''
                }`}
        >
            {/* Timeline circle */}
            <View className="mr-3 mt-1">
                <View
                    className={`w-3 h-3 rounded-full ${event.isActive
                        ? 'bg-white border-2 border-emerald-600'
                        : 'bg-gray-400'
                        }`}
                />
            </View>

            {/* Event content */}
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className="text-gray-600 text-sm mr-2">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                    </Text>
                </View>
                <Text
                    className={`font-semibold mb-1 ${event.isActive ? 'text-white' : 'text-gray-800'
                        }`}
                >
                    {event.title}
                </Text>
                <Text
                    className={`text-sm ${event.isActive ? 'text-white' : 'text-gray-600'
                        }`}
                >
                    {event.description}
                </Text>
            </View>
        </View>
    );

    return (
        <ScrollView className="flex-1">
            {/* Séparateur */}
            <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
                <Text className="text-gray-800 font-semibold">Today</Text>
                <Text className="text-gray-600">{events.length} events</Text>
            </View>

            {/* Liste des événements */}
            <View className="px-4 py-4">
                {events.map(renderEvent)}
            </View>
        </ScrollView>
    );
} 