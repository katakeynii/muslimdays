import { Menu, Calendar, Flag, X, LogOut } from 'lucide-react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerNavigationProp, useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import DrawerHeader from 'components/DrawerHeader';
import { Drawer, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Alert, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';
import { PrayerSchedule } from '../../lib/astro';
import { getDakarLocation } from '../../services/locationService';
import { getPrayerSchedule } from '../../services/prayerTimes';
import { useAuth } from '../../contexts/AuthContext';

export default function TabsLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                initialRouteName="index"
                screenOptions={({ navigation }) => ({
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ paddingHorizontal: 16 }}>
                            <Menu size={32} color="#000000" />
                        </TouchableOpacity>
                    ),
                    drawerActiveTintColor: 'green',
                    drawerItemStyle: {
                        borderRadius: 0,
                    },
                    drawerLabelStyle: {
                        color: 'green',
                    },
                    drawerStyle: {
                        backgroundColor: '#f8fafc',
                    },
                })}
                drawerContent={CustomDrawerContent}
            >
                <Drawer.Screen name="index" options={{
                    drawerLabel: 'Calendrier',
                    drawerIcon: () => <Calendar size={24} color="#374151" />,
                    headerTitle: 'Calendrier',
                }} />

                <Drawer.Screen name="prayers/index" options={{
                    drawerLabel: 'Mes prières',
                    drawerIcon: () => <Flag size={24} color="#374151" />,
                    headerTitle: 'La prière',
                }} />
                {/* Écran des missions */}
                <Drawer.Screen name="missions" options={{
                    drawerLabel: 'Mes Missions',
                    drawerIcon: () => <Flag size={24} color="#374151" />,
                    headerTitle: 'Mes Missions de Vie',
                }} />

                <Drawer.Screen name="objectives" options={{
                    drawerLabel: 'Mes objectifs',
                    drawerIcon: () => <Flag size={24} color="#374151" />,
                    headerTitle: 'Mes objectifs',
                }} />

                <Drawer.Screen name="actions" options={{
                    drawerLabel: 'Mes Actions',
                    drawerIcon: () => <Flag size={24} color="#374151" />,
                    headerTitle: 'Mes Actions',
                }} />

            </Drawer>
        </GestureHandlerRootView>
    );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();
    const { signOut, user } = useAuth();
    const isDrawerOpen = useDrawerStatus() === 'open';
    const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const location = getDakarLocation();
                const prayerSchedule = getPrayerSchedule(new Date(), location, 'MWL');
                setSchedule(prayerSchedule);
            } catch (error) {
                console.error('Erreur lors du chargement des heures de prière:', error);
            }
        };

        loadSchedule();
    }, []);

    const handleSignOut = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/(auth)/sign-in');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de se déconnecter');
                        }
                    },
                },
            ]
        );
    };

    return (
        <DrawerContentScrollView {...props}>
            {schedule && <DrawerHeader schedule={schedule} />}
            {user && (
                <View className="px-4 py-2 mb-2">
                    <Text className="text-gray-600 text-sm">
                        {user.email}
                    </Text>
                </View>
            )}
            <DrawerItemList {...props} />
            <DrawerItem
                label="Fermer"
                onPress={() => navigation.closeDrawer()}
                icon={() => <X size={24} color="#374151" />}
            />
            <DrawerItem
                label="Déconnexion"
                onPress={handleSignOut}
                icon={() => <LogOut size={24} color="#EF4444" />}
                labelStyle={{ color: '#EF4444' }}
            />
        </DrawerContentScrollView>
    );
}

