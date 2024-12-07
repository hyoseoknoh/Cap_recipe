import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Result({ route }) {
    const { detectedIngredients } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>분석된 재료:</Text>
            {detectedIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredient}>
                    - {ingredient}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    ingredient: {
        fontSize: 16,
        marginVertical: 4,
    },
});
