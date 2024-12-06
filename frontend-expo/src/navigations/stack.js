// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Home, myID, NoticeBoard, CameraScreen } from '../screens'; // 필요한 컴포넌트만 가져오기
// import RecipeDetail from '../screens/RecipeDetail'; // 상세 페이지 컴포넌트 추가

// const Stack = createStackNavigator();

// export default function StackNavigator() {
//     return (
//         <Stack.Navigator initialRouteName="Home">
//             <Stack.Screen 
//                 name="Home" 
//                 component={Home} 
//                 options={{ title: '홈 화면' }} 
//             />
//             <Stack.Screen 
//                 name="CameraScreen" 
//                 component={CameraScreen} 
//                 options={{ title: '카메라 화면' }} 
//             />
//             <Stack.Screen 
//                 name="NoticeBoard" 
//                 component={NoticeBoard} 
//                 options={({ route }) => ({
//                     title: route.params?.query ? `검색 결과: ${route.params.query}` : '검색 결과',
//                 })} 
//             />
//             <Stack.Screen 
//                 name="MyID" 
//                 component={myID} 
//                 options={{ title: '내 정보' }} 
//             />
//             <Stack.Screen
//                 name="RecipeDetail"
//                 component={RecipeDetail}
//                 options={{ title: '레시피 상세 정보' }}
//             />
//         </Stack.Navigator>
//     );
// }

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, myID, NoticeBoard, CameraScreen, AiResultScreen } from '../screens'; // AiResultScreen 추가
import RecipeDetail from '../screens/RecipeDetail'; // 상세 페이지 컴포넌트 추가

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
                name="Home" 
                component={Home} 
                options={{ title: '홈 화면' }} 
            />
            <Stack.Screen 
                name="CameraScreen" 
                component={CameraScreen} 
                options={{ title: '카메라 화면' }} 
            />
            <Stack.Screen 
                name="NoticeBoard" 
                component={NoticeBoard} 
                options={({ route }) => ({
                    title: route.params?.query ? `검색 결과: ${route.params.query}` : '검색 결과',
                })} 
            />
            <Stack.Screen 
                name="MyID" 
                component={myID} 
                options={{ title: '내 정보' }} 
            />
            <Stack.Screen
                name="RecipeDetail"
                component={RecipeDetail}
                options={{ title: '레시피 상세 정보' }}
            />
            <Stack.Screen
                name="AiResultScreen"
                component={AiResultScreen}
                options={{ title: 'AI 분석 결과' }} // 옵션 추가
            />
        </Stack.Navigator>
    );
}