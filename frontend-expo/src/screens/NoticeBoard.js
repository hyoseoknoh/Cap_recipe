import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function RecipeDetail() {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        setRecipe(sampleRecipeData);
    }, []);

    if (!recipe) return <Text>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            {/* 요리 이미지 및 기본 정보 */}
            <Image source={require('../../assets/Image/bulgogi.jpg')} style={styles.mainImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.subTitle}>{recipe.description}</Text>
            </View>

            {/* 기본 정보 섹션 */}
            <View style={styles.infoContainer}>
                <Text>인분: {recipe.servings}</Text>
                <Text>시간: {recipe.time}</Text>
                <Text>난이도: {recipe.difficulty}</Text>
            </View>

            {/* 재료 목록 */}
            <Text style={styles.sectionTitle}>재료</Text>
            <FlatList
                data={recipe.ingredients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ingredientItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.quantity}</Text>
                    </View>
                )}
            />

            {/* 조리 순서 */}
            <Text style={styles.sectionTitle}>조리 순서</Text>
            {recipe.instructions.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <Text style={styles.stepText}>{index + 1}. {step.description}</Text>
                    {step.image && <Image source={step.image} style={styles.stepImage} />}
                </View>
            ))}

            {/* 관련 사진 */}
            <Text style={styles.sectionTitle}>관련 사진</Text>
            <FlatList
                data={recipe.relatedImages}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.relatedImage} />
                )}
                showsHorizontalScrollIndicator={false}
            />

            {/* 후기 섹션 */}
            <Text style={styles.sectionTitle}>요리 후기</Text>
            {recipe.reviews.map((review, index) => (
                <View key={index} style={styles.reviewContainer}>
                    <Text style={styles.reviewText}>{review.author}:</Text>
                    <Text>{review.content}</Text>
                </View>
            ))}
            <TouchableOpacity style={styles.reviewButton}>
                <Text style={styles.reviewButtonText}>후기 작성하기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const sampleRecipeData = {
    mainImage: require('../../assets/Image/bulgogi.jpg'),
    title: '15분이면 불고기 만들기',
    description: '간단하게 만드는 불고기 레시피입니다.',
    servings: '4인분',
    time: '15분 이상',
    difficulty: '쉬움',
    ingredients: [
        { name: '소고기', quantity: '400g' },
        { name: '간장', quantity: '3T' },
        { name: '설탕', quantity: '2T' },
    ],
    instructions: [
        { description: '소고기 등심에 설탕 4스푼, 물엿 2스푼을 넣어요.', image: require('../../assets/Image/bulgogiRecip/bulRecip1.jpg') },
        { description: '매실액과 다진 마늘 3스푼, 간장 12스푼을 넣고 섞어요.', image: require('../../assets/Image/bulgogiRecip/bulRecip2.jpg') },
        { description: '여기에 참기름 1스푼을 넣고 주물러 30분 기다려줘요.', image: require('../../assets/Image/bulgogiRecip/bulRecip3.jpg') },
        { description: '기다리는 동안 야채와 버섯 손질도 샤샤샥^^', image: require('../../assets/Image/bulgogiRecip/bulRecip4.jpg') },
        { description: '재워 둔 고기에 야채를 모두 넣고 참기름을 2스푼 더 첨가한 뒤 섞어주고 센 불에 구우면 끝!!', image: require('../../assets/Image/bulgogiRecip/bulRecip5.jpg') },
        { description: '아아, 제가 했지만 너무 맛있어요 ㅠㅜ ㅎㅎㅎ 혹시라도 고기 냄새에 좀 민감하시면 청주나 맛술 한스푼 추가 추천해요~밥에 올려서 촵촵 정말 맛있게 먹었어요 :)', image: require('../../assets/Image/bulgogiRecip/bulRecip6.jpg') },

    ],
    relatedImages: [
        'https://related-image1.com',
        'https://related-image2.com',
    ],
    reviews: [
        { author: '홍길동', content: '맛있게 잘 먹었어요!' },
        { author: '김철수', content: '간단하고 맛있네요!' },
    ]
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainImage: {
        width: '100%',
        height: 200,
    },
    titleContainer: {
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 16,
        color: '#888',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    stepContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    stepText: {
        fontSize: 16,
    },
    stepImage: {
        width: '100%',
        height: 200,
        marginTop: 10,
    },
    relatedImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
    reviewContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    reviewText: {
        fontWeight: 'bold',
    },
    reviewButton: {
        margin: 20,
        paddingVertical: 10,
        backgroundColor: '#ff5a5f',
        borderRadius: 5,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});