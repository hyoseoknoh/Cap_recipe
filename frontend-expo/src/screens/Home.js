import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

export default function FoodieaApp() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = 'http://172.16.1.23:8080'; // Flask 서버 IP

    // 검색 핸들러 추가
    // 검색 핸들러 수정 (재료 기반 검색)
    const handleSearch = () => {
        if (searchText.trim()) {
            const ingredients = searchText.split(',').map(item => item.trim());
            navigation.navigate('NoticeBoard', { ingredients }); // 재료 리스트를 NoticeBoard로 전달
        }
    };

    // 백엔드에서 랜덤 데이터 가져오기
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/recipes?page=1&limit=6`);
                const data = await response.json();
                console.log('Fetched recipes:', data); // 데이터 확인용
                setRecipes(data); // 랜덤 6개 데이터 설정
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecipes();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/Image/main_logo.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.logoText}>FOODIEA</Text>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="요리를 검색해 주세요"
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Icon name="search" size={20} color="#ff5a5f" style={styles.searchIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 콘텐츠 */}
                {loading ? (
                    <ActivityIndicator size="large" color="#ff5a5f" style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>실시간 인기</Text>
                        <View style={styles.recipeContainer}>
                            {recipes.map((item, index) => (
                                <View key={index} style={styles.card}>
                                    <Image
                                        source={{ uri: `${BACKEND_URL}/images/${item.ID}/${item.ID}_main.jpg` }}
                                        style={styles.recipeImage}
                                    />
                                    <Text style={styles.recipeTitle}>{item.Name}</Text>
                                    <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('RecipeDetail', { id: item.ID }) // ID 전달
                                            }
                                        >
                                            <Text style={styles.recipeLink}>상세 보기</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>

            {/* 하단바 */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
                    <Icon name="home-outline" size={24} color="#333" style={styles.navIcon} />
                    <Text style={styles.navText}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => alert('즐겨찾기 기능은 아직 구현되지 않았습니다.')}
                >
                    <MaterialCommunityIcons name="bookmark-outline" size={24} color="#333" style={styles.navIcon} />
                    <Text style={styles.navText}>즐겨찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('CameraScreen')}>
                    <Icon name="camera-outline" size={24} color="#333" style={styles.navIcon} />
                    <Text style={styles.navText}>카메라</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyID')}>
                    <Icon name="person-outline" size={24} color="#333" style={styles.navIcon} />
                    <Text style={styles.navText}>내 정보</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// 스타일
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    logoImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff5a5f',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '90%',
        height: 40,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 0,
    },
    searchIcon: {
        marginLeft: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    contentContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    recipeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    card: {
        width: '47%',
        marginBottom: 15,
        alignItems: 'center',
    },
    recipeImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    recipeTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 5,
        textAlign: 'center',
    },
    recipeLink: {
        color: '#007BFF',
        textAlign: 'center',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        height: 60, // 하단바 높이
    },
    navButton: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    navIcon: {
        marginBottom: 5,
    },
    navText: {
        fontSize: 12,
        color: '#333',
    },
});