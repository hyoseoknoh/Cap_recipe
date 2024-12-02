import React from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
    const handleCameraPress = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "카메라를 사용하려면 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log("사진 촬영 성공:", result.assets[0].uri);
            Alert.alert("사진 촬영 완료", "촬영된 사진이 저장되었습니다.");
        } else {
            console.log("사용자가 카메라를 닫았습니다.");
        }
    };

    const handleGalleryPress = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("권한 필요", "갤러리를 사용하려면 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log("갤러리에서 선택된 사진:", result.assets[0].uri);
            Alert.alert("사진 선택 완료", "갤러리에서 사진을 선택했습니다.");
        } else {
            console.log("사용자가 갤러리를 닫았습니다.");
        }
    };

    const showAlert = () => {
        Alert.alert(
            "선택하기",
            "카메라 또는 갤러리로 이동하세요.",
            [
                { text: "카메라 열기", onPress: handleCameraPress },
                { text: "갤러리 열기", onPress: handleGalleryPress },
                { text: "취소", style: "cancel" },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showAlert}>
                <Image
                    source={require('../../assets/Icon/add_a_photo_24dp_CECECE_FILL0_wght400_GRAD0_opsz24.png')}
                    style={styles.cameraImage}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cameraImage: {
        width: 100,
        height: 100,
        tintColor: '#555', // 아이콘 색상 조정 (필요 시 제거 가능)
    },
});
