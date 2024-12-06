
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NoticeBoard({ route }) {
    const navigation = useNavigation();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const BACKEND_URL = 'http://192.168.0.47:8080'; // Flask 서버 IP
    const { query = '' } = route.params || {}; // 검색어 가져오기

    const fetchRecipes = async () => {
        if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 실행 중단
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/recipes?query=${encodeURIComponent(query)}&page=${page}&limit=14`);
            const data = await response.json();

            if (data.length === 0) {
                setHasMore(false); // 더 이상 불러올 데이터가 없음을 표시
            } else {
                setRecipes((prev) => [...prev, ...data]); // 기존 데이터에 새 데이터를 추가
                setPage((prev) => prev + 1); // 페이지 번호 증가
            }
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 처음 로드 시 데이터 가져오기
    useEffect(() => {
        fetchRecipes();
    }, []);

    const renderRecipe = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: `${BACKEND_URL}/images/${item.ID}/${item.ID}_main.jpg` }}
                style={styles.recipeImage}
            />
            <Text style={styles.recipeTitle}>{item.Name || '이름 없음'}</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('RecipeDetail', { id: item.ID })}
            >
                <Text style={styles.recipeLink}>상세 보기</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                renderItem={renderRecipe}
                keyExtractor={(item, index) => item.ID || index.toString()}
                numColumns={2} // 2열 그리드
                contentContainerStyle={styles.contentContainer}
                onEndReached={fetchRecipes} // 스크롤 끝에 도달 시 데이터 추가 로드
                onEndReachedThreshold={0.5} // 트리거 임계값
                ListFooterComponent={
                    loading && <ActivityIndicator size="large" color="#007BFF" />
                }
            />
            {!hasMore && recipes.length > 0 && (
                <View style={styles.noMoreDataContainer}>
                    <Text style={styles.noMoreDataText}>더 이상 데이터가 없습니다.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    contentContainer: {
        padding: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
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
    noMoreDataContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    noMoreDataText: {
        color: '#888',
    },
});