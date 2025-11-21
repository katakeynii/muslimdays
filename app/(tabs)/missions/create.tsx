import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { CreateMissionScreen } from '../../../screens/CreateMissionScreen';

export default function CreateMissionPage() {
    const router = useRouter();

    const navigation = {
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <CreateMissionScreen navigation={navigation} />
        </View>
    );
} 