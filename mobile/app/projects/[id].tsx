import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Clip {
  id: string;
  rank: number;
  score: number;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
  rationale: string;
  title: string;
}

// Mock data
const mockClips: Clip[] = [
  {
    id: '1',
    rank: 1,
    score: 9.5,
    duration: '0:32',
    status: 'pending',
    rationale: 'Perfect hook with high retention probability.',
    title: 'Viral Clip #1',
  },
  {
    id: '2',
    rank: 2,
    score: 8.8,
    duration: '0:45',
    status: 'pending',
    rationale: 'Strong emotional connection in middle segment.',
    title: 'Viral Clip #2',
  },
  {
    id: '3',
    rank: 3,
    score: 7.2,
    duration: '0:18',
    status: 'pending',
    rationale: 'Short and punchy, good for Stories.',
    title: 'Viral Clip #3',
  },
];

const tabs = ['Script', 'Clips', 'Suggestions'];

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Clips');
  const [clips, setClips] = useState<Clip[]>(mockClips);

  const handleClipAction = (clipId: string, status: 'approved' | 'rejected') => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, status } : clip
    ));
  };

  const renderClipCard = ({ item: clip }: { item: Clip }) => (
    <Card
      style={{
        ...styles.clipCard,
        ...(clip.status === 'approved' ? styles.clipCardApproved : {}),
        ...(clip.status === 'rejected' ? styles.clipCardRejected : {}),
      }}
      onPress={() => router.push(`/clips/${clip.id}`)}
    >
      <View style={styles.clipContent}>
        {/* Thumbnail */}
        <View style={styles.clipThumbnail}>
          <Ionicons name="play" size={24} color="rgba(255,255,255,0.8)" />
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{clip.rank}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{clip.duration}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.clipInfo}>
          <View style={styles.clipHeader}>
            <Text style={styles.clipTitle} numberOfLines={1}>{clip.title}</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{clip.score}/10</Text>
            </View>
          </View>
          <Text style={styles.clipRationale} numberOfLines={2}>
            {clip.rationale}
          </Text>

          {/* Actions */}
          <View style={styles.clipActions}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.rejectBtn,
                clip.status === 'rejected' && styles.rejectBtnActive,
              ]}
              onPress={() => handleClipAction(clip.id, 'rejected')}
            >
              <Ionicons
                name="close"
                size={16}
                color={clip.status === 'rejected' ? '#DC2626' : '#9CA3AF'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.approveBtn,
                clip.status === 'approved' && styles.approveBtnActive,
              ]}
              onPress={() => handleClipAction(clip.id, 'approved')}
            >
              <Ionicons
                name="checkmark"
                size={16}
                color={clip.status === 'approved' ? '#fff' : '#00D4AA'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Project Details</Text>
        </View>
        <Button size="sm">Export</Button>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {activeTab === 'Clips' && (
        <FlatList
          data={clips}
          keyExtractor={item => item.id}
          renderItem={renderClipCard}
          contentContainerStyle={styles.clipsList}
          ListHeaderComponent={
            <View style={styles.clipsHeader}>
              <Text style={styles.clipsTitle}>GENERATED CLIPS</Text>
              <Badge>{clips.length}</Badge>
            </View>
          }
        />
      )}

      {activeTab === 'Script' && (
        <ScrollView contentContainerStyle={styles.scriptContent}>
          <Card style={styles.scriptCard}>
            <Text style={styles.scriptTitle}>Transcript</Text>
            <View style={styles.scriptBlock}>
              <Text style={styles.timestamp}>00:00</Text>
              <Text style={styles.scriptText}>
                Welcome back to the podcast. Today we're talking about the future of AI...
              </Text>
            </View>
            <View style={styles.scriptBlock}>
              <Text style={styles.timestamp}>00:15</Text>
              <Text style={styles.scriptText}>
                I never thought I'd say this, but the tools we have now are actually scary good...
              </Text>
            </View>
          </Card>
        </ScrollView>
      )}

      {activeTab === 'Suggestions' && (
        <ScrollView contentContainerStyle={styles.suggestionsContent}>
          <Card style={{...styles.suggestionCard, ...styles.suggestionSuccess}}>
            <Text style={styles.suggestionTitle}>Add a CTA at 0:45</Text>
            <Text style={styles.suggestionText}>
              Engagement drops here. Consider adding a visual pop-up asking viewers to subscribe.
            </Text>
          </Card>
          <Card style={{...styles.suggestionCard, ...styles.suggestionWarning}}>
            <Text style={styles.suggestionTitle}>Pattern Interrupt needed</Text>
            <Text style={styles.suggestionText}>
              The segment from 0:15 to 0:30 is static. Add B-roll or a zoom cut.
            </Text>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#00D4AA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  clipsList: {
    padding: 16,
    paddingBottom: 100,
  },
  clipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  clipsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  clipCard: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  clipCardApproved: {
    borderColor: '#00D4AA',
  },
  clipCardRejected: {
    borderColor: '#E5E5EA',
    opacity: 0.6,
  },
  clipContent: {
    flexDirection: 'row',
    height: 112,
  },
  clipThumbnail: {
    width: 112,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00D4AA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#FFFFFF',
  },
  clipInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  clipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  scoreBadge: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00D4AA',
  },
  clipRationale: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  clipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    backgroundColor: '#F3F4F6',
  },
  rejectBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  approveBtn: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
  },
  approveBtnActive: {
    backgroundColor: '#00D4AA',
  },
  scriptContent: {
    padding: 16,
    paddingBottom: 100,
  },
  scriptCard: {
    padding: 24,
  },
  scriptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  scriptBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  scriptText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  suggestionsContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  suggestionCard: {
    padding: 16,
    borderLeftWidth: 4,
  },
  suggestionSuccess: {
    borderLeftColor: '#00D4AA',
  },
  suggestionWarning: {
    borderLeftColor: '#F59E0B',
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
