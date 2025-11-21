import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ActionCard from '../../../components/ActionCard';
import { useActions } from '../../../hooks';
import { Action } from '../../../types';

export default function AgendaScreen() {
    const router = useRouter();
    const { actions, toggleActionCompletion } = useActions();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [actionsForDate, setActionsForDate] = useState<Action[]>([]);

    // Mettre à jour les actions pour la date sélectionnée
    useEffect(() => {
        const targetDate = new Date(selectedDate);
        targetDate.setHours(0, 0, 0, 0);

        const filteredActions = actions.filter(action => {
            const actionDate = new Date(action.datetime);
            actionDate.setHours(0, 0, 0, 0);
            return actionDate.getTime() === targetDate.getTime();
        });

        // Trier par heure
        filteredActions.sort((a, b) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );

        setActionsForDate(filteredActions);
    }, [selectedDate, actions]);

    const handleToggleCompletion = async (actionId: string) => {
        try {
            await toggleActionCompletion(actionId);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de modifier le statut de l\'action');
        }
    };

    const goToPreviousDay = () => {
        setSelectedDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setSelectedDate(prev => addDays(prev, 1));
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const formatDate = (date: Date) => {
        return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    };

    const formatShortDate = (date: Date) => {
        return format(date, 'd MMM', { locale: fr });
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    };

    const getDayActions = (date: Date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return actions.filter(action => {
            const actionDate = new Date(action.datetime);
            actionDate.setHours(0, 0, 0, 0);
            return actionDate.getTime() === targetDate.getTime();
        });
    };

    // Générer les 7 jours autour de la date sélectionnée
    const getWeekDays = () => {
        const days = [];
        const startDate = subDays(selectedDate, 3);

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            days.push(day);
        }

        return days;
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* En-tête */}
            <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-xl font-bold text-gray-900">
                        Agenda
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/actions/create')}
                        className="bg-blue-500 px-4 py-2 rounded-lg"
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Sélecteur de date */}
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={goToPreviousDay}
                        className="p-2"
                    >
                        <ChevronLeft size={24} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={goToToday}
                        className={`px-4 py-2 rounded-lg ${isToday(selectedDate) ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                        <Text className={`font-semibold ${isToday(selectedDate) ? 'text-blue-700' : 'text-gray-700'}`}>
                            {formatDate(selectedDate)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={goToNextDay}
                        className="p-2"
                    >
                        <ChevronRight size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Mini calendrier */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    {getWeekDays().map((day, index) => {
                        const dayActions = getDayActions(day);
                        const hasActions = dayActions.length > 0;
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentDay = isToday(day);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedDate(day)}
                                className={`mx-1 px-3 py-2 rounded-lg items-center min-w-[50px] ${isSelected
                                        ? 'bg-blue-500'
                                        : isCurrentDay
                                            ? 'bg-blue-100'
                                            : 'bg-gray-100'
                                    }`}
                            >
                                <Text className={`text-xs font-medium ${isSelected
                                        ? 'text-white'
                                        : isCurrentDay
                                            ? 'text-blue-700'
                                            : 'text-gray-600'
                                    }`}>
                                    {format(day, 'EEE', { locale: fr })}
                                </Text>
                                <Text className={`text-sm font-bold ${isSelected
                                        ? 'text-white'
                                        : isCurrentDay
                                            ? 'text-blue-700'
                                            : 'text-gray-900'
                                    }`}>
                                    {format(day, 'd', { locale: fr })}
                                </Text>
                                {hasActions && (
                                    <View className={`w-2 h-2 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-blue-500'
                                        }`} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Contenu de l'agenda */}
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {actionsForDate.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-12">
                        <Calendar size={64} color="#D1D5DB" />
                        <Text className="text-lg font-semibold text-gray-500 mt-4">
                            Aucune action prévue
                        </Text>
                        <Text className="text-sm text-gray-400 text-center mt-2">
                            {formatDate(selectedDate)}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/actions/create')}
                            className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
                        >
                            <Text className="text-white font-semibold">
                                Créer une action
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-semibold text-gray-900">
                                {actionsForDate.length} action{actionsForDate.length > 1 ? 's' : ''} prévue{actionsForDate.length > 1 ? 's' : ''}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {formatDate(selectedDate)}
                            </Text>
                        </View>

                        {actionsForDate.map(action => (
                            <ActionCard
                                key={action.id}
                                action={action}
                                onToggleCompletion={handleToggleCompletion}
                                showObjectiveLink={true}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
} 