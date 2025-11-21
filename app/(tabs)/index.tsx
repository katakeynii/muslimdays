import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
    TouchableOpacity,
    View
} from 'react-native';
import colors from 'tailwindcss/colors';
import TimeDisplay from '../../components/TimeDisplay';
import { DayEvents } from '../../types/calendar';
import CalendarView from '../../components/CalendarView';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('17');
    const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

    // Données d'exemple avec des durées variées (courtes et longues)
    const eventsData: DayEvents[] = [
        {
            date: '17',
            events: [
                {
                    id: '1',
                    title: 'Pause café',
                    description: 'Petite pause de 5 minutes',
                    startTime: '08:30',
                    endTime: '08:35',
                },
                {
                    id: '2',
                    title: 'Réunion équipe',
                    description: 'Réunion quotidienne de 15 minutes',
                    startTime: '09:00',
                    endTime: '09:15',
                },
                {
                    id: '3',
                    title: 'Travail projet',
                    description: 'Développement du nouveau projet',
                    startTime: '09:30',
                    endTime: '12:30',
                },
                {
                    id: '4',
                    title: 'Pause déjeuner',
                    description: 'Déjeuner avec l\'équipe',
                    startTime: '12:30',
                    endTime: '13:30',
                },
                {
                    id: '5',
                    title: 'Appel client',
                    description: 'Appel de 45 minutes avec le client',
                    startTime: '14:00',
                    endTime: '14:45',
                },
                {
                    id: '6',
                    title: 'Tâche rapide',
                    description: 'Vérification emails (7 minutes)',
                    startTime: '15:00',
                    endTime: '15:07',
                },
                {
                    id: '7',
                    title: 'Appel client',
                    description: 'Appel avec le client principal',
                    startTime: '14:00',
                    endTime: '14:45',
                },
                {
                    id: '8',
                    title: 'Réunion équipe dev',
                    description: 'Réunion avec l\'équipe de développement',
                    startTime: '14:00',
                    endTime: '15:00',
                },
                {
                    id: '9',
                    title: 'Réunion équipe design',
                    description: 'Réunion avec l\'équipe de design',
                    startTime: '14:30',
                    endTime: '15:30',
                },
                {
                    id: '10',
                    title: 'Appel client urgent',
                    description: 'Appel de 15 minutes',
                    startTime: '14:45',
                    endTime: '15:00',
                },
                {
                    id: '11',
                    title: 'Tâche rapide',
                    description: 'Vérification emails',
                    startTime: '15:00',
                    endTime: '15:07',
                },
                {
                    id: '12',
                    title: 'Pause café',
                    description: 'Petite pause de 10 minutes',
                    startTime: '16:00',
                    endTime: '16:10',
                },
                {
                    id: '13',
                    title: 'Tâche administrative',
                    description: 'Gestion des emails',
                    startTime: '16:05',
                    endTime: '16:20',
                },
                {
                    id: '14',
                    title: 'Soirée détente',
                    description: 'Temps libre de 3h07',
                    startTime: '20:00',
                    endTime: '23:07',
                },
            ],
        },
        {
            date: '18',
            events: [
                {
                    id: '15',
                    title: 'Daily Workout',
                    description: 'Push up 10x, Squat 10x',
                    startTime: '07:00',
                    endTime: '08:00',
                },
                {
                    id: '16',
                    title: 'Work on a last project',
                    description: 'Continue the last UI project',
                    startTime: '09:00',
                    endTime: '17:00',
                },
                {
                    id: '17',
                    title: 'Buy a present',
                    description: 'At Pandora and Present shop',
                    startTime: '18:00',
                    endTime: '18:30',
                },
            ],
        },
    ];

    const currentEvents = eventsData.find(day => day.date === selectedDate)?.events || [];

    return (
        <View className=' flex-1 bg-white'>
            {/* Float Button */}
            <TouchableOpacity
                style={{
                    backgroundColor: colors.emerald[600],
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 40,
                    right: 30,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    zIndex: 9000
                }}
            >
                <Plus
                    size={28}
                    color="white"
                />
            </TouchableOpacity>

            <View className="flex-1 h-screen" >
                {/* Calendrier */}
                <CalendarView
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    isExpanded={isCalendarExpanded}
                    onToggleExpanded={() => setIsCalendarExpanded(!isCalendarExpanded)}
                />

                {/* Affichage des heures */}
                <TimeDisplay
                    showMinutes={true}
                    showSeconds={false}
                    highlightCurrentHour={true}
                    events={currentEvents}
                />

                {/* Bouton d'accès aux missions */}
                {/* <View className="px-4 py-2">
                    <MissionsButton />
                </View> */}

                {/* Bouton d'accès aux objectifs */}
                {/* <View className="px-4 py-2">
                    <ObjectivesButton />
                </View> */}

                {/* Bouton d'accès à l'agenda */}
                {/* <View className="px-4 py-2">
                    <ActionsButton />
                </View> */}

                {/* Liste des événements */}
                {/* <EventList events={currentEvents} /> */}
            </View>
        </View>
    );
} 