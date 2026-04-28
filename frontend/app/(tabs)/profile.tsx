// CareBridge - User Profile (Production Grade)
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Heart,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Settings,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockUser } from '@/constants/mockData';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const MENU_ITEMS = [
  { icon: User, label: 'Personal Information', color: colors.primary[500] },
  { icon: Heart, label: 'Saved Caregivers', color: colors.error.DEFAULT },
  { icon: CreditCard, label: 'Payment Methods', color: colors.success.DEFAULT },
  { icon: Bell, label: 'Notifications', color: colors.warning.DEFAULT },
  { icon: Shield, label: 'Privacy & Security', color: colors.primary[600] },
  { icon: HelpCircle, label: 'Help & Support', color: colors.secondary[500] },
  { icon: Settings, label: 'Settings', color: colors.secondary[600] },
];

export default function ProfileScreen() {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(fadeAnim1, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim2, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim3, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim4, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim5, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim1, transform: [{ translateY: fadeAnim1.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View style={[styles.profileCard, { opacity: fadeAnim2, transform: [{ translateY: fadeAnim2.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Image source={{ uri: mockUser.avatar }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{mockUser.name}</Text>
            <Text style={styles.profileEmail}>{mockUser.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Family Member</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim3, transform: [{ translateY: fadeAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Care Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Caregivers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim4, transform: [{ translateY: fadeAnim4.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color={colors.secondary[400]} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout Button */}
        <Animated.View style={{ opacity: fadeAnim5, transform: [{ translateY: fadeAnim5.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={colors.error.DEFAULT} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <Text style={styles.versionText}>CareBridge v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.primary[100],
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: colors.white + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  editButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[700],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.secondary[500],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.secondary[200],
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.secondary[800],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: colors.error.light + '30',
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error.DEFAULT,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: colors.secondary[400],
  },
});
