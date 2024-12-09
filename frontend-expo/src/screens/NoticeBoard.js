import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NoticeBoard({ route }) {
    const navigation = useNavigation();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 데이터를 더 불러올 수 있는지 여부
    const [noResults, setNoResults] = useState(false); // 검색된 레시피가 없는지 여부
    const BACKEND_URL = 'http://172.16.1.23:8080'; // 서버 IP
    const { ingredients = [] } = route.params || {}; // 재료 목록 가져오기

    // 레시피 데이터 가져오기
    const fetchRecipes = async () => {
        if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 실행 중단
        setLoading(true);
        setNoResults(false); // 검색된 레시피가 없는 상태 초기화

        try {
            const response = await fetch(`${BACKEND_URL}/search?ingredients=${encodeURIComponent(ingredients.join(','))}&page=${page}&limit=10`);
            const text = await response.text(); // 응답을 텍스트로 받아오기
            console.log("응답 내용:", text); // 응답 내용 로그 출력

            // 응답을 JSON으로 파싱
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
                return; // JSON 파싱 실패 시 종료
            }

            // 데이터가 없다면 noResults를 true로 설정
            if (!data.recipes || data.recipes.length === 0) {
                setHasMore(false); // 더 이상 불러올 데이터가 없음을 표시
                setNoResults(true); // 레시피가 없음을 표시
            } else {
                // 기존 데이터와 중복되지 않도록 필터링하여 새로운 데이터만 추가
                const newRecipes = data.recipes.filter(
                    (newRecipe) => !recipes.some((existingRecipe) => existingRecipe.ID === newRecipe.ID)
                );

                setRecipes((prev) => [...prev, ...newRecipes]); // 기존 데이터에 새 데이터를 추가
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
        setRecipes([]); // 새로운 재료 검색 시 기존 레시피 데이터 초기화
        setPage(1); // 페이지 초기화
        setHasMore(true); // 더 불러올 데이터 있음 상태로 초기화
        setNoResults(false); // 레시피가 없는 상태 초기화
        fetchRecipes(); // 데이터 새로 가져오기
    }, [ingredients]);

    // 처음 로드된 이후 페이지 변경될 때마다 데이터를 가져오도록 설정
    useEffect(() => {
        if (page === 1) return; // 처음 로드된 이후에만 fetchRecipes 호출
        fetchRecipes();
    }, [page]);

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
            {noResults ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>검색된 레시피가 없습니다.</Text>
                </View>
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={(item, index) => item.ID ? `${item.ID}_${index}` : `${index}`} // 이 부분을 수정
                    numColumns={2} // 2열 그리드
                    contentContainerStyle={styles.contentContainer}
                    onEndReached={fetchRecipes} // 스크롤 끝에 도달 시 데이터 추가 로드
                    onEndReachedThreshold={0.5} // 트리거 임계값
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="large" color="#007BFF" /> : null
                    }
                />
            )}
            {/* "더 이상 데이터가 없습니다." 문구 */}
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
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 18,
        color: '#888',
    },
});