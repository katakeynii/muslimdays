import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useMissions } from '../../../hooks/useMissions';
import { EditMissionScreen } from '../../../screens/EditMissionScreen';

export default function EditMissionPage() {
    const router = useRouter();
    const { missionId } = useLocalSearchParams();
    const { getMissionById } = useMissions();

    const mission = getMissionById(missionId as string);

    if (!mission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Mission non trouvée</Text>
            </View>
        );
    }

    const navigation = {
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <EditMissionScreen
                navigation={navigation}
                route={{ params: { mission } }}
            />
        </View>
    );
} 