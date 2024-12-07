// import React from 'react';
// import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function CameraScreen() {
//     const handleCameraPress = async () => {
//         const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//         if (!permissionResult.granted) {
//             Alert.alert("권한 필요", "카메라를 사용하려면 권한이 필요합니다.");
//             return;
//         }

//         const result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             console.log("사진 촬영 성공:", result.assets[0].uri);
//             Alert.alert("사진 촬영 완료", "촬영된 사진이 저장되었습니다.");
//         } else {
//             console.log("사용자가 카메라를 닫았습니다.");
//         }
//     };

//     const handleGalleryPress = async () => {
//         const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (!permissionResult.granted) {
//             Alert.alert("권한 필요", "갤러리를 사용하려면 권한이 필요합니다.");
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             console.log("갤러리에서 선택된 사진:", result.assets[0].uri);
//             Alert.alert("사진 선택 완료", "갤러리에서 사진을 선택했습니다.");
//         } else {
//             console.log("사용자가 갤러리를 닫았습니다.");
//         }
//     };

//     const showAlert = () => {
//         Alert.alert(
//             "선택하기",
//             "카메라 또는 갤러리로 이동하세요.",
//             [
//                 { text: "카메라 열기", onPress: handleCameraPress },
//                 { text: "갤러리 열기", onPress: handleGalleryPress },
//                 { text: "취소", style: "cancel" },
//             ]
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity onPress={showAlert}>
//                 <Image
//                     source={require('../../assets/Icon/add_a_photo_24dp_CECECE_FILL0_wght400_GRAD0_opsz24.png')}
//                     style={styles.cameraImage}
//                 />
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     cameraImage: {
//         width: 100,
//         height: 100,
//         tintColor: '#555', // 아이콘 색상 조정 (필요 시 제거 가능)
//     },
// });


// import React from 'react';
// import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import { useNavigation } from '@react-navigation/native';

// export default function CameraScreen() {
//     const SERVER_URL = 'http://192.168.0.47:5001/upload'; // Flask 서버 주소
//     const navigation = useNavigation();

//     const handleCameraPress = async () => {
//         // 카메라 및 갤러리 권한 요청
//         const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
//         const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

//         if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
//             Alert.alert("권한 필요", "카메라 및 갤러리를 사용하려면 권한이 필요합니다.");
//             return;
//         }

//         // 카메라 실행
//         const result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaType.Images,  // 이미지 타입 설정
//             allowsEditing: true, // 편집 허용
//             quality: 1, // 이미지 품질 설정
//         });

//         if (!result.canceled) {
//             const photoUri = result.assets[0].uri;
//             console.log("사진 촬영 성공:", photoUri);

//             try {
//                 // 갤러리에 저장
//                 const asset = await MediaLibrary.createAssetAsync(photoUri);
//                 await MediaLibrary.createAlbumAsync("MyAppPhotos", asset, false);
//                 Alert.alert("사진 저장 완료", "촬영된 사진이 갤러리에 저장되었습니다.");

//                 // 서버로 이미지 전송
//                 await uploadToServer(photoUri);
//             } catch (error) {
//                 console.log("사진 저장 오류:", error);
//                 Alert.alert("저장 실패", "사진을 저장하는 데 실패했습니다.");
//             }
//         } else {
//             console.log("사용자가 카메라를 닫았습니다.");
//         }
//     };

//     const handleGalleryPress = async () => {
//         // 갤러리 권한 요청
//         const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    
//         if (!mediaLibraryPermission.granted) {
//             Alert.alert("권한 필요", "갤러리를 사용하려면 권한이 필요합니다.");
//             return;
//         }
    
//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaType.Images, // 이미지 타입 설정
//             allowsEditing: true, // 편집 허용
//             quality: 1, // 이미지 품질 설정
//         });
    
//         if (!result.canceled) {
//             const photoUri = result.assets[0].uri;
//             console.log("갤러리에서 선택된 사진:", photoUri);
    
//             // 서버로 이미지 전송
//             await uploadToServer(photoUri);
    
//             Alert.alert("사진 선택 완료", "갤러리에서 사진을 선택했습니다.");
//         } else {
//             console.log("사용자가 갤러리를 닫았습니다.");
//         }
//     };

//     const uploadToServer = async (photoUri) => {
//         const formData = new FormData();
//         formData.append('file', {
//             uri: photoUri,
//             name: 'photo.jpg',
//             type: 'image/jpeg',
//         });

//         try {
//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             console.log("Fetch response status:", response.status);
//             if (response.ok) {
//                 const result = await response.json();
//                 console.log("서버 응답:", result);

//                 // 분석 결과 화면으로 이동
//                 navigation.navigate('AiResultScreen', { detectedIngredients: result.detected_ingredients });
//             } else {
//                 console.error("서버 응답 오류:", response.statusText);
//                 Alert.alert("분석 실패", "서버가 요청을 처리하지 못했습니다.");
//             }

//         } catch (error) {
//             console.log("서버 업로드 오류:", error);
//             Alert.alert("업로드 실패", "서버로 사진을 전송하는 데 실패했습니다.");
//         }
//     };

//     const showAlert = () => {
//         Alert.alert(
//             "선택하기",
//             "카메라 또는 갤러리로 이동하세요.",
//             [
//                 { text: "카메라 열기", onPress: handleCameraPress },
//                 { text: "갤러리 열기", onPress: handleGalleryPress },
//                 { text: "취소", style: "cancel" },
//             ]
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity onPress={showAlert}>
//                 <Image
//                     source={require('../../assets/Icon/add_a_photo_24dp_CECECE_FILL0_wght400_GRAD0_opsz24.png')}
//                     style={styles.cameraImage}
//                 />
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     cameraImage: {
//         width: 100,
//         height: 100,
//         tintColor: '#555',
//     },
// });

import React from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // expo-image-picker만 사용
import { useNavigation } from '@react-navigation/native'; // useNavigation 임포트

export default function CameraScreen() {
<<<<<<< HEAD
    const SERVER_URL = 'http://172.30.1.87:5001/upload'; // Flask 서버 주소
=======
    const SERVER_URL = 'http://192.168.0.47:5001/upload'; // Flask 서버 주소
>>>>>>> ef895c1a902adec75c45fbb44f9ae035947f979f
    const navigation = useNavigation(); // navigation 객체 사용

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
            const photoUri = result.assets[0].uri;
            console.log("사진 촬영 성공:", photoUri);

            // 서버로 이미지 전송
            await uploadToServer(photoUri);
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
            const photoUri = result.assets[0].uri;
            console.log("갤러리에서 선택된 사진:", photoUri);

            // 서버로 이미지 전송
            await uploadToServer(photoUri);
            Alert.alert("사진 선택 완료", "갤러리에서 사진을 선택했습니다.");
        } else {
            console.log("사용자가 갤러리를 닫았습니다.");
        }
    };

    const uploadToServer = async (photoUri) => {
        const formData = new FormData();
        formData.append('file', {
            uri: photoUri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Fetch response status:", response.status);
            if (response.ok) {
                const result = await response.json();
                console.log("서버 응답:", result);

                // 분석 결과 화면으로 이동
                navigation.navigate('AiResultScreen', { detectedIngredients: result.detected_ingredients });
            } else {
                console.error("서버 응답 오류:", response.statusText);
                Alert.alert("분석 실패", "서버가 요청을 처리하지 못했습니다.");
            }

        } catch (error) {
            console.log("서버 업로드 오류:", error);
            Alert.alert("업로드 실패", "서버로 사진을 전송하는 데 실패했습니다.");
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