// CareBridge - Caregivers Listing (Production Grade)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Star,
  Shield,
  MapPin,
  Clock,
  Filter,
  ChevronRight,
  UserX,
  CheckCircle2,
  Award,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCaregivers } from '@/hooks/useCaregivers';
import { router } from 'expo-router';

const SPECIALTIES = ['All', 'Elderly Care', 'Dementia Care', 'Palliative Care', 'Post-Surgery', "Alzheimer's"];

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  certifications: string[];
  experience: number;
  location: string;
  isVerified: boolean;
  backgroundChecked: boolean;
}

export default function CaregiversScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
 
  // Transform data to match your Caregiver interface
  const enhancedCaregivers: Caregiver[] = useMemo(() => {
    return (caregivers || []).map((c: any) => ({
      id: c.id,
      name: c.name || c.users?.name || 'Unknown',
      avatar: c.avatar || 'https://via.placeholder.com/64',
      rating: c.rating || 0,
      reviewCount: c.review_count || 0,
      hourlyRate: c.hourly_rate || 0,
      specialties: c.specialties || [],
      certifications: c.certifications || [],
      experience: c.experience_years || 0,
      location: c.location || 'Unknown',
      isVerified: c.verified || false,
      backgroundChecked: c.background_checked || true,
    }));
  }, [caregivers]);

  const filteredCaregivers = useMemo(() => {
    return enhancedCaregivers.filter(caregiver => {
      const matchesSearch = caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caregiver.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpecialty = selectedSpecialty === 'All' ||
        caregiver.specialties.some(s => s.includes(selectedSpecialty));
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty, enhancedCaregivers]);

  const handleSpecialtyChange = useCallback((specialty: string) => {
  setSelectedSpecialty(specialty);
}, []);


  const renderCaregiver = useCallback(({ item, index }: { item: Caregiver; index: number }) => (
    <FadeInView delay={index * 50}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/caregiver/${item.id}`)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color={colors.white} fill={colors.success.DEFAULT} />
                </View>
              )}
            </View>
            <View style={styles.ratingRow}>
              <Star size={14} color={colors.warning.DEFAULT} fill={colors.warning.DEFAULT} />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviewCount} reviews)</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.secondary[400]} />
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.rateContainer}>
            <Text style={styles.rate}>${item.hourlyRate}</Text>
            <Text style={styles.rateUnit}>/hr</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.trustSignals}>
          <View style={styles.trustItem}>
            <CheckCircle2 size={14} color={colors.success.DEFAULT} />
            <Text style={styles.trustText}>Background Checked</Text>
          </View>
          <View style={styles.trustItem}>
            <Award size={14} color={colors.primary[500]} />
            <Text style={styles.trustText}>{item.certifications[0] || 'Certified'}</Text>
          </View>
        </View>

        <View style={styles.specialtiesContainer}>
          {item.specialties.slice(0, 3).map((specialty, idx) => (
            <View key={idx} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.experienceRow}>
            <Clock size={14} color={colors.primary[500]} />
            <Text style={styles.experienceText}>{item.experience} years exp.</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>View Profile</Text>
            <ChevronRight size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </FadeInView>
  ), []);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <UserX size={48} color={colors.secondary[300]} />
      </View>
      <Text style={styles.emptyTitle}>No caregivers found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters to find what you're looking for
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedSpecialty('All');
        }}
      >
        <Text style={styles.emptyButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading caregivers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Find Caregivers</Text>
          <Text style={styles.headerSubtitle}>Book trusted care for your loved ones</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.secondary[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or specialty..."
            placeholderTextColor={colors.secondary[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Specialty Filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={SPECIALTIES}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedSpecialty === item && styles.filterChipActive
            ]}
            onPress={() => handleSpecialtyChange(item)}
          >
            <Text style={[
              styles.filterChipText,
              selectedSpecialty === item && styles.filterChipTextActive
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredCaregivers.length} caregiver{filteredCaregivers.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Caregivers List */}
      <FlatList
        data={filteredCaregivers}
        keyExtractor={(item) => item.id}
        renderItem={renderCaregiver}
        contentContainerStyle={[
          styles.listContent,
          filteredCaregivers.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary[50],
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondary[500],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.secondary[900],
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary[100],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.secondary[100],
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondary[600],
  },
  filterChipTextActive: {
    color: colors.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.secondary[50],
  },
  resultsText: {
    fontSize: 14,
    color: colors.secondary[500],
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondary[500],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary[900],
  },
  verifiedBadge: {
    backgroundColor: colors.success.DEFAULT,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary[800],
  },
  reviews: {
    fontSize: 13,
    color: colors.secondary[400],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: colors.secondary[500],
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rate: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
  },
  rateUnit: {
    fontSize: 12,
    color: colors.secondary[400],
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary[100],
    marginVertical: 12,
  },
  trustSignals: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 12,
    color: colors.secondary[600],
    fontWeight: '500',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  experienceText: {
    fontSize: 13,
    color: colors.secondary[600],
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary[800],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.secondary[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});