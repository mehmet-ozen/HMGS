import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';

const useMatch = (gameType) => {
    const userId = auth().currentUser.uid;
    const { user, addMatchsIds } = useAuth();
    const matchesRef = firestore().collection(`${gameType}_matches`);
    const usersRef = firestore().collection('users');

    const [status, setStatus] = useState(null);
    const [matchId, setMatchId] = useState(null);

    const findOrCreateMatch = async () => {
        try {
            // 1. Kullanıcının "lastActive" alanını güncelle
            await usersRef.doc(userId).update({
                lastActiveOnGames: firestore.FieldValue.serverTimestamp(),
            });

            // 2. Bekleyen bir karşılaşma bul
            const waitingMatch = await matchesRef
                .where('status', '==', 'waiting')
                .limit(1)
                .get();

            if (!waitingMatch.empty) {
                // Bekleyen karşılaşma bulundu, bu kullanıcıyı player2 yap
                const matchId = waitingMatch.docs[0].id;
                await matchesRef.doc(matchId).update({
                    player2: { ...user, score: 0 },
                    status: 'active', // Karşılaşmayı aktif yap
                });
                setMatchId(matchId);
                setStatus('active');
                addMatchsIds(matchId);
            } else {
                // 3. Bekleyen karşılaşma yok, yeni bir karşılaşma oluştur
                const newMatch = await matchesRef.add({
                    player1: { ...user, score: 0 },
                    player2: null, // Henüz eşleşme yapılmadı
                    status: 'waiting',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    questions: [], // Sorular burada eklenecek
                });
                setMatchId(newMatch.id);
                setStatus('waiting');
            }
        } catch (error) {
            console.error('Error finding or creating match:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (status === 'waiting' && matchId) {
            const subscriber = matchesRef
                .doc(matchId)
                .onSnapshot(documentSnapshot => {
                    const data = documentSnapshot.data();
                    // Eğer status "active" olmuşsa, oyuncu bulunmuş demektir
                    if (data?.status === 'active') {
                        setStatus('active');
                        addMatchsIds(matchId);
                    }
                }, error => {
                    console.error("Error in snapshot listener: ", error);
                });

            // Abonelik bitince dinleyiciyi temizle
            return () => subscriber();
        }
    }, [status, matchId]); // matchId ve status bağımlılığı

    return {
        status,
        matchId,
        findOrCreateMatch,
    };
};
export default useMatch;

const changeScore = async (match, change) => {
    try {
        const currentUser = auth().currentUser;
        const matchRef = firestore()
            .collection('spin_the_wheel_matches')
            .doc(match.id);
        
        if(!match){
            return;
        }
        // Hangi oyuncu olduğunu kontrol et
        const isPlayer1 = match.player1.userId === currentUser.uid;
        
        // Score'u güncelle
        const updateData = isPlayer1 
            ? {
                'player1.score': firestore.FieldValue.increment(change)
              }
            : {
                'player2.score': firestore.FieldValue.increment(change)
              };

        await matchRef.update(updateData);

        // return isPlayer1 ? matchData.player1.score + change : match.player2.score + change;

    } catch (error) {
        console.error('Score güncellenirken hata:', error);
        throw error;
    }
};

// Export fonksiyonu
export { changeScore };

