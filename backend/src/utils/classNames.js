/**
 * Ragnarok Online Job Class IDs and Name Mapping
 */

export const JOB_CLASSES = {
  0: { name: 'Novice', tier: 'Novice' },
  1: { name: 'Swordman', tier: '1st Class' },
  2: { name: 'Mage', tier: '1st Class' },
  3: { name: 'Archer', tier: '1st Class' },
  4: { name: 'Acolyte', tier: '1st Class' },
  5: { name: 'Merchant', tier: '1st Class' },
  6: { name: 'Thief', tier: '1st Class' },
  7: { name: 'Knight', tier: '2nd Class' },
  8: { name: 'Priest', tier: '2nd Class' },
  9: { name: 'Wizard', tier: '2nd Class' },
  10: { name: 'Blacksmith', tier: '2nd Class' },
  11: { name: 'Hunter', tier: '2nd Class' },
  12: { name: 'Assassin', tier: '2nd Class' },
  14: { name: 'Crusader', tier: '2nd Class' },
  15: { name: 'Monk', tier: '2nd Class' },
  16: { name: 'Sage', tier: '2nd Class' },
  17: { name: 'Rogue', tier: '2nd Class' },
  18: { name: 'Alchemist', tier: '2nd Class' },
  19: { name: 'Bard', tier: '2nd Class' },
  20: { name: 'Dancer', tier: '2nd Class' },
  23: { name: 'Super Novice', tier: 'Expanded' },
  24: { name: 'Gunslinger', tier: 'Expanded' },
  25: { name: 'Ninja', tier: 'Expanded' },
  4001: { name: 'High Novice', tier: 'Transcendent' },
  4002: { name: 'High Swordman', tier: 'Transcendent' },
  4003: { name: 'High Mage', tier: 'Transcendent' },
  4004: { name: 'High Archer', tier: 'Transcendent' },
  4005: { name: 'High Acolyte', tier: 'Transcendent' },
  4006: { name: 'High Merchant', tier: 'Transcendent' },
  4007: { name: 'High Thief', tier: 'Transcendent' },
  4008: { name: 'Lord Knight', tier: 'Transcendent' },
  4009: { name: 'High Priest', tier: 'Transcendent' },
  4010: { name: 'High Wizard', tier: 'Transcendent' },
  4011: { name: 'Whitesmith', tier: 'Transcendent' },
  4012: { name: 'Sniper', tier: 'Transcendent' },
  4013: { name: 'Assassin Cross', tier: 'Transcendent' },
  4015: { name: 'Paladin', tier: 'Transcendent' },
  4016: { name: 'Champion', tier: 'Transcendent' },
  4017: { name: 'Professor', tier: 'Transcendent' },
  4018: { name: 'Stalker', tier: 'Transcendent' },
  4019: { name: 'Creator', tier: 'Transcendent' },
  4020: { name: 'Clown', tier: 'Transcendent' },
  4021: { name: 'Gypsy', tier: 'Transcendent' },
  4046: { name: 'Taekwon', tier: 'Expanded' },
  4047: { name: 'Star Gladiator', tier: 'Expanded' },
  4049: { name: 'Soul Linker', tier: 'Expanded' }
};

export function getJobInfo(jobId) {
  return JOB_CLASSES[jobId] || { name: `Job #${jobId}`, tier: 'Unknown' };
}
