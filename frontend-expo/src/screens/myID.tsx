import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Collapsible from 'react-native-collapsible';

interface CollapsedState {
    post: boolean;
    points: boolean;
    help: boolean;
    privacy: boolean;
    notifications: boolean;
}

const ProfileScreen = () => {
    // 메뉴 항목의 접힘 상태를 관리
    const [collapsed, setCollapsed] = useState < CollapsedState > ({
        post: true,
        points: true,
        help: true,
        privacy: true,
        notifications: true
    });

    // 메뉴 항목의 접힘 상태를 토글하는 함수
    const toggleExpanded = (section) => {
        setCollapsed(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>My Report</Text>
            <View style={styles.profileSection}>
                <Image style={styles.avatar} source={{ uri: 'https://via.placeholder.com/150' }} />
                <Text style={styles.name}>홍길동</Text>
            </View>
            <TouchableOpacity onPress={() => toggleExpanded('post')} style={styles.menuItem}>
                <Text style={styles.menuText}>내가 쓴글</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.post}>
                <Text style={styles.collapsibleText}>사용자가 쓴 글</Text>
            </Collapsible>
            <TouchableOpacity onPress={() => toggleExpanded('points')} style={styles.menuItem}>
                <Text style={styles.menuText}>레시피 포인트 적립</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.points}>
                <Text style={styles.collapsibleText}>레시피 포인트 적립 관련</Text>
            </Collapsible>
            <TouchableOpacity onPress={() => toggleExpanded('help')} style={styles.menuItem}>
                <Text style={styles.menuText}>Help</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.help}>
                <Text style={styles.collapsibleText}>도움말 섹션의 내용</Text>
            </Collapsible>
            <TouchableOpacity onPress={() => toggleExpanded('privacy')} style={styles.menuItem}>
                <Text style={styles.menuText}>개인정보 처리방침</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.privacy}>
                <Text style={styles.collapsibleText}>개인정보 처리방침에 대한 상세 내용</Text>
            </Collapsible>
            <TouchableOpacity onPress={() => toggleExpanded('notifications')} style={styles.menuItem}>
                <Text style={styles.menuText}>알림</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed.notifications}>
                <Text style={styles.collapsibleText}>알림 설정 및 정보에 대한 내용</Text>
            </Collapsible>
            <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>탈퇴하기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        textAlign: 'center',
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ccc',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuText: {
        fontSize: 16,
    },
    collapsibleText: {
        padding: 15,
        fontSize: 14,
        color: 'gray'
    }
});

export default ProfileScreen;