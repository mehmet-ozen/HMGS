import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import { Canvas, Circle, Path } from '@shopify/react-native-skia';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const MAX_PAN_LIMIT = 1000;

const NodeTypes = {
    CENTRAL: 'central',
    SUBTOPIC: 'subtopic',
    MAX_SUBTOPICS: 5,
};

export default function WhiteboardScreen({ route }) {
    <View>
        <Text>WhiteboardScreen</Text>
    </View>
 /*   const { courseId } = route.params;
    
    // Kurs için mind map verisini bul
    const mindmap = mindmapsData.mindmaps.find(m => m.courseId === courseId);

    // Node'ların pozisyonlarını hesapla
    const calculateNodePositions = (nodes) => {
        return nodes.map(node => {
            if (node.type === 'central') {
                return {
                    ...node,
                    x: width/2 - 60,
                    y: 50
                };
            }
            
            const subtopics = nodes.filter(n => n.type === 'subtopic');
            const index = subtopics.findIndex(n => n.id === node.id);
            const totalSubtopics = subtopics.length;
            
            if (node.type === 'subtopic') {
                const spacing = 180;
                const startX = width/2 - ((totalSubtopics - 1) * spacing / 2);
                return {
                    ...node,
                    x: startX + (index * spacing) - 40,
                    y: 150
                };
            }
            return node;
        });
    };

    // Bağlantıların pozisyonlarını hesapla
    const calculateConnections = (nodes, connections) => {
        return connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            return {
                ...conn,
                startX: fromNode.x + fromNode.width/2,
                startY: fromNode.y + fromNode.height,
                endX: toNode.x + toNode.width/2,
                endY: toNode.y
            };
        });
    };

    const [nodes] = useState(() => calculateNodePositions(mindmap.nodes));
    const [connections] = useState(() => calculateConnections(nodes, mindmap.connections));

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            savedScale.value = scale.value;
        })
        .onUpdate((event) => {
            const newScale = savedScale.value * event.scale;
            scale.value = Math.min(Math.max(newScale, 0.5), 5);
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
            const newTranslateX = savedTranslateX.value + event.translationX;
            const newTranslateY = savedTranslateY.value + event.translationY;

            translateX.value = Math.min(Math.max(newTranslateX, -MAX_PAN_LIMIT), MAX_PAN_LIMIT);
            translateY.value = Math.min(Math.max(newTranslateY, -MAX_PAN_LIMIT), MAX_PAN_LIMIT);
        });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    const renderNodes = () => {
        return nodes.map(node => (
            <Pressable
                key={node.id}
                style={[
                    styles.node,
                    node.type === NodeTypes.CENTRAL ? styles.centralNode : styles.subtopicNode,
                    {
                        left: node.x,
                        top: node.y,
                    }
                ]}
            >
                <Text style={styles.nodeText}>{node.text}</Text>
            </Pressable>
        ));
    };

    const renderConnections = () => {
        return connections.map(connection => (
            <Path
                key={`${connection.from}-${connection.to}`}
                path={`M ${connection.startX} ${connection.startY} L ${connection.endX} ${connection.endY}`}
                stroke={colors.mindMap.connection}
                strokeWidth={2}
            />
        ));
    };

    return (
        <GestureDetector gesture={composed}>
            <View style={styles.container}>
                <Animated.View style={[styles.wrapper, animatedStyle]}>
                    <Canvas style={{flex:1}}>
                        {renderConnections()}
                    </Canvas>
                    {renderNodes()}
                </Animated.View>
            </View>
        </GestureDetector>
    );*/
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    wrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    pattern: {
        width: '200%',
        height: '200%',
        position: 'absolute',
        top: -height / 2,
        left: -width / 2,
    },
    node: {
        position: 'absolute',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.dark,
        minWidth: 120,
        alignItems: 'center',
    },
    centralNode: {
        backgroundColor: colors.mindMap.centralNode,
    },
    subtopicNode: {
        backgroundColor: colors.mindMap.subtopicNode,
    },
    nodeText: {
        color: colors.mindMap.nodeText,
    },
    toolbar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 10,
        padding: 10,
    },
    toolbarButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#999',
    },
});

