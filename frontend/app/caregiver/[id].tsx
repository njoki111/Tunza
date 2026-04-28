// CareBridge - Caregiver Detail (Production Grade)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator, // ADD THIS
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  Shield,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Award,
  Globe,
  ArrowLeft,
  Heart,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useCaregiverDetail } from '../../hooks/useCaregiverDetail';

const { width } = Dimensions.get('window');

export default function CaregiverDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Your hook returns the caregiver directly (no loading state)
  const caregiver = useCaregiverDetail(id);

  // Simple loading check (assuming null/undefined means loading)
  if (!caregiver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading caregiver details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.secondary[800]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={24} color={colors.error.DEFAULT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <Animated.View entering={FadeInUp} style={styles.profileSection}>
          <Image source={{ uri: caregiver.avatar }} style={styles.profileImage} />
          <View style={styles.verifiedBadgeLarge}>
            <Shield size={20} color={colors.white} fill={colors.success.DEFAULT} />
          </View>
        </Animated.View>

        {/* Name & Rating */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.nameSection}>
          <Text style={styles.name}>{caregiver.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={18} color={colors.warning.DEFAULT} fill={colors.warning.DEFAULT} />
            <Text style={styles.rating}>{caregiver.rating}</Text>
            <Text style={styles.reviewCount}>({caregiver.reviewCount} reviews)</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.secondary[500]} />
            <Text style={styles.location}>{caregiver.location}</Text>
          </View>
        </Animated.View>

        {/* Trust Signals */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.trustContainer}>
          <View style={styles.trustItem}>
            <CheckCircle2 size={16} color={colors.success.DEFAULT} />
            <Text style={styles.trustText}>Background Checked</Text>
          </View>
          <View style={styles.trustItem}>
            <Shield size={16} color={colors.primary[500]} />
            <Text style={styles.trustText}>Identity Verified</Text>
          </View>
        </Animated.View>

        {/* Rate & Action Buttons */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.actionSection}>
          <View style={styles.rateContainer}>
            <Text style={styles.rate}>${caregiver.hourlyRate}</Text>
            <Text style={styles.rateUnit}>/hour</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={20} color={colors.primary[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => router.push({
                pathname: '/requests/new',
                params: { caregiverId: caregiver.id }
              })}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Clock size={20} color={colors.primary[500]} />
            <Text style={styles.statValue}>{caregiver.experience}+</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={20} color={colors.primary[500]} />
            <Text style={styles.statValue}>{caregiver.certifications?.length || 0}</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
          <View style={styles.statBox}>
            <Globe size={20} color={colors.primary[500]} />
            <Text style={styles.statValue}>{caregiver.languages?.length || 0}</Text>
            <Text style={styles.statLabel}>Languages</Text>
          </View>
        </Animated.View>

        {/* Bio */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{caregiver.bio || 'No bio available'}</Text>
        </Animated.View>

        {/* Specialties */}
        {caregiver.specialties && caregiver.specialties.length > 0 && (
          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {caregiver.specialties.map((specialty: string, index: number) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Certifications */}
        {caregiver.certifications && caregiver.certifications.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.certificationsContainer}>
              {caregiver.certifications.map((cert: string, index: number) => (
                <View key={index} style={styles.certificationItem}>
                  <Award size={16} color={colors.success.DEFAULT} />
                  <Text style={styles.certificationText}>{cert}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Languages */}
        {caregiver.languages && caregiver.languages.length > 0 && (
          <Animated.View entering={FadeInUp.delay(450)} style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
              {caregiver.languages.map((language: string, index: number) => (
                <View key={index} style={styles.languageTag}>
                  <Globe size={14} color={colors.primary[600]} />
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Availability */}
        {caregiver.availability && caregiver.availability.length > 0 && (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityContainer}>
              {caregiver.availability.map((slot: any, index: number) => (
                <View key={index} style={styles.availabilityItem}>
                  <Calendar size={16} color={colors.primary[500]} />
                  <Text style={styles.availabilityDay}>{slot.day}</Text>
                  <Text style={styles.availabilityTime}>{slot.startTime} - {slot.endTime}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondary[500],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.secondary[600],
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonErrorText: {
    color: colors.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.secondary[50],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  verifiedBadgeLarge: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 60,
    backgroundColor: colors.success.DEFAULT,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[800],
  },
  reviewCount: {
    fontSize: 14,
    color: colors.secondary[400],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: colors.secondary[500],
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    color: colors.secondary[600],
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rate: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary[600],
  },
  rateUnit: {
    fontSize: 16,
    color: colors.secondary[400],
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
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
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondary[500],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: colors.secondary[600],
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  specialtyText: {
    fontSize: 14,
    color: colors.primary[700],
    fontWeight: '500',
  },
  certificationsContainer: {
    gap: 10,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.success.light + '20',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  certificationText: {
    fontSize: 14,
    color: colors.success.dark,
    fontWeight: '500',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondary[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 14,
    color: colors.secondary[700],
  },
  availabilityContainer: {
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  availabilityDay: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary[800],
  },
  availabilityTime: {
    flex: 1,
    fontSize: 14,
    color: colors.secondary[600],
  },
});