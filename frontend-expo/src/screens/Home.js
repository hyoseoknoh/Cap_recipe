import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FoodieaApp() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = 'http://172.16.1.9:8080'; // IP를 172.16.1.9로 수정

    // 백엔드에서 랜덤 2개의 데이터 가져오기
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/recipes?page=1`);
                const data = await response.json();
                const randomRecipes = data.sort(() => 0.5 - Math.random()).slice(0, 2);
                setRecipes(randomRecipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                alert('레시피 데이터를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleSearch = () => {
        if (searchText.trim()) {
            const filteredRecipes = recipes.filter(recipe =>
                recipe.Name.toLowerCase().includes(searchText.toLowerCase())
            );
            navigation.navigate('SearchResults', { filteredRecipes });
        }
    };

    return (
        <View style={styles.container}>
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
                    <Icon name="search" size={20} color="#ff5a5f" style={styles.searchIcon} />
                </View>
            </View>

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
                                <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { id: item.ID })}>
                                    <Text style={styles.recipeLink}>상세 보기</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Icon name="home-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('즐겨찾기 기능은 아직 구현되지 않았습니다.')}>
                    <MaterialCommunityIcons name="bookmark-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
                    <Icon name="camera-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MyID')}>
                    <Icon name="person-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    card: {
        width: 160,
        margin: 10,
        alignItems: 'center',
    },
    recipeImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    recipeTitle: {
        fontWeight: 'bold',
        fontSize: 16,
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
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
});