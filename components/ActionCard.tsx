import { Check, Clock, Link, Repeat, Calendar as CalendarIcon } from 'lucide-react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Action } from '../types';

interface ActionCardProps {
    action: Action;
    onToggleCompletion: (id: string) => void;
    showObjectiveLink?: boolean;
}

export default function ActionCard({ action, onToggleCompletion, showObjectiveLink = false }: ActionCardProps) {
    const router = useRouter();

    const formatTime = (date: Date) => {
        return format(date, 'HH:mm', { locale: fr });
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h${remainingMinutes}min`;
    };

    const getRecurrenceIcon = (recurrence: string) => {
        switch (recurrence) {
            case 'daily': return Repeat;
            case 'weekly': return CalendarIcon;
            case 'monthly': return CalendarIcon;
            case 'yearly': return CalendarIcon;
            default: return CalendarIcon;
        }
    };

    const getRecurrenceLabel = (recurrence: string) => {
        switch (recurrence) {
            case 'daily': return 'Quotidien';
            case 'weekly': return 'Hebdomadaire';
            case 'monthly': return 'Mensuel';
            case 'yearly': return 'Annuel';
            default: return 'Une fois';
        }
    };

    return (
        <View className={`bg-white rounded-lg p-4 mb-3 border-l-4 ${action.isCompleted
                ? 'border-gray-300 opacity-60'
                : action.linkedObjectiveId
                    ? 'border-blue-500'
                    : 'border-green-500'
            }`}>
            {/* En-tête avec titre et checkbox */}
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                    <Text className={`font-semibold text-gray-900 ${action.isCompleted ? 'line-through' : ''
                        }`}>
                        {action.title}
                    </Text>
                    {action.description && (
                        <Text className={`text-sm text-gray-600 mt-1 ${action.isCompleted ? 'line-through' : ''
                            }`}>
                            {action.description}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => onToggleCompletion(action.id)}
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${action.isCompleted
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}
                >
                    {action.isCompleted && (
                        <Check size={16} color="white" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Informations temporelles */}
            <View className="flex-row items-center mb-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-1">
                    {formatTime(action.datetime)} • {formatDuration(action.duration)}
                </Text>

                {action.recurrence !== 'none' && (() => {
                    const IconComponent = getRecurrenceIcon(action.recurrence);
                    return (
                        <>
                            <IconComponent
                                size={16}
                                color="#6B7280"
                                style={{ marginLeft: 8 }}
                            />
                            <Text className="text-sm text-gray-600 ml-1">
                                {getRecurrenceLabel(action.recurrence)}
                            </Text>
                        </>
                    );
                })()}
            </View>

            {/* Lien vers l'objectif si applicable */}
            {showObjectiveLink && action.linkedObjectiveId && (
                <TouchableOpacity
                    onPress={() => router.push(`/objectives/${action.linkedObjectiveId}`)}
                    className="flex-row items-center mt-2"
                >
                    <Link size={14} color="#3B82F6" />
                    <Text className="text-sm text-blue-600 ml-1">
                        Voir l'objectif lié
                    </Text>
                </TouchableOpacity>
            )}

            {/* Indicateur de type d'action */}
            <View className="flex-row items-center mt-2">
                <View className={`px-2 py-1 rounded-full ${action.linkedObjectiveId
                        ? 'bg-blue-100'
                        : 'bg-green-100'
                    }`}>
                    <Text className={`text-xs font-medium ${action.linkedObjectiveId
                            ? 'text-blue-700'
                            : 'text-green-700'
                        }`}>
                        {action.linkedObjectiveId ? 'Action liée' : 'Événement libre'}
                    </Text>
                </View>
            </View>
        </View>
    );
} 