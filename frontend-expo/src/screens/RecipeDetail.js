import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function RecipeDetail({ route }) {
    const { id } = route.params; // 전달받은 레시피 ID
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = 'http://172.16.1.9:8080'; // 서버 IP를 수정하세요


    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/recipe/${id}`);
                const data = await response.json();
                setRecipe(data.recipe); // 백엔드에서 전달된 데이터 구조에 따라 설정
            } catch (error) {
                console.error('Failed to fetch recipe detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetail();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ff5a5f" />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>레시피를 불러오는 데 실패했습니다.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: recipe.mainImage }} style={styles.mainImage} />
            <Text style={styles.title}>{recipe.name}</Text>
            <Text style={styles.sectionTitle}>재료</Text>
            <Text style={styles.text}>{recipe.ingredients}</Text>
            <Text style={styles.sectionTitle}>조리 과정</Text>
            {recipe.steps.map((step, index) => (
                <View key={index} style={styles.step}>
                    {step.image && <Image source={{ uri: step.image }} style={styles.stepImage} />}
                    <Text style={styles.stepText}>{step.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#999',
    },
    mainImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
    },
    step: {
        marginBottom: 10,
    },
    stepImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    stepText: {
        fontSize: 16,
        color: '#666',
    },
});