import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, myID, NoticeBoard, RecipBoard, CameraScreen } from '../screens';
import RecipeDetail from '../screens/RecipeDetail'; // 상세 페이지 컴포넌트 추가

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="BulgogiSearch" component={RecipBoard} />
            <Stack.Screen name="NoticeBoard" component={NoticeBoard} />
            <Stack.Screen name="MyID" component={myID} />
            <Stack.Screen
                name="RecipeDetail"
                component={RecipeDetail} // 상세 페이지 컴포넌트
                options={{ title: '레시피 상세 정보' }}
            />
        </Stack.Navigator>
    );
}