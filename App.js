// ════════════════════════════════════════════════════════════════════════════
//  🥚 PERFECT EGG - React Native App
//  Cztery tryby gotowania + Onsen Tamago (specjalny tryb japoński)
//  Paleta: #FFF9C4 (pastelowy żółty) + #FFB74D (pomarańcz)
// ════════════════════════════════════════════════════════════════════════════
//
//  📦 WYMAGANE PAKIETY:
//  npm install react-native (już zainstalowane w projekcie RN)
//  Vibration jest natywnym API z 'react-native' - nie wymaga dodatkowej instalacji
//
//  📱 UPRAWNIENIA:
//  Android: dodaj w AndroidManifest.xml:
//    <uses-permission android:name="android.permission.VIBRATE" />
//  iOS: nie wymaga dodatkowych uprawnień
// ════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Vibration,
  ScrollView,
  Modal,
} from 'react-native';

// ════════════════════════════════════════════════════════════════════════════
//  ⚙️ KONFIGURACJA - edytuj tutaj czasy i kolory
// ════════════════════════════════════════════════════════════════════════════

const COOKING_MODES = [
  {
    id: 'soft',
    name: 'Soft',
    duration: 5 * 60, // 5 minut
    emoji: '🥚',
    description: 'Runny yolk',
    isSpecial: false,
  },
  {
    id: 'medium',
    name: 'Medium',
    duration: 7 * 60, // 7 minut
    emoji: '🍳',
    description: 'Soft-set yolk',
    isSpecial: false,
  },
  {
    id: 'hard',
    name: 'Hard',
    duration: 10 * 60, // 10 minut
    emoji: '🥄',
    description: 'Firm yolk',
    isSpecial: false,
  },
  {
    id: 'onsen',
    name: 'Onsen Tamago',
    duration: 14 * 60, // 14 minut
    emoji: '♨️',
    description: 'Secret of Japanese masters: creamy yolk, runny white',
    isSpecial: true, // tryb specjalny - złota ramka
    // Specjalna instrukcja - pokazywana przed startem timera.
    // Onsen Tamago NIE gotuje się w aktywnie wrzącej wodzie -
    // jajka trzyma się w gorącej "kąpieli" o stałej temperaturze.
    instruction:
      'Place the eggs in a pot, pour boiling water over them, cover the pot, and wait for the signal!',
  },
];

const COLORS = {
  background: '#FFF9C4',  // pastelowy żółty (tło)
  primary: '#FFB74D',     // pomarańcz (akcent)
  cream: '#FFFDE7',       // bardzo jasny krem
  gold: '#FFD700',        // złoto (dla Onsen Tamago)
  darkText: '#5D4037',    // ciemny brązowy tekst
  softText: '#8D6E63',    // jaśniejszy brązowy
  white: '#FFFFFF',
  success: '#81C784',     // zielony - sukces
};

// ════════════════════════════════════════════════════════════════════════════
//  🚀 GŁÓWNY KOMPONENT APLIKACJI
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  // null = ekran wyboru, obiekt = ekran odliczania
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {selectedMode === null ? (
        <ModeSelectionScreen onSelectMode={setSelectedMode} />
      ) : (
        <TimerScreen
          mode={selectedMode}
          onBack={() => setSelectedMode(null)}
        />
      )}
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  🏠 EKRAN WYBORU TRYBU
// ════════════════════════════════════════════════════════════════════════════

function ModeSelectionScreen({ onSelectMode }) {
  // Tryb wybrany do potwierdzenia (pokazuje modal z instrukcją).
  // Używamy tego tylko dla trybów z polem `instruction` (Onsen Tamago).
  // Pozostałe tryby startują od razu po kliknięciu.
  const [pendingMode, setPendingMode] = useState(null);

  const handleModePress = (mode) => {
    if (mode.instruction) {
      // Tryb z instrukcją (Onsen) - najpierw pokaż modal
      setPendingMode(mode);
    } else {
      // Standardowe tryby - start od razu
      onSelectMode(mode);
    }
  };

  const handleConfirmStart = () => {
    const mode = pendingMode;
    setPendingMode(null);
    onSelectMode(mode);
  };

  const handleCancel = () => {
    setPendingMode(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfect Egg</Text>
        <Text style={styles.subtitle}>Choose your cooking mode</Text>
      </View>

      {/* Ikona dekoracyjna */}
      <View style={styles.decorativeIcon}>
        <Text style={styles.bigEgg}>🥚</Text>
      </View>

      {/* Lista trybów */}
      <View style={styles.modesContainer}>
        {COOKING_MODES.map((mode) => (
          <ModeButton
            key={mode.id}
            mode={mode}
            onPress={() => handleModePress(mode)}
          />
        ))}
      </View>

      {/* Stopka */}
      <Text style={styles.footer}>
        Tap a mode to start
      </Text>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* MODAL Z INSTRUKCJĄ (Onsen Tamago)                                   */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <Modal
        visible={pendingMode !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>♨️</Text>
            <Text style={styles.modalTitle}>
              {pendingMode?.name}
            </Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalInstructionLabel}>
              HOW TO PREPARE
            </Text>
            <Text style={styles.modalInstructionText}>
              {pendingMode?.instruction}
            </Text>
            <Text style={styles.modalHint}>
              Onsen Tamago isn't cooked in actively boiling water — the eggs
              gently mature in a hot bath at a constant temperature.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleCancel}
                activeOpacity={0.75}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleConfirmStart}
                activeOpacity={0.85}
              >
                <Text style={styles.modalButtonPrimaryText}>
                  Start ({pendingMode ? pendingMode.duration / 60 : 0} min)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  🔘 PRZYCISK TRYBU
// ════════════════════════════════════════════════════════════════════════════

function ModeButton({ mode, onPress }) {
  // Animacja "shimmer" dla trybu Onsen
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode.isSpecial) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [mode.isSpecial, shimmerAnim]);

  const borderColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.gold, COLORS.primary],
  });

  const formatMinutes = (seconds) => `${seconds / 60} min`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Animated.View
        style={[
          styles.modeButton,
          mode.isSpecial && {
            borderWidth: 3,
            borderColor: borderColor,
            backgroundColor: COLORS.cream,
          },
        ]}
      >
        <View style={styles.modeIconBox}>
          <Text style={styles.modeEmoji}>{mode.emoji}</Text>
        </View>

        <View style={styles.modeTextContainer}>
          <View style={styles.modeNameRow}>
            <Text style={styles.modeName}>{mode.name}</Text>
            {mode.isSpecial && (
              <View style={styles.specialBadge}>
                <Text style={styles.specialBadgeText}>SPECIAL</Text>
              </View>
            )}
          </View>
          <Text style={styles.modeTime}>{formatMinutes(mode.duration)}</Text>
          <Text
            style={[
              styles.modeDescription,
              mode.isSpecial && styles.modeDescriptionSpecial,
            ]}
            numberOfLines={2}
          >
            {mode.description}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ⏰ EKRAN ODLICZANIA
// ════════════════════════════════════════════════════════════════════════════

function TimerScreen({ mode, onBack }) {
  const [remainingSeconds, setRemainingSeconds] = useState(mode.duration);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Animacja pulsującego jajka
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animacja obracającej się klepsydry
  const hourglassRotate = useRef(new Animated.Value(0)).current;

  // Animacja "bounce" dla komunikatu końcowego
  const finishAnim = useRef(new Animated.Value(0)).current;

  // ──────────────────────────────────────────────────────────────────────────
  // Logika odliczania - useEffect z setInterval
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || isFinished) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimerFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isFinished]);

  // ──────────────────────────────────────────────────────────────────────────
  // Animacja pulsującego jajka (gdy odlicza)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isFinished) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [isFinished, pulseAnim]);

  // ──────────────────────────────────────────────────────────────────────────
  // Animacja klepsydry - obrót co kilka sekund
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isFinished) return;

    const rotation = Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(hourglassRotate, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    rotation.start();

    return () => rotation.stop();
  }, [isFinished, hourglassRotate]);

  // ──────────────────────────────────────────────────────────────────────────
  // Zakończenie odliczania - wibracje + komunikat
  // ──────────────────────────────────────────────────────────────────────────
  const handleTimerFinish = () => {
    setIsFinished(true);

    // 📳 MOCNE WIBRACJE - wzorzec pulsujący
    // Pattern: [delay, vibrate, pause, vibrate, pause, vibrate, ...]
    const pattern = [0, 500, 200, 500, 200, 500, 200, 1000];
    Vibration.vibrate(pattern);

    // Animacja pojawienia się komunikatu
    Animated.spring(finishAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // 🔊 MIEJSCE NA DŹWIĘK ALARMU
    // Aby dodać dźwięk: zainstaluj react-native-sound lub expo-av
    // i odtwórz plik audio w tym miejscu
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Powrót do ekranu wyboru - zatrzymanie wibracji
  // ──────────────────────────────────────────────────────────────────────────
  const handleBack = () => {
    Vibration.cancel();
    onBack();
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Formatowanie czasu MM:SS
  // ──────────────────────────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Postęp gotowania (0.0 - 1.0)
  const progress = 1 - remainingSeconds / mode.duration;

  // Interpolacja obrotu klepsydry
  const rotateInterpolate = hourglassRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.timerContainer}>
      {/* Górny pasek */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backButtonArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.timerModeTitle}>{mode.name}</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {/* Klepsydra */}
      <View style={styles.hourglassContainer}>
        <Animated.Text
          style={[
            styles.hourglass,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          ⏳
        </Animated.Text>
      </View>

      {/* Pulsujące jajko */}
      <Animated.View
        style={[
          styles.eggContainer,
          {
            transform: [{ scale: isFinished ? 1.3 : pulseAnim }],
          },
        ]}
      >
        <Text style={styles.bigCookingEgg}>
          {isFinished ? '✨' : mode.emoji}
        </Text>
      </Animated.View>

      {/* Wyświetlanie czasu lub komunikatu końcowego */}
      {!isFinished ? (
        <>
          <Text style={styles.timeDisplay}>
            {formatTime(remainingSeconds)}
          </Text>
          <Text style={styles.statusText}>
            {isPaused ? 'Paused' : 'Cooking...'}
          </Text>

          {/* Pasek postępu */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </>
      ) : (
        <Animated.View
          style={[
            styles.finishContainer,
            {
              opacity: finishAnim,
              transform: [
                {
                  scale: finishAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.finishMessage}>
            Your perfect egg is ready!
          </Text>
          <Text style={styles.finishSubMessage}>
            Take it out of the water and enjoy 🍽️
          </Text>
        </Animated.View>
      )}

      {/* Specjalny opis dla Onsen Tamago */}
      {mode.isSpecial && !isFinished && (
        <View style={styles.onsenInfoBox}>
          <Text style={styles.onsenInfoIcon}>♨️</Text>
          <Text style={styles.onsenInfoText}>
            Secret of Japanese masters: creamy yolk, runny white
          </Text>
        </View>
      )}

      {/* Przyciski sterowania */}
      <View style={styles.controlsContainer}>
        {!isFinished && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsPaused(!isPaused)}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>
              {isPaused ? '▶' : '⏸'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.controlButton,
            isFinished && styles.controlButtonFinish,
          ]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>
            {isFinished ? '✓' : '✕'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  🎨 STYLE
// ════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── EKRAN WYBORU ─────────────────────────────────────────────────────────
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.softText,
    marginTop: 4,
  },
  decorativeIcon: {
    marginVertical: 24,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  bigEgg: {
    fontSize: 64,
  },
  modesContainer: {
    width: '100%',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: COLORS.softText,
    fontStyle: 'italic',
  },

  // ── PRZYCISK TRYBU ───────────────────────────────────────────────────────
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  modeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  specialBadge: {
    marginLeft: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specialBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: 0.5,
  },
  modeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  modeDescription: {
    fontSize: 12,
    color: COLORS.softText,
    marginTop: 2,
  },
  modeDescriptionSpecial: {
    fontStyle: 'italic',
    color: COLORS.darkText,
  },
  arrow: {
    fontSize: 28,
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '300',
  },

  // ── EKRAN ODLICZANIA ─────────────────────────────────────────────────────
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonArrow: {
    fontSize: 22,
    color: COLORS.darkText,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: -2,
  },
  topBarSpacer: {
    width: 44,
    height: 44,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  timerModeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  hourglassContainer: {
    marginTop: 10,
  },
  hourglass: {
    fontSize: 48,
  },
  eggContainer: {
    marginVertical: 24,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bigCookingEgg: {
    fontSize: 80,
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: '300',
    color: COLORS.darkText,
    letterSpacing: 3,
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.softText,
    marginTop: 4,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: COLORS.cream,
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },

  // ── KOMUNIKAT ZAKOŃCZENIA ────────────────────────────────────────────────
  finishContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  finishMessage: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.success,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  finishSubMessage: {
    fontSize: 14,
    color: COLORS.softText,
    marginTop: 8,
    textAlign: 'center',
  },

  // ── BOX ONSEN ────────────────────────────────────────────────────────────
  onsenInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  onsenInfoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  onsenInfoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkText,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // ── PRZYCISKI STEROWANIA ─────────────────────────────────────────────────
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: 10,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  controlButtonFinish: {
    backgroundColor: COLORS.success,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  controlButtonText: {
    fontSize: 28,
    color: COLORS.darkText,
  },

  // ────────────────────────────────────────────────────────────────────────
  // MODAL Z INSTRUKCJĄ (Onsen Tamago)
  // ────────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(60, 40, 20, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  modalDivider: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginBottom: 18,
  },
  modalInstructionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  modalInstructionText: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalHint: {
    fontSize: 12,
    color: '#8D6E63',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 22,
    paddingHorizontal: 6,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalButtonSecondaryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
