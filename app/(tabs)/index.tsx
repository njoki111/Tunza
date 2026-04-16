// CareBridge - Dashboard Screen (Production Grade)
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  Calendar,
  Clock,
  ChevronRight,
  Star,
  Shield,
  Users,
  Plus,
  Phone,
  FileText,
  Inbox,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockCaregivers, mockRequests, mockUser } from '@/constants/mockData';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const activeRequests = useMemo(() =>
    mockRequests.filter(r => r.status === 'confirmed' || r.status === 'pending'),
    []
  );
  const featuredCaregivers = mockCaregivers.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return colors.success.DEFAULT;
      case 'pending': return colors.warning.DEFAULT;
      case 'completed': return colors.primary[500];
      default: return colors.secondary[400];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{mockUser.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Card */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find Trusted Care</Text>
            <Text style={styles.heroSubtitle}>
              Connect with certified caregivers for your loved ones
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push('/caregivers')}
            >
              <Text style={styles.heroButtonText}>Find a Caregiver</Text>
              <ChevronRight size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroIcon}>
            <Heart size={48} color={colors.primary[300]} fill={colors.primary[300]} />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(150)}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/request/new')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary[100] }]}>
                <Plus size={22} color={colors.primary[600]} />
              </View>
              <Text style={styles.quickActionText}>Book Care</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.success.light }]}>
                <Phone size={22} color={colors.success.dark} />
              </View>
              <Text style={styles.quickActionText}>Emergency</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/requests')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary[100] }]}>
                <FileText size={22} color={colors.secondary[700]} />
              </View>
              <Text style={styles.quickActionText}>My Requests</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary[100] }]}>
              <Shield size={20} color={colors.primary[600]} />
            </View>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Verified Caregivers</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.success.light }]}>
              <Users size={20} color={colors.success.dark} />
            </View>
            <Text style={styles.statNumber}>2k+</Text>
            <Text style={styles.statLabel}>Families Helped</Text>
          </View>
        </Animated.View>

        {/* Active Requests */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Requests</Text>
            <TouchableOpacity onPress={() => router.push('/requests')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {activeRequests.length > 0 ? (
            activeRequests.slice(0, 2).map((request, index) => (
              <Animated.View
                key={request.id}
                entering={FadeInRight.delay(index * 100)}
              >
                <TouchableOpacity
                  style={styles.requestCard}
                  onPress={() => router.push('/requests')}
                >
                  <Image source={{ uri: request.caregiverAvatar }} style={styles.requestAvatar} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestCaregiver}>{request.caregiverName}</Text>
                    <View style={styles.requestRow}>
                      <Calendar size={14} color={colors.secondary[500]} />
                      <Text style={styles.requestDate}>
                        {new Date(request.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={styles.requestRow}>
                      <Clock size={14} color={colors.secondary[500]} />
                      <Text style={styles.requestTime}>{request.startTime} - {request.endTime}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyRequests}>
              <View style={styles.emptyRequestsIcon}>
                <Inbox size={32} color={colors.secondary[400]} />
              </View>
              <Text style={styles.emptyRequestsTitle}>No active requests</Text>
              <Text style={styles.emptyRequestsSubtitle}>
                Book your first caregiver to get started
              </Text>
              <TouchableOpacity
                style={styles.emptyRequestsButton}
                onPress={() => router.push('/request/new')}
              >
                <Text style={styles.emptyRequestsButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Featured Caregivers */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Caregivers</Text>
            <TouchableOpacity onPress={() => router.push('/caregivers')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.caregiversScroll}
          >
            {featuredCaregivers.map((caregiver, index) => (
              <Animated.View key={caregiver.id} entering={FadeInUp.delay(350 + index * 50)}>
                <TouchableOpacity
                  style={styles.caregiverCard}
                  onPress={() => router.push(`/caregiver/${caregiver.id}`)}
                >
                  <Image source={{ uri: caregiver.avatar }} style={styles.caregiverImage} />
                  {caregiver.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Shield size={12} color={colors.white} fill={colors.success.DEFAULT} />
                    </View>
                  )}
                  <View style={styles.caregiverInfo}>
                    <Text style={styles.caregiverName}>{caregiver.name}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={14} color={colors.warning.DEFAULT} fill={colors.warning.DEFAULT} />
                      <Text style={styles.ratingText}>{caregiver.rating}</Text>
                      <Text style={styles.reviewCount}>({caregiver.reviewCount})</Text>
                    </View>
                    <Text style={styles.hourlyRate}>${caregiver.hourlyRate}/hr</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: colors.secondary[500],
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heroCard: {
    backgroundColor: colors.primary[600],
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.primary[100],
    marginBottom: 16,
    lineHeight: 20,
  },
  heroButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  heroButtonText: {
    color: colors.primary[700],
    fontSize: 14,
    fontWeight: '600',
  },
  heroIcon: {
    marginLeft: 12,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[800],
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondary[700],
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondary[500],
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  requestAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 14,
  },
  requestCaregiver: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  requestDate: {
    fontSize: 13,
    color: colors.secondary[500],
  },
  requestTime: {
    fontSize: 13,
    color: colors.secondary[500],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyRequests: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyRequestsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyRequestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[800],
    marginBottom: 6,
  },
  emptyRequestsSubtitle: {
    fontSize: 14,
    color: colors.secondary[500],
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyRequestsButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyRequestsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  caregiversScroll: {
    paddingRight: 20,
    gap: 12,
  },
  caregiverCard: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.secondary[100],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  caregiverImage: {
    width: '100%',
    height: 120,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.success.DEFAULT,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caregiverInfo: {
    padding: 12,
  },
  caregiverName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary[700],
  },
  reviewCount: {
    fontSize: 12,
    color: colors.secondary[400],
  },
  hourlyRate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[600],
  },
});
