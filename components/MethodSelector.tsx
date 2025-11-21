import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { METHODS } from '../constants/methods';

interface MethodSelectorProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

export default function MethodSelector({
    selectedMethod,
    onMethodChange
}: MethodSelectorProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const currentMethod = METHODS[selectedMethod];

    const handleMethodSelect = (methodKey: string) => {
        onMethodChange(methodKey);
        setIsModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="bg-white p-4 rounded-xl border border-gray-200 mb-4"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-sm text-gray-600 mb-1">Méthode de calcul</Text>
                        <Text className="text-lg font-semibold text-gray-800">
                            {currentMethod?.name || 'Méthode inconnue'}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            Fajr: {currentMethod?.fajrAngle}° • Isha: {currentMethod?.ishaAngle || currentMethod?.ishaInterval + 'min'}
                        </Text>
                    </View>
                    <View className="ml-4">
                        <Text className="text-gray-600 text-xl">▼</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-end">
                    <View className="bg-white rounded-t-3xl max-h-96">
                        <View className="p-4 border-b border-gray-200">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-xl font-bold text-gray-800">
                                    Choisir la méthode
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setIsModalVisible(false)}
                                    className="p-2"
                                >
                                    <Text className="text-2xl text-gray-600">×</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className="text-sm text-gray-600 mt-1">
                                Sélectionnez la méthode de calcul des heures de prière
                            </Text>
                        </View>

                        <ScrollView className="flex-1 p-4">
                            {Object.entries(METHODS).map(([key, method]) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleMethodSelect(key)}
                                    className={`p-4 rounded-xl mb-2 border ${selectedMethod === key
                                        ? 'bg-emerald-50 border-emerald-300'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text
                                                className={`text-lg font-semibold ${selectedMethod === key ? 'text-emerald-700' : 'text-gray-800'
                                                    }`}
                                            >
                                                {method.name}
                                            </Text>
                                            <View className="flex-row mt-1">
                                                <Text className="text-sm text-gray-600 mr-4">
                                                    Fajr: {method.fajrAngle}°
                                                </Text>
                                                <Text className="text-sm text-gray-600">
                                                    Isha: {method.ishaAngle ? `${method.ishaAngle}°` : `${method.ishaInterval}min`}
                                                </Text>
                                            </View>
                                        </View>
                                        {selectedMethod === key && (
                                            <View className="ml-4">
                                                <Text className="text-emerald-600 text-xl">✓</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
} 