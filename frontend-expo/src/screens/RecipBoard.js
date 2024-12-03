// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';

// export default function RecipeBoard() {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { query } = route.params; // Home.js에서 전달된 검색어
//     const [recipes, setRecipes] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const BACKEND_URL = 'http://172.16.1.9:8080'; // 자신의 IP 주소로 변경

//     useEffect(() => {
//         const fetchSearchResults = async () => {
//             try {
//                 const response = await fetch(`${BACKEND_URL}/recipes?search=${query}`);
//                 const data = await response.json();
//                 setRecipes(data);
//             } catch (error) {
//                 console.error('Failed to fetch search results:', error);
//                 alert('검색 결과를 가져오는 중 오류가 발생했습니다.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSearchResults();
//     }, [query]);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>검색 결과: "{query}"</Text>
//             {loading ? (
//                 <ActivityIndicator size="large" color="#ff5a5f" style={{ marginTop: 20 }} />
//             ) : recipes.length === 0 ? (
//                 <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
//             ) : (
//                 <ScrollView>
//                     {recipes.map((recipe, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={styles.recipeCard}
//                             onPress={() => navigation.navigate('RecipeDetail', { id: recipe.ID })}
//                         >
//                             <Image
//                                 source={{
//                                     uri: `${BACKEND_URL}/images/${recipe.ID}/${recipe.ID}_main.jpg`,
//                                 }}
//                                 style={styles.recipeImage}
//                             />
//                             <View style={styles.recipeInfo}>
//                                 <Text style={styles.recipeTitle}>{recipe.Name}</Text>
//                                 <Text style={styles.recipeIngredients}>{recipe.Ingredients}</Text>
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </ScrollView>
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
//     header: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     noResults: {
//         fontSize: 16,
//         color: '#888',
//         textAlign: 'center',
//         marginTop: 20,
//     },
//     recipeCard: {
//         flexDirection: 'row',
//         marginBottom: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//         paddingBottom: 10,
//     },
//     recipeImage: {
//         width: 80,
//         height: 80,
//         borderRadius: 8,
//     },
//     recipeInfo: {
//         flex: 1,
//         marginLeft: 10,
//         justifyContent: 'center',
//     },
//     recipeTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     recipeIngredients: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 5,
//     },
// });