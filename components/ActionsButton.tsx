import { Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

interface ActionsButtonProps {
    className?: string;
}

export default function ActionsButton({ className = '' }: ActionsButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/agenda')}
            className={`bg-green-500 px-4 py-3 rounded-lg flex-row items-center justify-center ${className}`}
        >
            <Calendar size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
                Agenda
            </Text>
        </TouchableOpacity>
    );
} 