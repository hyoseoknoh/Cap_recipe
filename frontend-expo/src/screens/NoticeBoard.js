// import React from 'react';
// import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// export default function NoticeBoard({ route }) {
//     const navigation = useNavigation();
//     const { filteredRecipes } = route.params || {}; // 검색 결과를 props로 받음

//     return (
//         <View style={styles.container}>
//             <Text style={styles.headerText}>검색 결과</Text>
//             {filteredRecipes && filteredRecipes.length > 0 ? (
//                 <ScrollView contentContainerStyle={styles.contentContainer}>
//                     {filteredRecipes.map((recipe, index) => (
//                         <View key={index} style={styles.card}>
//                             <Image
//                                 source={{ uri: recipe.mainImage }}
//                                 style={styles.recipeImage}
//                             />
//                             <Text style={styles.recipeTitle}>{recipe.Name}</Text>
//                             <TouchableOpacity
//                                 onPress={() =>
//                                     navigation.navigate('RecipeDetail', { id: recipe.id })
//                                 }
//                             >
//                                 <Text style={styles.recipeLink}>상세 보기</Text>
//                             </TouchableOpacity>
//                         </View>
//                     ))}
//                 </ScrollView>
//             ) : (
//                 <View style={styles.noResultContainer}>
//                     <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 10,
//     },
//     headerText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         textAlign: 'center',
//     },
//     contentContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     card: {
//         width: '47%',
//         marginBottom: 15,
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//         alignItems: 'center',
//         padding: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     recipeImage: {
//         width: '100%',
//         height: 120,
//         borderRadius: 10,
//     },
//     recipeTitle: {
//         fontWeight: 'bold',
//         fontSize: 14,
//         marginVertical: 5,
//         textAlign: 'center',
//     },
//     recipeLink: {
//         color: '#007BFF',
//         textAlign: 'center',
//         fontWeight: 'bold',
//     },
//     noResultContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noResultText: {
//         fontSize: 16,
//         color: '#888',
//     },
// });

import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NoticeBoard({ route }) {
    const navigation = useNavigation();
    const { filteredRecipes = [] } = route.params || {}; // 기본값 설정

    // 데이터 유효성 검사
    if (!Array.isArray(filteredRecipes)) {
        return (
            <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>잘못된 데이터 형식입니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>검색 결과</Text>
            {filteredRecipes.length > 0 ? (
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {filteredRecipes.map((recipe) => (
                        <View key={recipe.id} style={styles.card}>
                            <Image
                                source={{ uri: recipe.mainImage }}
                                style={styles.recipeImage}
                            />
                            <Text style={styles.recipeTitle}>{recipe.Name}</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('RecipeDetail', {
                                        id: recipe.id,
                                        name: recipe.Name,
                                        mainImage: recipe.mainImage,
                                    })
                                }
                            >
                                <Text style={styles.recipeLink}>상세 보기</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noResultContainer}>
                    <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        fontWeight: 'bold',
    },
    noResultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 16,
        color: '#888',
    },
});