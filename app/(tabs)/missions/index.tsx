import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { MissionsScreen } from '../../../screens/MissionsScreen';

export default function MissionsIndexPage() {
    const router = useRouter();

    const navigation = {
        navigate: (screen: string, params?: any) => {
            if (screen === 'CreateMission') {
                router.push('/missions/create');
            } else if (screen === 'EditMission') {
                router.push({
                    pathname: '/missions/edit',
                    params: { missionId: params.mission.id }
                });
            }
        },
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <MissionsScreen navigation={navigation} />
        </View>
    );
} 